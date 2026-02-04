-- ============================================
-- SCHEMA SQL POSTGRESQL - PROJET RESEAU
-- Schéma refactorisé sans table education
-- ============================================

-- Suppression des tables si elles existent (ordre inverse des dépendances)

-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS blog_entity CASCADE;
-- DROP TABLE IF EXISTS podcast_entity CASCADE;
-- DROP TABLE IF EXISTS tag_entity CASCADE;
-- DROP TABLE IF EXISTS category_entity CASCADE;


--Creation schema
-- CREATE SCHEMA IF NOT EXISTS education;

-- ============================================
-- TABLE: plateforme_entity
-- ============================================

-- Création de la table plateforme_entity
CREATE TABLE plateforme_entity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    client_id VARCHAR(255) NOT NULL
);

-- ============================================
-- TABLE: ressource_entity
-- ============================================

-- Création de la table ressource_entity
CREATE TABLE ressource_entity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cover_id UUID,
    cover_uri VARCHAR(500),
    audio_id UUID,
    audio_uri VARCHAR(500)
    
);

-- ============================================
-- TABLE: podcast
-- ============================================
CREATE TABLE podcast_entity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id UUID NOT NULL,
    organisation_id UUID,
    audio_url VARCHAR(500),
    audio_length VARCHAR(50),
    cover_image VARCHAR(500),
    transcript VARCHAR(500),

    -- id_plateforme UUID REFERENCES plateforme_entity(id) ON DELETE SET NULL,
    id_ressource UUID REFERENCES ressource_entity(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    domain VARCHAR(50) NOT NULL ,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'REFUSED', 'ARCHIVED')),
    content_type VARCHAR(20) NOT NULL
);

-- Index pour podcast
CREATE INDEX idx_podcast_author ON podcast_entity(author_id);
CREATE INDEX idx_podcast_organisation ON podcast_entity(organisation_id);
CREATE INDEX idx_podcast_domain ON podcast_entity(domain);
CREATE INDEX idx_podcast_status ON podcast_entity(status);
CREATE INDEX idx_podcast_published_at ON podcast_entity(published_at);

-- ============================================
-- TABLE: blog_entity
-- ============================================

CREATE TABLE blog_entity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id UUID NOT NULL,
    organisation_id UUID,

    -- id_plateforme UUID REFERENCES plateforme_entity(id) ON DELETE SET NULL,
    id_ressource UUID REFERENCES ressource_entity(id) ON DELETE CASCADE,

    audio_length VARCHAR(50),


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    domain VARCHAR(50) NOT NULL ,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'REFUSED', 'ARCHIVED')),
    content_type VARCHAR(20) NOT NULL,
    content TEXT,
    reading_time INTEGER -- en minutes
);

-- Index pour blog_entity
CREATE INDEX idx_blog_author ON blog_entity(author_id);
CREATE INDEX idx_blog_organisation ON blog_entity(organisation_id);
CREATE INDEX idx_blog_domain ON blog_entity(domain);
CREATE INDEX idx_blog_status ON blog_entity(status);
CREATE INDEX idx_blog_published_at ON blog_entity(published_at);
-- CREATE INDEX idx_blog_plateforme ON blog_entity(id_plateforme);
CREATE INDEX idx_blog_ressource ON blog_entity(id_ressource);


-- ============================================
-- TABLE: category_entity
-- ============================================
CREATE TABLE category_entity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    domain VARCHAR(50) NOT NULL ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour category_entity
CREATE INDEX idx_category_domain ON category_entity(domain);
CREATE INDEX idx_category_name ON category_entity(name);

-- Contrainte d'unicité sur le nom de catégorie par domaine
ALTER TABLE category_entity ADD CONSTRAINT uk_category_name_domain UNIQUE (name, domain);

-- ============================================
-- TABLE: tag_entity
-- ============================================
CREATE TABLE tag_entity(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    domain VARCHAR(50) ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour tag_entity
CREATE INDEX idx_tag_name ON tag_entity(name);
CREATE INDEX idx_tag_domain ON tag_entity(domain);

-- Contrainte d'unicité sur le nom de tag
ALTER TABLE tag_entity ADD CONSTRAINT uk_tag_name UNIQUE (name);

-- ============================================
-- TABLE: education_category (table d'association N:N)
-- Relation entre education_entity et category_entity
-- ============================================
CREATE TABLE education_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_blog UUID  REFERENCES blog_entity(id) ON DELETE CASCADE,
    id_podcast UUID  REFERENCES podcast_entity(id) ON DELETE CASCADE,
    id_category UUID NOT NULL REFERENCES category_entity(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT rating_target_check CHECK (
        (id_blog IS NOT NULL AND id_podcast IS NULL) OR 
        (id_blog IS NULL AND id_podcast IS NOT NULL)
    )
);

-- Index pour education_category
CREATE INDEX idx_blog_cat_blog ON education_category(id_blog);
CREATE INDEX idx_podcast_cat_podcast ON education_category(id_podcast);
CREATE INDEX idx_blog_cat_category ON education_category(id_category);

-- Contrainte d'unicité pour éviter les doublons
ALTER TABLE education_category 
    ADD CONSTRAINT uk_blog_category UNIQUE (id_blog, id_category);

ALTER TABLE education_category 
    ADD CONSTRAINT uk_podcast_category UNIQUE (id_podcast, id_category);


-- ============================================
-- TABLE: education_tags (table d'association N:N)
-- Relation entre education_entity et tags_entity
-- ============================================

CREATE TABLE education_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_blog UUID  REFERENCES blog_entity(id) ON DELETE CASCADE,
    id_podcast UUID  REFERENCES podcast_entity(id) ON DELETE CASCADE,
    id_tag UUID NOT NULL REFERENCES tag_entity(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT rating_target_check CHECK (
        (id_blog IS NOT NULL AND id_podcast IS NULL) OR 
        (id_blog IS NULL AND id_podcast IS NOT NULL)
    )
);

-- Index pour education_tags
CREATE INDEX idx_blog_tag_blog ON education_tags(id_blog);
CREATE INDEX idx_podcast_tag_podcast ON education_tags(id_podcast);
CREATE INDEX idx_blog_tag_tags ON education_tags(id_tag);

-- Contrainte d'unicité pour éviter les doublons
ALTER TABLE education_tags
    ADD CONSTRAINT uk_blog_tags UNIQUE (id_blog, id_tag);

ALTER TABLE education_tags
    ADD CONSTRAINT uk_podcast_tags UNIQUE (id_podcast, id_tag);






-- ============================================
-- TABLE: favorites
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    entity_id UUID NOT NULL,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('BLOG', 'PODCAST')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_entity ON favorites(entity_id);
CREATE INDEX idx_favorites_entity_type ON favorites(entity_type);

-- Contrainte d'unicité : un utilisateur ne peut avoir qu'un favori par entité
ALTER TABLE favorites ADD CONSTRAINT uk_favorites_user_entity UNIQUE (user_id, entity_id, entity_type);


-- ============================================
-- COMMENTAIRES SUR LES TABLES
-- ============================================
COMMENT ON TABLE podcast_entity IS 'Table pour les podcasts éducatifs';
COMMENT ON TABLE blog_entity IS 'Table pour les articles de blog éducatifs';
COMMENT ON TABLE category_entity IS 'Catégories pour classifier les contenus éducatifs';
COMMENT ON TABLE tag_entity IS 'Tags pour étiqueter les contenus éducatifs';
COMMENT ON TABLE education_category IS 'Table d''association entre blog_entity ,podcast_entityet category_entity';
COMMENT ON TABLE education_tags IS 'Table d''association entre blog_entity ,podcast_entity et tag_entity';
COMMENT ON TABLE favorites IS 'Favoris des utilisateurs';
