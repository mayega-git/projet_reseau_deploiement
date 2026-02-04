-- ========================================
-- SCHÉMA COMPLET BASE DE DONNÉES POSTGRESQL
-- Backend Newsletter - Architecture Complète
-- ========================================


CREATE TABLE lecteur (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
    
   
);




-- ========================================
-- 3. TABLE REDACTEUR (Profil rédacteur)
-- ========================================

CREATE TABLE redacteur (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP,
    rejection_reason TEXT
        
);





-- ========================================
-- 4. TABLE CATEGORIE (Catégories de newsletters)
-- ========================================

CREATE TABLE categorie (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    kafka_topic VARCHAR(255) NOT NULL UNIQUE,  -- Topic Kafka associé
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT chk_kafka_topic_format CHECK (kafka_topic ~ '^newsletter\.[a-z]+$')
);

CREATE INDEX idx_categorie_nom ON categorie(nom);
CREATE INDEX idx_categorie_kafka_topic ON categorie(kafka_topic);

COMMENT ON TABLE categorie IS 'Catégories de newsletters (Sport, Finance, Tech, etc.)';
COMMENT ON COLUMN categorie.kafka_topic IS 'Nom du topic Kafka associé (ex: newsletter.sport)';


-- ========================================
-- 5. TABLE NEWSLETTER (Newsletters)
-- ========================================

CREATE TABLE newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,  -- Contenu HTML de la newsletter
    statut VARCHAR(20) NOT NULL DEFAULT 'BROUILLON',
    redacteur_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    published_at TIMESTAMP,  -- Date de publication (NULL si non publiée)
    
    CONSTRAINT fk_newsletter_redacteur FOREIGN KEY (redacteur_id) 
        REFERENCES redacteur(id) ON DELETE SET NULL,
    
    CONSTRAINT chk_statut CHECK (statut IN (
        'BROUILLON',    -- Newsletter en cours de rédaction
        'SOUMISE',      -- Soumise pour validation admin
        'VALIDEE',      -- Validée par admin (prête à publier)
        'REJETEE',      -- Rejetée par admin
        'PUBLIEE'       -- Publiée et envoyée
    )),
    
    -- Si publiée, la date de publication doit être renseignée
    CONSTRAINT chk_published_at CHECK (
        (statut = 'PUBLIEE' AND published_at IS NOT NULL) OR 
        (statut != 'PUBLIEE' AND published_at IS NULL)
    )
);

CREATE INDEX idx_newsletter_statut ON newsletter(statut);
CREATE INDEX idx_newsletter_redacteur ON newsletter(redacteur_id);
CREATE INDEX idx_newsletter_published_at ON newsletter(published_at);
CREATE INDEX idx_newsletter_created_at ON newsletter(created_at);

COMMENT ON TABLE newsletter IS 'Newsletters rédigées par les rédacteurs';
COMMENT ON COLUMN newsletter.statut IS 'Workflow: BROUILLON → SOUMISE → VALIDEE → PUBLIEE';
COMMENT ON COLUMN newsletter.contenu IS 'Contenu HTML complet de la newsletter';
COMMENT ON COLUMN newsletter.published_at IS 'Date de publication (déclenche l''envoi Kafka)';

-- ========================================
-- 6. TABLE NEWSLETTER_CATEGORIE (Relation N-M)
-- ========================================

CREATE TABLE newsletter_categorie (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    newsletter_id UUID NOT NULL,
    categorie_id UUID NOT NULL,
    
    CONSTRAINT fk_nc_newsletter FOREIGN KEY (newsletter_id) 
        REFERENCES newsletter(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_nc_categorie FOREIGN KEY (categorie_id) 
        REFERENCES categorie(id) ON DELETE CASCADE,
    
    -- Une newsletter ne peut pas être associée 2x à la même catégorie
    CONSTRAINT uk_newsletter_categorie UNIQUE (newsletter_id, categorie_id)
);

CREATE INDEX idx_nc_newsletter ON newsletter_categorie(newsletter_id);
CREATE INDEX idx_nc_categorie ON newsletter_categorie(categorie_id);

COMMENT ON TABLE newsletter_categorie IS 'Relation N-M entre newsletters et catégories';
COMMENT ON COLUMN newsletter_categorie.newsletter_id IS 'Une newsletter peut appartenir à plusieurs catégories';
COMMENT ON COLUMN newsletter_categorie.categorie_id IS 'Une catégorie contient plusieurs newsletters';

-- ========================================
-- 7. TABLE LECTEUR_CATEGORIE_ABONNEMENT (Relation N-M)
-- ========================================

CREATE TABLE lecteur_categorie_abonnement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecteur_id UUID NOT NULL,
    categorie_id UUID NOT NULL,
    subscribed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_lca_lecteur FOREIGN KEY (lecteur_id) 
        REFERENCES lecteur(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_lca_categorie FOREIGN KEY (categorie_id) 
        REFERENCES categorie(id) ON DELETE CASCADE,
    
    -- Un lecteur ne peut s'abonner qu'une fois à une catégorie
    CONSTRAINT uk_lecteur_categorie UNIQUE (lecteur_id, categorie_id)
);

CREATE INDEX idx_lca_lecteur ON lecteur_categorie_abonnement(lecteur_id);
CREATE INDEX idx_lca_categorie ON lecteur_categorie_abonnement(categorie_id);
CREATE INDEX idx_lca_subscribed_at ON lecteur_categorie_abonnement(subscribed_at);

COMMENT ON TABLE lecteur_categorie_abonnement IS 'Abonnements des lecteurs aux catégories';
COMMENT ON COLUMN lecteur_categorie_abonnement.subscribed_at IS 'Date d''abonnement à la catégorie';

-- ========================================
-- 8. TABLE LECTEUR_NEWSLETTER_DESABONNEMENT (Relation N-M)
-- ========================================

CREATE TABLE lecteur_newsletter_desabonnement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecteur_id UUID NOT NULL,
    newsletter_id UUID NOT NULL,
    unsubscribed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_lnd_lecteur FOREIGN KEY (lecteur_id) 
        REFERENCES lecteur(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_lnd_newsletter FOREIGN KEY (newsletter_id) 
        REFERENCES newsletter(id) ON DELETE CASCADE,
    
    -- Un lecteur ne peut se désabonner qu'une fois d'une newsletter
    CONSTRAINT uk_lecteur_newsletter UNIQUE (lecteur_id, newsletter_id)
);

CREATE INDEX idx_lnd_lecteur ON lecteur_newsletter_desabonnement(lecteur_id);
CREATE INDEX idx_lnd_newsletter ON lecteur_newsletter_desabonnement(newsletter_id);
CREATE INDEX idx_lnd_unsubscribed_at ON lecteur_newsletter_desabonnement(unsubscribed_at);

COMMENT ON TABLE lecteur_newsletter_desabonnement IS 'Désabonnements spécifiques de newsletters';
COMMENT ON COLUMN lecteur_newsletter_desabonnement.unsubscribed_at IS 'Date de désabonnement';







