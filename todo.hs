{-# LANGUAGE OverloadedStrings #-}

import Control.Monad
import Control.Applicative
import Data.Char
import Data.List
import System.IO
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
todoToString (Todo (Just t) _) = t

main = do
    todos <- getTodos
    putStrLn $ unlines $ map todoToString todos


