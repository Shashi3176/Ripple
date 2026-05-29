
CREATE TABLE User_emails (
    email VARCHAR(100) PRIMARY KEY
);

CREATE TABLE Users (
    anion_id TEXT PRIMARY KEY,
    connected_groups TEXT NOT NULL
);


CREATE TABLE Groups (
    group_id TEXT PRIMARY KEY,
    moderator_id TEXT NOT NULL,
    settings TEXT[]
);


CREATE TABLE Group_members (
    id SERIAL PRIMARY KEY,
    member_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    details TEXT,
    FOREIGN KEY (group_id) REFERENCES Groups (group_id)
);


CREATE TABLE Group_messages (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    group_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES Groups (group_id),
    FOREIGN KEY (member_id) REFERENCES Group_members (member_id)
    created_at timestamptz NOT NULL DEFAULT now(),
);


CREATE TABLE Direct_chat (
    chat_id TEXT PRIMARY KEY,
    member_id1 TEXT NOT NULL,
    member_id2 TEXT NOT NULL,
    user1_settings TEXT,
    user2_settings TEXT
);


CREATE TABLE Direct_messages (
    id SERIAL PRIMARY KEY,
    chat_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES Direct_chat (chat_id)
    created_at timestamptz NOT NULL DEFAULT now(),
);
