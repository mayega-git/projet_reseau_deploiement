-- Script d'initialisation de la base de données Newsletter System
-- PostgreSQL 13+

-- Créer la base de données (exécuter en tant que superuser)
CREATE DATABASE newsletter_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'fr_FR.UTF-8'
    LC_CTYPE = 'fr_FR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE newsletter_db IS 'Base de données pour le système de newsletter';

-- Se connecter à la base de données
\c newsletter_db;

-- Créer l'extension UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Les tables seront créées automatiquement par Liquibase au démarrage de l'application
-- Ce script sert uniquement à créer la base de données vide

-- Pour insérer des données de test après le démarrage de l'application:

-- Exemple: Insérer des catégories
/*
INSERT INTO categories (id, name, description, domain, created_at, updated_at) VALUES
(uuid_generate_v4(), 'IA et Machine Learning', 'Actualités sur l''intelligence artificielle', 'TECHNOLOGIE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Startups Tech', 'Nouveautés du monde des startups', 'BUSINESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Recherche Scientifique', 'Découvertes scientifiques récentes', 'SCIENCE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Formation en ligne', 'Cours et ressources éducatives', 'EDUCATION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'Santé et Bien-être', 'Conseils santé et nutrition', 'SANTE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
*/

-- Vérifier les tables créées
-- \dt

-- Vérifier les contraintes
-- SELECT conname, contype FROM pg_constraint WHERE conrelid = 'abonnements'::regclass;
