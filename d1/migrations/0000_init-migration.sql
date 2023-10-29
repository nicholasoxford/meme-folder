-- Migration number: 0000 	 2023-10-29T04:27:22.375Z
CREATE TABLE IF NOT EXISTS memes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    user_id INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS memes_user_id_idx ON memes (user_id);