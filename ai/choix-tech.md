# Documentation et rapport du projet MDD

**Auteur :** Siffermann Victor
**Version :** 0.0.1
**Date :** 27/04/2026

---

## Table des matières

1. Présentation générale du projet
2. Architecture et conception technique
3. Tests, performance et qualité
4. Documentation utilisateur et supervision
5. Annexes

---

# 1. Présentation générale du projet

## 1.1 Objectifs du projet

ORION souhaite créer **MDD (Monde de Dév)**, un réseau social dédié aux développeurs.

Objectifs :

* Faciliter la mise en relation entre pairs
* Constituer un vivier de recrutement

Le MVP (Minimum Viable Product) couvre :

* Abonnement à des thèmes (JavaScript, Java, Python, Web3…)
* Fil d’actualité chronologique
* Création d’articles et commentaires
* Authentification sécurisée

---

## 1.2 Périmètre fonctionnel

| Fonctionnalité          | Description                         | Statut |
| ----------------------- | ----------------------------------- | ------ |
| Inscription utilisateur | Email + username + password (regex) | ✅     |
| Connexion               | JWT + localStorage                  | ✅     |
| Consultation profil     | Email, username, abonnements        | ✅     |
| Modification profil     | Mise à jour infos                   | ✅     |
| Déconnexion             | Suppression JWT                     | ✅     |
| Liste des thèmes        | Tous les topics                     | ✅     |
| S’abonner               | Bouton dynamique                    | ✅     |
| Se désabonner           | Depuis profil                       | ✅     |
| Fil d’actualité         | Articles abonnements                | ✅     |
| Tri du fil              | Ascendant / descendant              | ✅     |
| Créer un article        | Thème + contenu                     | ✅     |
| Consulter article       | + commentaires                      | ✅     |
| Ajouter commentaire     | Non récursif                        | ✅     |

---

# 2. Architecture et conception technique

## 2.1 Schéma global de l’architecture

L’application suit une architecture **client-serveur en couches** :

```
[Navigateur]
     │  HTTP/JSON + JWT
     ▼
[Angular 21 — SPA]
  Composants standalone → Store NgRx → Services HTTP
     │  /api/* (proxy dev → port 8080)
     ▼
[Spring Boot 4 — API REST]
  Controller → Service → Repository
     │  Spring Data JPA / Hibernate
     ▼
[MySQL 8.4]
  Tables : user, topic, subscription, post, comment
```

**Flux d’authentification :** l’utilisateur s’inscrit ou se connecte via `/api/auth/*`. Le back-end retourne un JWT signé (Auth0 java-jwt). Le front-end stocke ce token en `localStorage` et l’envoie dans l’en-tête `Authorization: Bearer <token>` à chaque requête protégée. Spring Security intercepte et valide le token via un filtre JWT (`JwtAuthenticationFilter`) avant d’atteindre les controllers.

**Migrations BDD :** gérées par Flyway (V1 → V7), incluant les tables et les données de test (5 topics, articles, commentaires).

---

## 2.2 Choix techniques

| Élément             | Type        | Documentation       | Objectif          | Justification           |
| ------------------- | ----------- | ------------------- | ----------------- | ----------------------- |
| Angular 21.2        | Front-end   | angular.dev         | SPA réactive      | Dernière version stable |
| Angular Material 21 | UI          | material.angular.io | UI accessible     | Déjà intégré            |
| Java 25 LTS         | Back-end    | openjdk.org         | Performance       | Support long terme      |
| Spring Boot 4.0.5   | Framework   | spring.io           | Backend complet   | Version récente         |
| Spring Security 7   | Sécurité    | spring.io/security  | Auth JWT          | Intégration native      |
| Spring Data JPA 4   | ORM         | spring.io/data      | Accès BDD         | Simplifie relations     |
| MySQL 8.4 LTS       | BDD         | dev.mysql.com       | Persistance       | Très répandu            |
| Flyway              | Migration   | flywaydb.org        | Versioning BDD    | Intégré Spring          |
| Springdoc OpenAPI 3 | API Doc     | springdoc.org       | Swagger           | Génération auto         |
| JUnit 5 + Mockito   | Tests BE    | junit.org           | Tests unitaires   | Standard Spring         |
| Jest 29             | Tests FE    | jestjs.io           | Tests Angular     | Rapide                  |
| Cypress             | E2E         | cypress.io          | Tests utilisateur | Interface claire        |
| Git + GitHub        | Versionning | github.com          | Gestion code      | Standard                |
| Postman             | API         | postman.com         | Tests REST        | Outil requis            |

---

## 2.3 API et schémas de données

### Endpoints REST

Préfixe : `/api`
Auth : `Authorization: Bearer <token>`

| Endpoint               | Méthode | Description            | Corps / Réponse                  |
| ---------------------- | ------- | ---------------------- | -------------------------------- |
| /auth/register         | POST    | Inscription            | `{email, username, password}`    |
| /auth/login            | POST    | Connexion              | `{identifier, password}`         |
| /users/me              | GET     | Profil                 | `{id, email, username}`          |
| /users/me              | PUT     | Modifier profil        | `{email?, username?, password?}` |
| /topics                | GET     | Liste thèmes           | `[topics]`                       |
| /topics/{id}/subscribe | POST    | S’abonner              | `{message}`                      |
| /topics/{id}/subscribe | DELETE  | Désabonner             | `{message}`                      |
| /posts/feed            | GET     | Fil                    | `{posts}`                        |
| /posts                 | POST    | Créer article          | `{post}`                         |
| /posts/{id}            | GET     | Article + commentaires | `{post, comments}`               |
| /posts/{id}/comments   | POST    | Ajouter commentaire    | `{comment}`                      |

---

# 3. Tests, performance et qualité

## 3.1 Stratégie de test

| Type | Outil | Portée | Tests | Résultat |
| --- | --- | --- | --- | --- |
| Tests unitaires BE | JUnit 5 + Mockito | Services | 31 | ✅ 0 échec |
| Tests intégration BE | Spring Boot Test + MockMvc + H2 | Controllers | 33 | ✅ 0 échec |
| Tests unitaires FE | Jest — reducers, selectors, guard | Store NgRx | 40 | ✅ 0 échec |
| Tests unitaires FE | Jest — composants avec MockStore | Composants | 37 | ✅ 0 échec |
| Tests unitaires FE | Jest — effets NgRx | Effets HTTP | 35 | ✅ 0 échec |
| Tests E2E | Cypress | Parcours utilisateur | 34 | ✅ 0 échec |
| **Total** | | | **210** | **✅ 0 échec** |

### Couverture front-end (Jest — `npm run test:coverage`)

| Métrique | Résultat | Objectif |
| --- | --- | --- |
| Statements | 85% | ≥ 70% ✅ |
| Branches | 80% | ≥ 70% ✅ |
| Functions | 71% | ≥ 70% ✅ |
| Lines | 88% | ≥ 70% ✅ |

Rapport HTML : `front/coverage/index.html`  
Rapport JaCoCo (back) : `back/target/site/jacoco/index.html` (après `./mvnw test`)  
Rapport Cypress fusionné : `front/cypress/results/report.html` (après `npm run cypress:report`)

Pour plus de détails sur les choix de test, voir `ai/tests.md`.

---

## 3.2 Performance et optimisation

Mesures en place :

* **Lazy loading Angular** — chaque route charge son composant à la demande (`loadComponent`)
* **Tri côté serveur** — le paramètre `?sort=desc|asc` est traité par Spring Data (`Sort.Direction`)
* **Données de test isolées** — migrations Flyway séparées (V6 topics, V7 seed complet)

Pistes d'amélioration non implémentées (hors périmètre MVP) :

* Pagination du fil d'actualité
* Index MySQL sur `post.created_at` et `subscription.user_id`
* Audit Lighthouse

---

## 3.3 Revue technique

### Points forts

**Architecture**
- Séparation claire des responsabilités : Controller → Service → Repository → Entity/DTO
- Respect des principes SOLID : chaque classe a une responsabilité unique, les dépendances sont injectées
- API REST cohérente avec des codes HTTP sémantiques (200, 201, 400, 401, 404, 409)
- Gestion centralisée des erreurs via `@RestControllerAdvice`

**Sécurité**
- Authentification stateless via JWT (HS256, signé Auth0 java-jwt)
- Spring Security configuré pour rejeter toute requête non authentifiée par défaut
- Mots de passe encodés BCrypt
- Validation des entrées côté back (`@Valid`, `@Pattern`, `@Email`) et côté front (Validators Angular)

**Front-end**
- Composants standalone Angular 21 : pas de NgModule, imports explicites
- State management NgRx avec effets fonctionnels : logique métier centralisée, composants purement présentationnels
- `APP_INITIALIZER` pour recharger l'utilisateur depuis le JWT au démarrage — évite une session vide après rechargement de page

**Tests**
- 210 tests automatisés couvrant tous les niveaux (unitaire, intégration, E2E)
- Couverture front ≥ 70% sur les 4 métriques Jest
- Tests d'intégration back avec base H2 + Flyway : proche des conditions réelles sans dépendance à MySQL

### Axes d'amélioration

**Sécurité**
- Le JWT est stocké en `localStorage`, ce qui l'expose aux attaques XSS. Une alternative plus sûre serait un cookie `HttpOnly` géré par le serveur.
- Aucun mécanisme de rafraîchissement du token (refresh token) : la session expire après 24h sans possibilité de renouvellement silencieux.
- Pas de rate limiting sur les endpoints publics (`/auth/register`, `/auth/login`).

**Architecture**
- Spring Boot 4 et Angular 21 sont des versions très récentes avec moins de retours d'expérience en production. Ce choix délibéré pour l'apprentissage implique un risque de compatibilité sur certaines librairies tierces.
- Le fil d'actualité n'est pas paginé : avec un grand nombre d'articles, les performances se dégraderaient.

**Fonctionnel**
- Pas de système de notification en temps réel (WebSocket ou SSE).
- Pas de gestion des images pour les profils ou les articles.
- La recherche d'articles n'est pas implémentée.

### Recommandations

1. **Court terme** — Ajouter un mécanisme de refresh token et migrer le JWT vers un cookie `HttpOnly` pour renforcer la sécurité.
2. **Moyen terme** — Paginer le fil d'actualité (paramètre `page` + `size` côté API, scroll infini ou pagination côté Angular).
3. **Long terme** — Envisager des index MySQL sur les colonnes fréquemment filtrées (`subscription.user_id`, `post.created_at`) et un audit Lighthouse pour valider les performances front.

---

# 4. Documentation utilisateur et supervision

## 4.1 FAQ utilisateur

### Compte et connexion

**Comment créer un compte ?**  
Rendez-vous sur la page d’accueil et cliquez sur "S’inscrire". Renseignez un nom d’utilisateur (3 caractères minimum), une adresse e-mail valide et un mot de passe sécurisé (8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial parmi `@$!%*?&#`).

**Comment se connecter ?**  
Depuis la page de connexion, saisissez votre adresse e-mail **ou** votre nom d’utilisateur, puis votre mot de passe.

**Ma session expire-t-elle ?**  
Votre session est conservée entre les visites. Si vous vous déconnectez manuellement ou videz le cache de votre navigateur, vous devrez vous reconnecter.

**J’ai oublié mon mot de passe.**  
Il n’existe pas encore de fonctionnalité de réinitialisation par e-mail dans ce MVP. Contactez l’administrateur.

---

### Thèmes et fil d’actualité

**Comment s’abonner à un thème ?**  
Rendez-vous sur la page "Thèmes" (accessible depuis la barre de navigation). Cliquez sur le bouton "S’abonner" de la carte correspondante. Le bouton passe en "Se désabonner" pour confirmer l’abonnement.

**Comment se désabonner d’un thème ?**  
Depuis la page "Profil", la section "Abonnements" liste vos thèmes actifs. Cliquez sur "Se désabonner" pour retirer un abonnement. Vous pouvez également le faire directement depuis la page "Thèmes".

**Le fil d’actualité est vide.**  
Le fil affiche uniquement les articles des thèmes auxquels vous êtes abonné. S’il est vide, abonnez-vous à au moins un thème depuis la page "Thèmes".

**Comment trier les articles ?**  
Un bouton de tri est disponible en haut du fil. Il bascule entre "Plus récent" (ordre chronologique descendant) et "Plus ancien" (ascendant).

---

### Articles et commentaires

**Comment créer un article ?**  
Depuis le fil d’actualité, cliquez sur "Créer un article". Renseignez un titre, sélectionnez un thème dans la liste déroulante et rédigez le contenu. Cliquez sur "Créer" pour publier.

**Puis-je modifier ou supprimer un article ?**  
Non. La modification et la suppression d’articles ne font pas partie du périmètre de ce MVP.

**Comment ajouter un commentaire ?**  
Depuis la page de détail d’un article, rédigez votre commentaire dans le champ en bas de page et cliquez sur l’icône d’envoi. Les commentaires ne peuvent pas être imbriqués.

---

### Problèmes fréquents

**L’application ne charge pas, que faire ?**  
Rafraîchissez la page (F5 ou Ctrl+R). Si le problème persiste, vérifiez votre connexion réseau. Si le back-end n’est pas démarré, suivez les instructions du README. Vider le cache du navigateur peut également résoudre certains problèmes d’affichage.

**"Identifiants invalides" à la connexion.**  
Vérifiez l’orthographe de votre identifiant (e-mail ou nom d’utilisateur) et de votre mot de passe. Les mots de passe sont sensibles à la casse.

**"Email déjà utilisé" à l’inscription.**  
L’adresse e-mail est déjà associée à un compte. Utilisez une autre adresse ou connectez-vous avec ce compte.

**"Nom d’utilisateur déjà pris" à l’inscription.**  
Choisissez un nom d’utilisateur différent.

**Le bouton de soumission est grisé.**  
Le formulaire contient des champs invalides. Vérifiez les messages d’erreur affichés sous chaque champ.

---

## 4.2 Supervision et tâches déléguées à l'IA

Décrivez les tâches confiées à l'IA, et comment vous avez vérifié, validé ou corrigé son travail.

| Tâche déléguée | Outil / collaborateur | Objectif | Vérification effectuée |
| --- | --- | --- | --- |
| Génération des entités JPA (User, Post, Comment, Topic, Subscription) | Claude Code | Gain de temps sur le boilerplate | Vérification des annotations JPA, des relations `@ManyToMany` et `@OneToMany`, ajout des contraintes de validation manquantes |
| Génération des DTOs et Mappers | Claude Code | Éviter l'exposition des entités directement | Contrôle des champs exposés, suppression du `password` dans les réponses utilisateur |
| Squelette des tests unitaires JUnit | Claude Code | Couvrir rapidement les cas nominaux | Revue des assertions, ajout des cas d'erreur (404, 409, 400), correction des mocks Mockito |
| Configuration Spring Security | Claude Code | Complexité technique, gain de temps | Test complet du filtre JWT, vérification CORS, test des routes publiques vs protégées via Postman |
| Génération des composants Angular (formulaires, services) | Claude Code | Structuration rapide du front-end | Vérification de la réactivité (Signals vs Observables), corrections des types TypeScript, tests Jest ajoutés manuellement |

---

# 5. Annexes

## 5.1 Schéma de base de données (ERD)

```
user
├── id (PK)
├── email (UNIQUE)
├── username (UNIQUE)
├── password (BCrypt)
└── created_at

topic
├── id (PK)
├── name (UNIQUE)
└── description

subscription
├── id (PK)
├── user_id (FK → user)
├── topic_id (FK → topic)
└── created_at
[UNIQUE: user_id + topic_id]

post
├── id (PK)
├── title
├── content (TEXT)
├── author_id (FK → user)
├── topic_id (FK → topic)
└── created_at

comment
├── id (PK)
├── content (TEXT)
├── author_id (FK → user)
├── post_id (FK → post)
└── created_at
```

## 5.2 Rapports de tests

| Rapport | Chemin | Commande |
| --- | --- | --- |
| Couverture Jest (HTML) | `front/coverage/index.html` | `npm run test:coverage` |
| Couverture JaCoCo (HTML) | `back/target/site/jacoco/index.html` | `./mvnw test` |
| Résultats Cypress (HTML) | `front/cypress/results/report.html` | `npm run cypress:report` |
| Documentation API | http://localhost:8080/swagger-ui.html | (back démarré) |

## 5.3 Collection Postman

Une collection Postman complète est disponible dans `postman/MDD.postman_collection.json`.

Elle couvre les 11 endpoints organisés en 4 dossiers (Auth, Utilisateur, Thèmes, Articles) et configure automatiquement la variable `{{token}}` après un register ou login.