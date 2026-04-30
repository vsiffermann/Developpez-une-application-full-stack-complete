# Résumé du projet MDD — Monde de Dév

## Contexte

Projet réalisé dans le cadre d'une formation OpenClassrooms.
Rôle : Lead Developer — reprise d'un projet initié par une collègue.
Objectif : développer le MVP d'un réseau social dédié aux développeurs.

---

## Étape 1 — Analyse du projet existant

- Lecture des spécifications fonctionnelles, contraintes techniques et transcription de réunion
- Analyse du repository existant (Angular 14 + Spring Boot 2.x — trop ancien, décision de repartir from scratch)
- Identification des 5 entités métier : `User`, `Topic`, `Subscription`, `Post`, `Comment`
- Identification des 13 fonctionnalités du MVP (auth, abonnements, articles, commentaires)
- Identification des points de vigilance : responsive obligatoire, session persistante, pas de back-office, pas de sous-commentaires

---

## Étape 2 — Architecture et choix techniques

### Stack technique retenue

| Couche | Technologie | Version |
|---|---|---|
| Front-end | Angular | 21.2 |
| State management | NgRx | 19 |
| UI components | Angular Material | 21 |
| Back-end | Spring Boot | 4.0.6 |
| Langage | Java | 25 LTS |
| Sécurité | Spring Security | 7 |
| ORM | Spring Data JPA + Hibernate | 7 |
| Base de données | MySQL | 8.4 LTS |
| Migrations BDD | Flyway | — |
| Auth | JWT (java-jwt Auth0) | 4.4.0 |
| Boilerplate | Lombok | — |
| Doc API | Springdoc OpenAPI | 2.8.8 |
| Tests back | JUnit 5 + Mockito | — |
| Tests front | Jest | 29 |
| Tests E2E | Cypress | — |
| Versionning | Git + GitHub (Gitflow) | — |

### Justification des versions récentes
Angular 21, Java 25 et Spring Boot 4 ont été choisis volontairement pour apprendre les dernières fonctionnalités modernes de chaque technologie.

### Architecture retenue
- **Monolithique** (pas de microservices — MVP interne)
- **Client-serveur** : front-end Angular séparé du back-end Spring Boot, communication via API REST + JWT
- **Back-end en couches** : Controller → Service → Repository → Entity + DTO

### Design patterns identifiés
Repository, DTO, Service Layer, Builder, Filter Chain, Singleton, Store (Redux/NgRx), Observer, Interceptor, Guard, Facade, MVC

### API REST définie — 11 endpoints
- `POST /api/auth/register` — Public
- `POST /api/auth/login` — Public
- `GET /api/users/me` — Auth
- `PUT /api/users/me` — Auth
- `GET /api/topics` — Auth
- `POST /api/topics/{id}/subscribe` — Auth
- `DELETE /api/topics/{id}/subscribe` — Auth
- `GET /api/posts/feed?sort=desc|asc` — Auth
- `POST /api/posts` — Auth
- `GET /api/posts/{id}` — Auth
- `POST /api/posts/{id}/comments` — Auth

### Livrables produits
- Document Word de justification des choix techniques
- Diagramme d'architecture draw.io (vue globale 4 couches)
- Diagramme draw.io des endpoints API
- Diagrammes interactifs (architecture + structure des dossiers)

---

## Étape 3 — Mise en place de l'environnement

### Outils installés
- nvm-windows → Node 22.22.2
- npm 10.9.7
- Angular CLI 21.2.8
- IntelliJ IDEA (back-end)
- VS Code (front-end)

### Back-end Spring Boot 4
- Projet généré via Spring Initializr
- Dépendances configurées dans `pom.xml`
- `application.properties` — configuration publique
- `application-local.properties` — données sensibles (ignoré par Git)
- Profil Spring `local` activé
- 6 migrations Flyway appliquées avec succès :
  - `V1` — table `user`
  - `V2` — table `topic`
  - `V3` — table `subscription`
  - `V4` — table `post`
  - `V5` — table `comment`
  - `V6` — données de test (5 topics)
- Back-end démarré sur `http://localhost:8080`

### Front-end Angular 21
- Projet généré avec Angular CLI (`--standalone --routing --style=scss`)
- Angular Material installé et configuré
- NgRx installé (`store`, `effects`, `entity`, `router-store`, `store-devtools`)
- Proxy configuré vers `http://localhost:8080/api`
- Structure des dossiers créée :
  - `core/` — guards, interceptors, services
  - `features/` — auth, feed, posts, topics, profile
  - `shared/` — components, models
  - `store/` — auth, posts, topics (NgRx)
- Modèles TypeScript créés : `User`, `Topic`, `Post`, `Comment`
- Front-end démarré sur `http://localhost:4200`

### Workflow Git (Gitflow)
```
main
└── develop
```

---

---

## Étape 4 — Inscription utilisateur end-to-end

### Corrections découvertes en cours
- `application-local.properties` converti en UTF-8 (commentaire `é` en ISO-8859-1 cassait Maven)
- Java 25 LTS installé manuellement → `pom.xml` conserve bien `<java.version>25</java.version>`

### Back-end créé
- `entity/User.java` — entité JPA mappée sur la table `user` (backtick-quoted)
- `repository/UserRepository.java` — JPA repository (findByEmail, existsByEmail/Username)
- `dto/RegisterRequest.java` — validation Bean (@Email, @Pattern mot de passe sécurisé)
- `dto/AuthResponse.java` — réponse `{ token, user: { id, email, username } }`
- `service/JwtService.java` — génération/validation JWT via Auth0 java-jwt
- `service/AuthService.java` — inscription : vérifie unicité email/username, encode le mot de passe, retourne JWT
- `controller/AuthController.java` — `POST /api/auth/register` (public)
- `config/JwtAuthenticationFilter.java` — filtre JWT (extrait le user du token sur chaque requête)
- `config/SecurityConfig.java` — Spring Security stateless, `/api/auth/**` public, reste protégé

### Front-end créé/mis à jour
- `auth.actions.ts` — ajout de `Register`, `RegisterSuccess`, `RegisterFailure`
- `auth.reducer.ts` — gestion du state register
- `auth.effects.ts` — `registerEffect` + `registerSuccessEffect` (navigue vers /feed), `HttpErrorResponse` géré proprement sur tous les effets
- `auth.service.ts` — URL corrigée de `http://localhost:8080/api` vers `/api` (proxy Angular)
- `features/auth/register/` — composant complet : formulaire réactif, validation client, gestion erreurs serveur, Angular Material
- `features/auth/login/` — placeholder (à implémenter étape 5)
- `features/feed/` — placeholder (à implémenter étape 5)
- `app.routes.ts` — routes : `/` → `/register`, `/register`, `/login`, `/feed` (protégé par authGuard)
- `app.html` — nettoyé (uniquement `<router-outlet />`)

### Chaîne validée (compilation)
- `mvnw compile` → OK (Java 25, Spring Boot 4.0.6)
- `tsc --noEmit` → OK (Angular 21, zéro erreur TypeScript)

---

## Session suivante — Améliorations back + outillage

### Back-end ajouté
- `exception/GlobalExceptionHandler.java` — `@RestControllerAdvice` centralisé :
  - `MethodArgumentNotValidException` → 400 avec map `{ field: message }` (erreurs `@Valid`)
  - `ResponseStatusException` → status HTTP + `{ message }` (erreurs métier)
  - `BadCredentialsException` → 401 `{ message: "Identifiants invalides" }` (prêt pour le login)
  - `Exception` → 500 fallback propre
  - Corrige le bug d'affichage front : Spring Boot 4 retournait ProblemDetail (`detail`) au lieu de `message`

### Outillage ajouté
- `postman/MDD.postman_collection.json` — collection Postman complète :
  - 11 endpoints organisés en 4 dossiers (Auth, Utilisateur, Thèmes, Articles)
  - Variable `{{token}}` auto-renseignée après register/login via script test
  - Variable `{{baseUrl}}` = `http://localhost:8080/api`

---

## Étape 5 — Fonctionnalités principales back-end (API complète)

### Entités JPA créées
- `entity/Topic.java` — thème (id, name, description)
- `entity/Subscription.java` — abonnement user↔topic (contrainte unique)
- `entity/Post.java` — article (title, content, author, topic, createdAt, comments)
- `entity/Comment.java` — commentaire (content, author, post, createdAt)

### Repositories
- `TopicRepository` — `findAll()`
- `SubscriptionRepository` — `findByUser`, `existsByUserAndTopic`, `findByUserAndTopic`
- `PostRepository` — `findByTopicIn(topics, sort)`
- `CommentRepository`

### DTOs
- `LoginRequest` — identifier (email ou username) + password
- `UserResponse` — id, email, username
- `UpdateProfileRequest` — email?, username?, password? (tous optionnels)
- `TopicResponse` — id, name, description, subscribed (booléen contextualisé)
- `CreatePostRequest` — title, content, topicId
- `CreateCommentRequest` — content
- `CommentResponse` — id, content, authorUsername, createdAt
- `PostSummaryResponse` — id, title, content, authorUsername, topicName, createdAt
- `PostDetailResponse` — idem + liste de commentaires

### Services
- `AuthService.login()` — recherche par email ou username, vérifie mot de passe BCrypt, retourne JWT
- `UserService` — `getProfile()`, `updateProfile()` (vérif unicité email/username)
- `TopicService` — `getAll()` (avec flag subscribed), `subscribe()`, `unsubscribe()`
- `PostService` — `getFeed()` (tri asc/desc), `create()`, `getById()`, `addComment()`

### Controllers
- `AuthController` — ajout `POST /api/auth/login`
- `UserController` — `GET /api/users/me`, `PUT /api/users/me`
- `TopicController` — `GET /api/topics`, `POST /api/topics/{id}/subscribe`, `DELETE /api/topics/{id}/subscribe`
- `PostController` — `GET /api/posts/feed?sort=desc`, `POST /api/posts`, `GET /api/posts/{id}`, `POST /api/posts/{id}/comments`

### Compilation validée
- `mvnw compile` → OK (11 endpoints, 0 erreur)

---

## Étape 5 suite — Front-end Angular (fonctionnalités principales)

### Modèles corrigés
- `Post` — passe de nested objects (`author: User`, `topic: Topic`) à plat (`authorUsername`, `topicName`) pour correspondre à l'API
- `PostDetail` — interface étendue avec `comments: Comment[]`
- `Comment` — idem : `authorUsername: string` au lieu de `author: User`

### Store NgRx enrichi
- `posts.actions` — ajout `SetSortOrder`, `CreatePostFailure`, `LoadPostFailure`, `AddComment*`
- `posts.reducer` — `currentPost: PostDetail | null`, gestion de tous les nouveaux cas
- `posts.effects` — tri passé dans l'URL, `createPostSuccessEffect` navigue vers `/posts/:id`, `addCommentEffect`, URL corrigée vers `/api`
- `auth.actions` — ajout `UpdateProfile*`
- `auth.reducer` — gestion `updateProfile*`
- `auth.effects` — ajout `updateProfileEffect`
- `topics.effects` — URL corrigée vers `/api`
- `auth.service` — ajout `updateMe()`

### Composant partagé
- `shared/components/navbar/navbar.component` — barre de navigation avec liens Feed, Thèmes, Profil

### Composants implémentés
- `LoginComponent` — formulaire réactif, dispatch `AuthActions.login`, toggle visibilité mot de passe
- `FeedComponent` — connecté au store, tri asc/desc, état vide, navigation vers article
- `TopicsComponent` — liste des thèmes, bouton abonner/désabonner dynamique
- `PostDetailComponent` — article complet + liste commentaires + formulaire ajout commentaire
- `CreatePostComponent` — formulaire titre/contenu/thème, redirige vers l'article créé
- `ProfileComponent` — affichage profil, formulaire modification, bouton déconnexion

### Routes ajoutées
- `/topics`, `/posts/new`, `/posts/:id`, `/profile` (toutes protégées par authGuard)
- Route par défaut redirige vers `/login` (au lieu de `/register`)

### Compilation validée
- `tsc --noEmit` → OK (0 erreur TypeScript)

---

## Étape 6 — UI & Responsive

### index.html
- Titre corrigé : "MDD — Monde de Dév"
- `lang="fr"` ajouté
- Doublons de fonts/icons supprimés

### styles.scss
- Ajout `box-sizing: border-box` global
- Breakpoints `$mobile: 600px` et `$tablet: 960px` définis avec mixins

### Responsive appliqué à tous les composants
- `feed.component.scss` — header flex-wrap sur mobile
- `topics.component.scss` — grille passe en 1 colonne sous 600px
- `post-detail.component.scss` — meta et header commentaires flex-wrap
- `create-post.component.scss` — bouton submit pleine largeur sur mobile
- `profile.component.scss` — boutons d'action flex-wrap
- `login.component.scss` + `register.component.scss` — bouton submit pleine largeur

### Maquettes Figma
- Intégrées (fichiers `ai/maquettes/P6-1.png` et `P6-2.png` analysés)

### Compilation validée
- `tsc --noEmit` → OK (0 erreur TypeScript)

---

## Étape 6 (suite) — Intégration maquettes Figma

### Design system
- Couleur principale : `mat.$deep-purple-palette` (violet) dans `styles.scss`
- Logo MDD : composant SVG partagé (`shared/components/logo/logo.component`) — nuage violet + texte "MDD" blanc, taille configurable via input `size`

### Nouveaux fichiers
- `features/home/home.component` — page d'accueil avec logo centré + boutons "Se connecter" / "S'inscrire"
- `shared/components/logo/logo.component` — logo SVG réutilisable

### Composants mis à jour
- `app.routes.ts` — route `/` → `HomeComponent` (sans guard), `**` redirige vers `/`
- `navbar.component` — liens textuels desktop (Articles, Thèmes, Se déconnecter, icône profil) + hamburger `mat-menu` sur mobile
- `login.component` + `register.component` — logo MDD centré en haut, flèche retour vers `/`, liens "Déjà inscrit" supprimés
- `feed.component` — grille 2 colonnes desktop → 1 colonne mobile, bouton "Créer un article" à gauche, tri à droite
- `create-post.component` — renommé "Créer un nouvel article", champs réordonnés (Titre → Catégorie → Contenu), bouton "Créer"
- `post-detail.component` — titre en premier, méta (date/auteur/thème) dessous, bouton icône envoi pour commentaire
- `profile.component` — section "Abonnements" ajoutée (topics filtrés `subscribed=true`, bouton Se désabonner), chargement via `TopicsActions.loadTopics()`

### Compilation validée
- `tsc --noEmit` → OK (0 erreur TypeScript)

---

## Prochaine étape

⚠️ **Validation manuelle obligatoire** :
- Tester l'application end-to-end (back + front démarrés)
- Vérifier chaque parcours : accueil, inscription, connexion, fil d'actualité, thèmes, article, commentaire, profil, abonnements
- Corriger les éventuels bugs découverts

**Étape 7** — Tests :
- Tests unitaires back (JUnit + Mockito) — couverture ≥ 70%
- Tests unitaires front (Jest) — composants principaux
- Tests E2E (Cypress) — parcours utilisateur complets