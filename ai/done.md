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

## Prochaine étape

**Étape 4** — Implémenter l'inscription utilisateur end-to-end pour valider toute la chaîne :
`Angular → API REST → Spring Boot → MySQL`