{-# LANGUAGE OverloadedStrings #-}

import Control.Monad
import Control.Applicative
import Data.Char
import Data.List
import System.IO
import System.Environment
import Database.PostgreSQL.Simple
import Database.PostgreSQL.Simple.FromRow
import Database.PostgreSQL.Simple.ToRow
import Database.PostgreSQL.Simple.ToField

data Todo = Todo {
    todo_id :: Maybe Int,
    task :: Maybe String,
    complete :: Maybe Bool
} deriving (Show)

instance FromRow Todo where
    fromRow = Todo <$> field <*> field <*> field

instance ToRow Todo where
    toRow d = [ toField (todo_id d), toField (task d), toField (complete d) ]

getTodos = do
    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    rows <- query_ connection "select id as todo_id, task::text, complete from todo"
    return (rows :: [Todo])

todoToString :: Todo -> String
todoToString (Todo _ (Just t) (Just completed))
    = if completed
        then "\x1b[32m" ++ t ++ "\x1b[0m"
        else "\x1b[31m" ++ t ++ "\x1b[0m"

combineTuple :: (Int, String) -> String
combineTuple (i, s) = (show i) ++ ") " ++ s

getTodosAsPrettyList :: [Todo] -> String
getTodosAsPrettyList todos = unlines $ map combineTuple $ zip [1..] $ map todoToString todos

printTodos = do
    todos <- getTodos
    putStrLn $ getTodosAsPrettyList todos

handleArgs :: [String] -> IO ()
handleArgs [] = do printTodos
handleArgs ["show"] = do printTodos
handleArgs ["done", id] = do doneTodo $ read id
handleArgs [_] = do putStrLn "Dont know what to do yet"

getTodoByOrdinal :: Int -> IO Todo
getTodoByOrdinal id = do
    todos <- getTodos
    return (todos !! id)

getTodoID :: Todo -> Int
getTodoID (Todo (Just id) _ _) = id

getTodo index = do
    todos <- getTodos
    return (todos !! (index - 1))


doneTodo :: Int -> IO ()
doneTodo index = do
    todo <- getTodoByOrdinal index
    putStrLn $ show $ getTodoID todo

main = do
    putStrLn $ "\x1b[32m" ++ "highlight me" ++ "\x1b[0m" ++ " but not me"
    s <- getArgs
    handleArgs s


