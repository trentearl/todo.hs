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
    rows <- query_ connection "select id as todo_id, task::text, complete from todo order by created_at, id"
    return (rows :: [Todo])

todoToString :: Todo -> String
todoToString (Todo _ (Just t) (Just completed))
    = if completed
        then "\x1b[37m" ++ t ++ "\x1b[0m"
        else "\x1b[32m" ++ t ++ "\x1b[0m"

combineTuple :: (Int, String) -> String
combineTuple (i, s) = (if i <= 9 then (" " ++ show i) else show i) ++ ") " ++ s

getTodosAsPrettyList :: [Todo] -> String
getTodosAsPrettyList todos = unlines $ map combineTuple $ zip [1..] $ map todoToString todos

printTodos = do
    todos <- getTodos
    putStrLn $ getTodosAsPrettyList todos

handleArgs :: [String] -> IO ()
handleArgs [] = do printTodos
handleArgs ["show"] = do printTodos
handleArgs ["flush"] = do flush
handleArgs ["d", id] = do doneTodo $ read id
handleArgs ["done", id] = do doneTodo $ read id
handleArgs ["delete", id] = do deleteTodo $ read id
handleArgs ["rm", id] = do deleteTodo $ read id
handleArgs ["prioritize", id] = do prioritizeTodo $ read id
handleArgs ["p", id] = do prioritizeTodo $ read id
handleArgs ["not", "done", id] = do notDoneTodo $ read id
handleArgs ["not", "d", id] = do notDoneTodo $ read id
handleArgs ("add":taskWords) = do addTodo $ unwords taskWords
handleArgs ("a":taskWords) = do addTodo $ unwords taskWords
handleArgs [_] = do putStrLn "Dont know what to do yet"

getTodoByOrdinal :: Int -> IO Todo
getTodoByOrdinal id = do
    todos <- getTodos
    return (todos !! (id - 1))

flush :: IO ()
flush = do
    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    execute connection "delete from todo where complete = true" ()
    printTodos


getTodoID :: Todo -> Int
getTodoID (Todo (Just id) _ _) = id

getTodo index = do
    todos <- getTodos
    return (todos !! (index))

doneTodo :: Int -> IO ()
doneTodo index = do
    todo <- getTodoByOrdinal index
    let id = getTodoID todo

    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    execute connection "update todo set complete = true where id = ?" (Only id)
    printTodos

prioritizeTodo :: Int -> IO ()
prioritizeTodo index = do
    todo <- getTodoByOrdinal index
    let id = getTodoID todo

    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    execute connection "update todo set created_at = (select min(created_at) - interval '1 seconds' from todo) where id = ?" (Only id)
    printTodos

addTodo :: String -> IO ()
addTodo task = do
    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    execute connection "insert into todo(task) values(?)" (Only task)
    printTodos

notDoneTodo :: Int -> IO ()
notDoneTodo index = do
    todo <- getTodoByOrdinal index
    let id = getTodoID todo

    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    execute connection "update todo set complete = false where id = ?" (Only id)
    printTodos

deleteTodo :: Int -> IO ()
deleteTodo index = do
    todo <- getTodoByOrdinal index
    let id = getTodoID todo

    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    execute connection "delete from todo where id = ?" (Only id)
    printTodos


main = do
    s <- getArgs
    handleArgs s


