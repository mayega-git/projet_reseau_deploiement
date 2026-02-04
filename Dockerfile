# Stage 1: Dépendances de Base et Construction
# Utiliser une image complète pour le build
FROM node:20-alpine AS base

# Installer et mettre en cache les dépendances
FROM base AS builder
WORKDIR /app

# Copier les fichiers de dépendances pour profiter du cache Docker
COPY package.json yarn.lock ./

# Installer les dépendances
# Utilisez 'npm ci' si vous utilisez npm avec package-lock.json
RUN npm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
# La commande 'build' génère le dossier .next
RUN npm build

# Stage 2: Préparation de l'environnement de Production (Dépendances)
# Créer une image de production minimale pour les dépendances
FROM base AS production-deps
WORKDIR /app

# Installer uniquement les dépendances nécessaires à l'exécution (production)
# Cela réduit considérablement la taille de l'image finale
COPY package.json yarn.lock ./
RUN npm install --production --frozen-lockfile

# Stage 3: Environnement d'Exécution Final
# Utiliser une image ultra-légère (node:20-alpine est souvent un bon compromis)
FROM node:20-alpine AS runner
WORKDIR /app

# 1. Copier l'environnement d'exécution (dépendances de production)
COPY --from=production-deps /app/node_modules ./node_modules/

# 2. Copier le résultat du build (.next)
COPY --from=builder /app/.next ./.next/

# 3. Copier les fichiers statiques et publics essentiels
# Les fichiers publics sont servis statiquement par Next.js
COPY --from=builder /app/public ./public/

# 4. Copier les fichiers de configuration restants
COPY --from=builder /app/package.json ./package.json

# Définir l'utilisateur pour une sécurité renforcée (si supporté par votre base d'image)
# RUN adduser --system --no-create-home nextjs
# USER nextjs

# Exposer le port par défaut de Next.js
EXPOSE 3000

# Commande de démarrage
# Lancer l'application en mode production (SSR/API routes)
CMD ["yarn", "start"]