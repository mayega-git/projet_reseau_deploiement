CREATE TABLE course (
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

CREATE INDEX idx_course_author ON course (author_id);

CREATE INDEX idx_course_organisation ON course (organisation_id);

CREATE INDEX idx_course_domain ON course (domain);

CREATE INDEX idx_course_status ON course (status);

CREATE INDEX idx_course_published_at ON course (published_at);

CREATE INDEX idx_course_ressource ON course (id_ressource);

CREATE TABLE unit_course (
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
    trainer_name VARCHAR(255),
    duration VARCHAR(50),
    niveau VARCHAR(100),
    id_course UUID NOT NULL REFERENCES course (id) ON DELETE CASCADE,
    unit INTEGER
);

CREATE INDEX idx_unit_course_author ON unit_course (author_id);

CREATE INDEX idx_unit_course_organisation ON unit_course (organisation_id);

CREATE INDEX idx_unit_course_domain ON unit_course (domain);

CREATE INDEX idx_unit_course_status ON unit_course (status);

CREATE INDEX idx_unit_course_published_at ON unit_course (published_at);

CREATE INDEX idx_unit_course_ressource ON unit_course (id_ressource);

CREATE INDEX idx_unit_course_id_course ON unit_course (id_course);

ALTER TABLE education_category
ADD COLUMN id_course UUID REFERENCES course (id) ON DELETE CASCADE;

ALTER TABLE education_category DROP CONSTRAINT rating_target_check;

ALTER TABLE education_category
ADD CONSTRAINT rating_target_check CHECK (
    (
        id_blog IS NOT NULL
        AND id_podcast IS NULL
        AND id_course IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NOT NULL
        AND id_course IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NULL
        AND id_course IS NOT NULL
    )
);

CREATE INDEX idx_course_cat_course ON education_category (id_course);

ALTER TABLE education_category
ADD CONSTRAINT uk_course_category UNIQUE (id_course, id_category);

ALTER TABLE education_tags
ADD COLUMN id_course UUID REFERENCES course (id) ON DELETE CASCADE;

ALTER TABLE education_tags DROP CONSTRAINT rating_target_check;

ALTER TABLE education_tags
ADD CONSTRAINT rating_target_check CHECK (
    (
        id_blog IS NOT NULL
        AND id_podcast IS NULL
        AND id_course IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NOT NULL
        AND id_course IS NULL
    )
    OR (
        id_blog IS NULL
        AND id_podcast IS NULL
        AND id_course IS NOT NULL
    )
);

CREATE INDEX idx_course_tag_course ON education_tags (id_course);

ALTER TABLE education_tags
ADD CONSTRAINT uk_course_tags UNIQUE (id_course, id_tag);

ALTER TABLE favorites DROP CONSTRAINT favorites_entity_type_check;

ALTER TABLE favorites
ADD CONSTRAINT favorites_entity_type_check CHECK (
    entity_type IN ('BLOG', 'PODCAST', 'COURSE')
);

COMMENT ON TABLE course IS 'Table pour les course educatifs';

COMMENT ON TABLE unit_course IS 'Table pour les units de course rattachees a un course';