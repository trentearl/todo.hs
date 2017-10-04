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
    task :: Maybe String,
    complete :: Maybe Bool
} deriving (Show)

instance FromRow Todo where
    fromRow = Todo <$> field <*> field

instance ToRow Todo where
    toRow d = [ toField (task d), toField (complete d) ]

getTodos = do
    connection <- connect defaultConnectInfo { connectDatabase = "todo" }
    rows <- query_ connection "select task::text, complete from todo"
    return (rows :: [Todo])

todoToString :: Todo -> String
todoToString (Todo (Just t) (Just completed))
    = if completed
        then " ! " ++ t
        else "   " ++ t

combineTuple :: (Int, String) -> String
combineTuple (i, s) = (show i) ++ ") " ++ s

getTodosAsPrettyList :: [Todo] -> String
getTodosAsPrettyList todos = unlines $ map combineTuple $ zip [1..] $ map todoToString todos

printTodos = do
    todos <- getTodos
    putStrLn $ getTodosAsPrettyList todos

main = do
    s <- getArgs
    if length s == 0 || (length s == 1 && (s !! 0) == "show")
       then printTodos
       else putStrLn "Nothing to do"


