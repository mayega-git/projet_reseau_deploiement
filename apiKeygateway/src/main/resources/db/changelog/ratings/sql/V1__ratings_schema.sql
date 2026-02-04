-- Schéma consolidé : tables, contraintes et index finaux pour la BD ratings/reviews.

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    comment_by_user UUID NOT NULL,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comments_entity_type_check CHECK (entity_type IN ('BLOG','PODCAST','COMMENT','FORUM','DRIVER','AUTHOR','APPLICATION','ORGANISATION'))
);

CREATE TABLE IF NOT EXISTS comment_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    reply_by_user_id UUID NOT NULL,
    comment_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment
        FOREIGN KEY(comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    user_id UUID NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 5),
    feedback TEXT,
    evaluation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    CONSTRAINT uq_user_entity_rating UNIQUE (user_id, entity_id, entity_type),
    CONSTRAINT ratings_entity_type_check CHECK (entity_type IN ('BLOG','PODCAST','COMMENT','FORUM','DRIVER','AUTHOR','APPLICATION','ORGANISATION'))
);

CREATE TABLE IF NOT EXISTS entity_stats (
    entity_id UUID PRIMARY KEY,
    entity_type TEXT NOT NULL,
    total_likes INTEGER DEFAULT 0,
    total_dislikes INTEGER DEFAULT 0,
    liked_users UUID[] DEFAULT ARRAY[]::UUID[],
    disliked_users UUID[] DEFAULT ARRAY[]::UUID[],
    CONSTRAINT entity_stats_entity_type_check CHECK (entity_type IN ('BLOG','PODCAST','COMMENT','FORUM','DRIVER','AUTHOR','APPLICATION','ORGANISATION'))
);

CREATE INDEX IF NOT EXISTS idx_comments_entity ON comments (entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments (comment_by_user);
CREATE INDEX IF NOT EXISTS idx_comment_replies_comment_id ON comment_replies (comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_replies_user ON comment_replies (reply_by_user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_entity ON ratings (entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings (user_id);
