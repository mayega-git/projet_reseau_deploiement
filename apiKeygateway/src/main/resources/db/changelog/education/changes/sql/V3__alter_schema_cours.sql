CREATE TABLE cours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id UUID NOT NULL,
    organisation_id UUID,
    id_ressource UUID REFERENCES ressource_entity (id) ON DELETE CASCADE,
    audio_length VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    domain VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN (
            'DRAFT',
            'PUBLISHED',
            'REFUSED',
            'ARCHIVED'
        )
    ),
    content_type VARCHAR(20) NOT NULL,
    formateur VARCHAR(255),
    nombre_heures VARCHAR(50),
    niveau VARCHAR(100)
);

CREATE INDEX idx_cours_author ON cours (author_id);

CREATE INDEX idx_cours_organisation ON cours (organisation_id);

CREATE INDEX idx_cours_domain ON cours (domain);

CREATE INDEX idx_cours_status ON cours (status);

CREATE INDEX idx_cours_published_at ON cours (published_at);

CREATE INDEX idx_cours_ressource ON cours (id_ressource);

CREATE TABLE unite_cours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id UUID NOT NULL,
    organisation_id UUID,
    id_ressource UUID REFERENCES ressource_entity (id) ON DELETE CASCADE,
    audio_length VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    domain VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN (
            'DRAFT',
            'PUBLISHED',
            'REFUSED',
            'ARCHIVED'
        )
    ),
    content_type VARCHAR(20) NOT NULL,
    formateur VARCHAR(255),
    nombre_heures VARCHAR(50),
    niveau VARCHAR(100),
    id_cours UUID NOT NULL REFERENCES cours (id) ON DELETE CASCADE,
    unit INTEGER
);

CREATE INDEX idx_unite_cours_author ON unite_cours (author_id);

CREATE INDEX idx_unite_cours_organisation ON unite_cours (organisation_id);

CREATE INDEX idx_unite_cours_domain ON unite_cours (domain);

CREATE INDEX idx_unite_cours_status ON unite_cours (status);

CREATE INDEX idx_unite_cours_published_at ON unite_cours (published_at);

CREATE INDEX idx_unite_cours_ressource ON unite_cours (id_ressource);

CREATE INDEX idx_unite_cours_id_cours ON unite_cours (id_cours);

ALTER TABLE education_category
ADD COLUMN id_cours UUID REFERENCES cours (id) ON DELETE CASCADE;

ALTER TABLE education_category
DROP CONSTRAINT rating_target_check;

ALTER TABLE education_category
ADD CONSTRAINT rating_target_check CHECK (
    (
        id_blog IS NOT NULL
        AND id_podcast IS NULL
        AND id_cours IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NOT NULL
        AND id_cours IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NULL
        AND id_cours IS NOT NULL
    )
);

CREATE INDEX idx_cours_cat_cours ON education_category (id_cours);

ALTER TABLE education_category
ADD CONSTRAINT uk_cours_category UNIQUE (id_cours, id_category);

ALTER TABLE education_tags
ADD COLUMN id_cours UUID REFERENCES cours (id) ON DELETE CASCADE;

ALTER TABLE education_tags DROP CONSTRAINT rating_target_check;

ALTER TABLE education_tags
ADD CONSTRAINT rating_target_check CHECK (
    (
        id_blog IS NOT NULL
        AND id_podcast IS NULL
        AND id_cours IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NOT NULL
        AND id_cours IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NULL
        AND id_cours IS NOT NULL
    )
);

CREATE INDEX idx_cours_tag_cours ON education_tags (id_cours);

ALTER TABLE education_tags
ADD CONSTRAINT uk_cours_tags UNIQUE (id_cours, id_tag);

ALTER TABLE favorites
DROP CONSTRAINT favorites_entity_type_check;

ALTER TABLE favorites
ADD CONSTRAINT favorites_entity_type_check CHECK (
    entity_type IN ('BLOG', 'PODCAST', 'COURSE')
);

COMMENT ON TABLE cours IS 'Table pour les cours educatifs';

COMMENT ON TABLE unite_cours IS 'Table pour les unites de cours rattachees a un cours';