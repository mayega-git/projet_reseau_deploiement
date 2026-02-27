CREATE TABLE abonnement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    author_id UUID NOT NULL,
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_abonnement_user_id ON abonnement (user_id);

CREATE INDEX idx_abonnement_author_id ON abonnement (author_id);

CREATE INDEX idx_abonnement_content_id ON abonnement (content_id);