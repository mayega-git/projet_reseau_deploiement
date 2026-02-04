CREATE KEYSPACE forum_new WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
USE forum_new;
CREATE TABLE discussion_group (
    key_id TEXT,
    group_id UUID,
    creator_name TEXT,
    name TEXT,
    type TEXT,  -- Or appropriate type for your GroupType enum
    description TEXT,
    members SET<UUID>,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    PRIMARY KEY (key_id, group_id)
);
CREATE TABLE forum_new.users (
    user_id uuid PRIMARY KEY,
    email text,
    enabled boolean,
    password text,
    role text,
    username text
)
CREATE TABLE forum_new.api_keys (
    client_id uuid,
    key_id uuid,
    api_key text,
    created_at timestamp,
    enabled boolean,
    expires_at timestamp,
    PRIMARY KEY (client_id, key_id)
)
