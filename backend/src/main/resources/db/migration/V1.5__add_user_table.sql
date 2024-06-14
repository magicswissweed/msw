CREATE TABLE user_table
(
    id       UUID PRIMARY KEY,
    extId    VARCHAR(255) NOT NULL,
    email    VARCHAR(255),
    username VARCHAR(255)
);

-- many to many relationship because in the future we might want to share spots between users
CREATE TABLE user_to_spot_table
(
    id      UUID PRIMARY KEY,
    user_id UUID REFERENCES user_table (id) ON DELETE CASCADE,
    spot_id UUID REFERENCES spot_table (id) ON DELETE CASCADE
)