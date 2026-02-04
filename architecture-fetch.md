# 📐 Architecture Complète - LetsGo CMS Frontend

**Date:** 31 janvier 2026  
**Framework:** Next.js 15.3.2  
**Type:** Application Frontend (React 19)  
**Gestion d'État:** Context API + AuthContext

---

## 📁 Structure du Projet

```
LetsGo-CMS-Frontend/
├── src/
│   ├── app/                          # Routes Next.js (App Router)
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── init/            # Initialisation authentification
│   │   │   │   ├── refresh/         # Rafraîchissement token
│   │   │   │   └── token/           # Gestion des tokens
│   │   │   └── revalidate/
│   │   │       └── route.ts
│   │   ├── auth/                     # Routes d'authentification
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (protected)/              # Routes protégées (groupe)
│   │   │   ├── blog/
│   │   │   │   ├── create/
│   │   │   │   └── update/
│   │   │   ├── forum/
│   │   │   ├── newsletter/
│   │   │   │   ├── categories/
│   │   │   │   ├── create/
│   │   │   │   └── update/
│   │   │   ├── podcast/
│   │   │   │   ├── create/
│   │   │   │   └── update/
│   │   │   ├── preview/
│   │   │   │   ├── blog/
│   │   │   │   └── podcast/
│   │   │   ├── profile/[id]/
│   │   │   ├── u/                   # Dashboard utilisateur
│   │   │   │   ├── (adminOrganisation)/
│   │   │   │   ├── category/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── favorites/
│   │   │   │   ├── feed/
│   │   │   │   ├── forum/
│   │   │   │   ├── manage/
│   │   │   │   ├── newsletter/
│   │   │   │   ├── rateapp/
│   │   │   │   ├── roles/
│   │   │   │   ├── tags/
│   │   │   │   ├── update/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/                 # Routes publiques (groupe)
│   │   │   ├── become-an-organisation/page.tsx
│   │   │   ├── blog/[id]/
│   │   │   └── podcast/
│   │   │       ├── [id]/
│   │   │       └── page.tsx
│   │   ├── _app.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   ├── page.tsx                  # Landing page
│   │   └── sidebar.tsx
│   │
│   ├── components/                   # Composants réutilisables
│   │   ├── AudioPlayer/
│   │   │   ├── AudioPlayerContent.tsx
│   │   │   └── AudioPlayerPreview.tsx
│   │   ├── AuthForms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── UpdateUserForm.tsx
│   │   ├── AuthInitializer/
│   │   │   └── AuthInitializer.tsx
│   │   ├── Blog/
│   │   │   ├── styles/
│   │   │   ├── BlogActionAction.tsx
│   │   │   ├── blogCard.tsx
│   │   │   ├── BlogContent.tsx
│   │   │   ├── BlogCoverImage.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   ├── BlogProfileCard.tsx
│   │   │   ├── CoverBlog.tsx
│   │   │   ├── CreateBlogComponent.tsx
│   │   │   ├── HomePage.tsx
│   │   │   └── UpdateBlogComponent.tsx
│   │   ├── Categories/
│   │   │   ├── CreateCategoryDialog.tsx
│   │   │   └── CreateDialogWrapperCategories.tsx
│   │   ├── ClientWrapper/
│   │   │   └── ClientWrapper.tsx
│   │   ├── Comment/
│   │   │   ├── CommentReplyDisplay.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── Comment.tsx
│   │   │   └── Reply.tsx
│   │   ├── DashboardData/
│   │   │   └── ContentCharts.tsx
│   │   ├── DataTable/
│   │   │   ├── BlogAndPodcastDataTable.tsx
│   │   │   ├── DataTableDisplay.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── NewsletterDataTable.tsx
│   │   │   └── UserDataTable.tsx
│   │   ├── Dialogs/
│   │   │   ├── BecomeAnAuthorDialog.tsx
│   │   │   ├── CreateNewAuthor.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── DeleteUserDialog.tsx
│   │   │   ├── EditUserRolesDialog.tsx
│   │   │   ├── LogoutDialog.tsx
│   │   │   ├── RateApp.dialog.tsx
│   │   │   └── RefuseDialog.tsx
│   │   ├── Editor/
│   │   │   ├── Toolbar/
│   │   │   ├── ConvertDtaftoHtml.tsx
│   │   │   ├── DraftEditor.css
│   │   │   └── DraftEditor.tsx
│   │   ├── EmptyState/
│   │   ├── Footer/
│   │   ├── Forum/
│   │   ├── Header/
│   │   ├── Loader/
│   │   ├── Navigation/
│   │   ├── NewsLetter/
│   │   ├── Organization/
│   │   ├── Podcast/
│   │   ├── Profile/
│   │   ├── Routes/
│   │   ├── SubscribeCards/
│   │   ├── Tags/
│   │   ├── token/
│   │   └── ui/                       # Composants UI (shadcn/ui)
│   │
│   ├── lib/                          # Logique métier & utilitaires
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── fetch-interceptor.ts  # ⭐ Intercepteur fetch
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── api.ts
│   │   ├── FetchBlogAndPodcastData.ts      # ⭐ Fetch blogs & podcasts
│   │   ├── FetchDataFromReviewService.ts   # ⭐ Fetch reviews
│   │   ├── FetchDataFromUserService.ts     # ⭐ Fetch utilisateurs
│   │   ├── FetchFromForum.ts               # ⭐ Fetch forum
│   │   ├── FetchFromOrganisationData.ts    # ⭐ Fetch organisations
│   │   ├── FetchNewsletterData.ts          # ⭐ Fetch newsletters
│   │   ├── helperAPIMethods.ts             # ⭐ Méthodes helper API
│   │   └── utils.ts
│   │
│   ├── context/                      # React Context
│   │   ├── AuthContext.tsx
│   │   └── GlobalStateContext.tsx
│   │
│   ├── constants/
│   │   ├── baseUrl.ts
│   │   ├── entityType.ts
│   │   └── roles.ts
│   │
│   ├── types/                        # Types TypeScript
│   │   ├── blog.ts
│   │   ├── category.ts
│   │   ├── comment.ts
│   │   ├── forum.ts
│   │   ├── newsletter.ts
│   │   ├── organisation.ts
│   │   ├── podcast.ts
│   │   ├── tag.ts
│   │   ├── userInteraction.ts
│   │   └── User.ts
│   │
│   ├── helper/
│   │   ├── blobToBase64.ts
│   │   ├── calculateReadingTime.ts
│   │   ├── formatAudioDuration.ts
│   │   ├── formatDateOrRelative.ts
│   │   ├── getInitials.ts
│   │   └── TruncateText.ts
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx
│   │
│   ├── data/
│   │   ├── RandomBlogData.tsx
│   │   ├── RandomPodcastData.tsx
│   │   └── SideBarData.tsx
│   │
│   └── styles/
│       └── background.css
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🔍 Fichiers Utilisant `fetch()`

### 📊 Résumé des fichiers avec fetch

| Fichier | Type | Description |
|---------|------|-------------|
| **API Routes** | - | - |
| `api/auth/init/route.ts` | **Server Component** | Initialisation authentification |
| `api/auth/refresh/route.ts` | **Server Component** | Rafraîchissement des tokens JWT |
| **Pages** | - | - |
| `auth/login/page.tsx` | **Client Component** | 🔐 Authentification utilisateur |
| `auth/signup/page.tsx` | **Client Component** | 📝 Inscription utilisateur |
| `(public)/become-an-organisation/page.tsx` | **Client Component** | 🏢 Demande organisation |
| `(protected)/u/category/page.tsx` | **Client Component** | 📂 Gestion catégories |
| `(protected)/u/category/manage/page.tsx` | **Client Component** | 📂 Modification catégories |
| `(protected)/u/tags/page.tsx` | **Client Component** | 🏷️ Gestion tags |
| `(protected)/u/tags/manage/page.tsx` | **Client Component** | 🏷️ Modification tags |
| **Composants UI** | - | - |
| `components/ui/AddToFavoritiesButton.tsx` | **Client Component** | ❤️ Ajouter aux favoris |
| `components/ui/LikeDislikeButton.tsx` | **Client Component** | 👍 Like/Dislike |
| **DataTable** | - | - |
| `components/DataTable/BlogAndPodcastDataTable.tsx` | **Client Component** | 📋 Tableau blogs/podcasts |
| **Blog** | - | - |
| `components/Blog/CreateBlogComponent.tsx` | **Client Component** | ✍️ Créer un blog |
| `components/Blog/UpdateBlogComponent.tsx` | **Client Component** | ✏️ Modifier un blog |
| `components/Blog/BlogCoverImage.tsx` | **Client Component** | 🖼️ Gestion image de couverture |
| **Podcast** | - | - |
| `components/Podcast/CreatePodcastComponent.tsx` | **Client Component** | 🎙️ Créer un podcast |
| `components/Podcast/UpdatePodcastComponent.tsx` | **Client Component** | 🎙️ Modifier un podcast |
| **Catégories** | - | - |
| `components/Categories/CreateCategoryDialog.tsx` | **Client Component** | 📂 Dialog création catégories |
| **Tags** | - | - |
| `components/Tags/CreateTagDialog.tsx` | **Client Component** | 🏷️ Dialog création tags |
| **Formulaires** | - | - |
| `components/AuthForms/UpdateUserForm.tsx` | **Client Component** | 👤 Mise à jour profil |
| **Dialogs** | - | - |
| `components/Dialogs/RateApp.dialog.tsx` | **Client Component** | ⭐ Évaluer l'app |
| `components/Dialogs/LogoutDialog.tsx` | **Client Component** | 🚪 Déconnexion |
| `components/Dialogs/RefuseDialog.tsx` | **Client Component** | ❌ Dialog refus |
| `components/Dialogs/BecomeAnAuthorDialog.tsx` | **Client Component** | 📖 Devenir auteur |
| **Services API** | - | - |
| `lib/auth/AuthProvider.tsx` | **Client Component** | 🔐 Fournisseur authentification |
| `lib/auth/fetch-interceptor.ts` | **Utility** | 🌐 Intercepteur fetch global |
| `lib/FetchNewsletterData.ts` | **Utility** | 📧 Récupérer newsletters |
| `lib/helperAPIMethods.ts` | **Utility** | 🛠️ Méthodes helper API |
| `lib/FetchFromForum.ts` | **Utility** | 💬 Récupérer forum |
| `lib/FetchDataFromUserService.ts` | **Utility** | 👥 Récupérer utilisateurs |
| `lib/FetchDataFromReviewService.ts` | **Utility** | ⭐ Récupérer évaluations |

---

## 🔐 Détails des Fichiers avec `fetch()`

### 🔑 Services API (Utilities)

#### 1. **`lib/auth/fetch-interceptor.ts`** - Intercepteur Global
```typescript
// 🌐 Intercepte tous les appels fetch
// ✅ Gère automatiquement les tokens JWT
// ✅ Rafraîchit les tokens expirants
// ✅ Gère les erreurs 401/403
```
**Utilité:** Centralise la logique d'authentification pour tous les appels fetch

#### 2. **`lib/helperAPIMethods.ts`** - Méthodes Helper
```typescript
// 🛠️ POST, GET, PUT, DELETE wrappers
// ✅ Intègre l'intercepteur fetch
// ✅ Gestion des erreurs standardisée
// ✅ Type-safe avec TypeScript
```
**Utilité:** Abstraction commune pour tous les appels API

#### 3. **`lib/FetchBlogAndPodcastData.ts`** - Blogs & Podcasts
```typescript
// 📚 Récupère tous les blogs
// 🎙️ Récupère tous les podcasts
// 🔍 Filtre, pagination, recherche
// ✏️ Modification/suppression de contenu
```

#### 4. **`lib/FetchDataFromUserService.ts`** - Gestion Utilisateurs
```typescript
// 👥 Récupère les profils utilisateurs
// 🔐 Authentification
// 📝 Mise à jour profil
// 🎯 Données spécifiques par ID
```

#### 5. **`lib/FetchDataFromReviewService.ts`** - Évaluations
```typescript
// ⭐ Récupère les évaluations
// 📊 Statistiques ratings
// 💬 Commentaires utilisateurs
```

#### 6. **`lib/FetchFromForum.ts`** - Forum
```typescript
// 💬 Récupère les groupes forum
// 📝 Récupère les posts
// 🔄 Commentaires et répliques
// ✏️ Modération et édition
```

#### 7. **`lib/FetchNewsletterData.ts`** - Newsletters
```typescript
// 📧 Récupère les newsletters
// 📂 Catégories newsletters
// 🏷️ Tags newsletters
// ✏️ Gestion newsletters
```

#### 8. **`lib/FetchFromOrganisationData.ts`** - Organisations
```typescript
// 🏢 Récupère les organisations
// 👨‍💼 Informations organisation
// 📊 Statistiques organisation
```

---

### 🖥️ Composants Client avec `fetch()`

#### **Pages d'Authentification**

##### `app/auth/login/page.tsx` - **Client Component**
```typescript
// 🔐 Formulaire de connexion
// ✅ Appel fetch pour login
// 🔄 Redirection post-connexion
// 📊 Gestion d'erreurs
```

##### `app/auth/signup/page.tsx` - **Client Component**
```typescript
// 📝 Formulaire d'inscription
// ✅ Validation données
// 🔐 Création compte
// 📤 Upload avatar (fetch)
```

---

#### **Composants Blog**

##### `components/Blog/CreateBlogComponent.tsx` - **Client Component**
```typescript
// ✍️ Interface création blog
// 📤 Upload image couverture (fetch)
// 📝 Éditeur rich text
// 🖼️ Gestion images (fetch)
// 💾 POST /blogs (fetch)
```

##### `components/Blog/UpdateBlogComponent.tsx` - **Client Component**
```typescript
// ✏️ Modification blog
// 🖼️ Changement image couverture (fetch)
// 📝 Modification contenu
// 💾 PUT /blogs/{id} (fetch)
// 🗑️ Suppression (fetch)
```

##### `components/Blog/BlogCoverImage.tsx` - **Client Component**
```typescript
// 🖼️ Gestion image de couverture
// 📤 Upload image (fetch)
// 🔄 Remplacement image
// 📊 Compression/validation
```

---

#### **Composants Podcast**

##### `components/Podcast/CreatePodcastComponent.tsx` - **Client Component**
```typescript
// 🎙️ Interface création podcast
// 📤 Upload fichier audio (fetch)
// 🖼️ Upload image couverture
// 📝 Métadonnées podcast
// 💾 POST /podcasts (fetch)
```

##### `components/Podcast/UpdatePodcastComponent.tsx` - **Client Component**
```typescript
// ✏️ Modification podcast
// 🎙️ Changement audio (fetch)
// 🖼️ Changement couverture
// 💾 PUT /podcasts/{id} (fetch)
```

---

#### **Composants UI Interactifs**

##### `components/ui/AddToFavoritiesButton.tsx` - **Client Component**
```typescript
// ❤️ Bouton ajouter favoris
// 🔄 Toggle favoris (fetch POST)
// 💾 Sauvegarde utilisateur
// ✨ Animation feedback
```

##### `components/ui/LikeDislikeButton.tsx` - **Client Component**
```typescript
// 👍 Bouton like/dislike
// 🔄 Toggle état (fetch POST)
// 📊 Comptage votes
// 💾 Mise à jour DB
```

---

#### **Gestion des Données**

##### `components/DataTable/BlogAndPodcastDataTable.tsx` - **Client Component**
```typescript
// 📋 Tableau paginé
// 🔍 Recherche et filtres (fetch)
// 📊 Tri colonnes
// ✏️ Actions édition/suppression (fetch)
// 🗑️ Suppression bulk
```

---

#### **Gestion des Catégories**

##### `components/Categories/CreateCategoryDialog.tsx` - **Client Component**
```typescript
// 📂 Dialog création catégorie
// ✅ Validation forme
// 💾 POST /categories (fetch)
// 🔄 Actualisation liste
```

##### `app/(protected)/u/category/page.tsx` - **Client Component**
```typescript
// 📂 Liste catégories
// 🔄 Récupération (fetch GET)
// ✏️ Édition catégories
// 🗑️ Suppression (fetch DELETE)
```

##### `app/(protected)/u/category/manage/page.tsx` - **Client Component**
```typescript
// 🛠️ Gestion complète catégories
// 📋 Tableau catégories (fetch)
// ✏️ Modification (fetch PUT)
// 🗑️ Suppression (fetch DELETE)
// ➕ Création (fetch POST)
```

---

#### **Gestion des Tags**

##### `components/Tags/CreateTagDialog.tsx` - **Client Component**
```typescript
// 🏷️ Dialog création tag
// ✅ Validation forme
// 💾 POST /tags (fetch)
// 🎨 Couleur personnalisée
```

##### `app/(protected)/u/tags/page.tsx` - **Client Component**
```typescript
// 🏷️ Liste tags
// 🔄 Récupération (fetch GET)
// ✏️ Édition tags
// 🗑️ Suppression (fetch DELETE)
```

##### `app/(protected)/u/tags/manage/page.tsx` - **Client Component**
```typescript
// 🛠️ Gestion complète tags
// 📋 Tableau tags (fetch)
// ✏️ Modification (fetch PUT)
// 🗑️ Suppression (fetch DELETE)
```

---

#### **Autres Pages**

##### `app/(public)/become-an-organisation/page.tsx` - **Client Component**
```typescript
// 🏢 Formulaire demande organisation
// 📝 Informations entreprise
// 💾 POST /organisations/request (fetch)
// 📧 Email confirmation
```

##### `components/AuthForms/UpdateUserForm.tsx` - **Client Component**
```typescript
// 👤 Mise à jour profil
// 📤 Upload avatar (fetch)
// 📝 Infos utilisateur
// 💾 PUT /users/profile (fetch)
```

---

#### **Dialogs**

##### `components/Dialogs/RateApp.dialog.tsx` - **Client Component**
```typescript
// ⭐ Interface évaluation app
// 🎯 Rating 1-5 étoiles
// 💬 Avis textuel
// 💾 POST /reviews (fetch)
```

##### `components/Dialogs/LogoutDialog.tsx` - **Client Component**
```typescript
// 🚪 Confirmation déconnexion
// 🔐 DELETE /auth/logout (fetch)
// 🔄 Nettoyage localStorage
```

##### `components/Dialogs/RefuseDialog.tsx` - **Client Component**
```typescript
// ❌ Refus avec justification
// 📝 Motif refus
// 💾 POST /actions/refuse (fetch)
```

##### `components/Dialogs/BecomeAnAuthorDialog.tsx` - **Client Component**
```typescript
// 📖 Demande devenir auteur
// 📝 Motivation
// 💾 POST /author-requests (fetch)
```

---

### 🔧 Services API (Utilities)

#### `lib/auth/AuthProvider.tsx` - **Client Component**
```typescript
// 🔐 Wrapper authentification
// 🌐 Initialise fetch-interceptor
// 🔄 Rafraîchit tokens auto
// 🚪 Gère logout/session
```

---

## 🎯 Flux de Données Fetch

```
┌─────────────────────────────────────────────────────────┐
│          COMPOSANT CLIENT (Client Component)             │
│        Appelle helperAPIMethods ou fetch()              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│        fetch-interceptor.ts (Middleware)                │
│  ✅ Ajoute Authorization header                         │
│  ✅ Rafraîchit token si expiré                          │
│  ✅ Gère erreurs 401/403                               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│   API Routes Next.js ou Backend Service                 │
│  (API REST - Microservices)                             │
│  ✅ Traitement requête                                  │
│  ✅ Validation données                                  │
│  ✅ Retour réponse JSON                                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│        Composant Client (Mise à jour State)             │
│  ✅ setState / Toast notification                       │
│  ✅ Actualise UI                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Fichiers Fetch par Catégorie

### 🔐 **Authentification**
- `lib/auth/fetch-interceptor.ts` - Intercepteur global
- `lib/auth/AuthProvider.tsx` - Gestion session
- `app/auth/login/page.tsx` - Connexion
- `app/auth/signup/page.tsx` - Inscription

### 📚 **Contenu (Blogs & Podcasts)**
- `lib/FetchBlogAndPodcastData.ts` - Service de récupération
- `components/Blog/CreateBlogComponent.tsx` - Création blog
- `components/Blog/UpdateBlogComponent.tsx` - Modification blog
- `components/Blog/BlogCoverImage.tsx` - Gestion couverture
- `components/Podcast/CreatePodcastComponent.tsx` - Création podcast
- `components/Podcast/UpdatePodcastComponent.tsx` - Modification podcast
- `components/DataTable/BlogAndPodcastDataTable.tsx` - Affichage tableau

### 👥 **Utilisateurs**
- `lib/FetchDataFromUserService.ts` - Service utilisateurs
- `components/AuthForms/UpdateUserForm.tsx` - Mise à jour profil
- `components/Dialogs/BecomeAnAuthorDialog.tsx` - Demande auteur

### 📧 **Newsletters**
- `lib/FetchNewsletterData.ts` - Service newsletters
- `app/(protected)/u/newsletter/...` - Pages gestion

### 📂 **Catégories**
- `components/Categories/CreateCategoryDialog.tsx` - Création
- `app/(protected)/u/category/page.tsx` - Liste
- `app/(protected)/u/category/manage/page.tsx` - Gestion

### 🏷️ **Tags**
- `components/Tags/CreateTagDialog.tsx` - Création
- `app/(protected)/u/tags/page.tsx` - Liste
- `app/(protected)/u/tags/manage/page.tsx` - Gestion

### ⭐ **Interactions (Like/Favoris)**
- `components/ui/AddToFavoritiesButton.tsx` - Favoris
- `components/ui/LikeDislikeButton.tsx` - Like/Dislike
- `lib/FetchDataFromReviewService.ts` - Service évaluations

### 💬 **Forum**
- `lib/FetchFromForum.ts` - Service forum

### 🏢 **Organisations**
- `lib/FetchFromOrganisationData.ts` - Service organisations
- `app/(public)/become-an-organisation/page.tsx` - Demande org

### 📊 **Autres**
- `components/Dialogs/RateApp.dialog.tsx` - Évaluation app
- `components/Dialogs/LogoutDialog.tsx` - Déconnexion
- `components/Dialogs/RefuseDialog.tsx` - Actions refus

---

## 🏗️ Architecture Détails Techniques

### **Stack Technologique**
- **Framework:** Next.js 15.3.2 (App Router)
- **Langage:** TypeScript 5
- **Librairie UI:** React 19 + shadcn/ui
- **Gestion d'État:** React Context API
- **Requêtes HTTP:** Fetch API (interceptée)
- **Styling:** Tailwind CSS 3.4.1
- **Validation Forme:** React Hook Form + Yup
- **Graphs:** Recharts
- **Notifications:** Sonner
- **Éditeur Rich Text:** Draft.js

### **Patterns Utilisés**
1. **Intercepteur Fetch Global** - Centralise auth logic
2. **Service Layer** - Utilitaires pour appels API
3. **Client/Server Components** - App Router Next.js
4. **Context API** - Auth state management
5. **Custom Hooks** - `use-mobile.tsx`
6. **Protected Routes** - Groupes de routes
7. **Dynamic Routes** - `[id]` et segments

---

## 🔄 Interactions Principales

### **Création Blog**
1. User click "Créer Blog"
2. `CreateBlogComponent` se rend
3. Upload image couverture → `fetch()` → S3/Backend
4. Remplit formulaire
5. Submit → `fetch POST /blogs`
6. `fetch-interceptor` ajoute Authorization
7. Confirmation + Redirection

### **Like Article**
1. User click bouton like
2. `LikeDislikeButton` → `fetch POST /interactions/like`
3. `fetch-interceptor` gère token
4. Response retourne nouveau count
5. UI actualise compteur

### **Connexion**
1. User soumet `LoginForm`
2. `fetch POST /auth/login`
3. Response contient JWT tokens
4. `AuthProvider` stocke tokens (localStorage + context)
5. `fetch-interceptor` configure header Authorization
6. Redirection vers dashboard

---

## 📊 Résumé

| Métrique | Valeur |
|----------|--------|
| **Fichiers avec fetch** | 32 fichiers |
| **Client Components** | 28 |
| **Server Components** | 2 |
| **Utilities** | 2 |
| **Services API** | 8 |
| **Pages protégées** | 5+ |
| **Routes publiques** | 3 |
| **Composants UI réutilisables** | 50+ |

---

**📝 Document généré:** 31 janvier 2026