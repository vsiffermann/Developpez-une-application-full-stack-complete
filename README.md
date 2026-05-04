# MDD — Monde de Dév

Réseau social dédié aux développeurs — MVP réalisé dans le cadre d'une formation OpenClassrooms.

**Auteur :** Siffermann Victor

---

## Sommaire

1. [Présentation](#présentation)
2. [Stack technique](#stack-technique)
3. [Installation et lancement](#installation-et-lancement)
4. [API REST — Endpoints](#api-rest--endpoints)
5. [Tests](#tests)
6. [Documentation API (Swagger)](#documentation-api-swagger)

---

## Présentation

MDD est un MVP de réseau social pour développeurs permettant de :
- S'abonner à des thèmes (JavaScript, Java, Python, Web3, DevOps)
- Consulter un fil d'actualité chronologique filtré par abonnements
- Créer et commenter des articles
- Gérer son profil

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Front-end | Angular | 21.2 |
| State management | NgRx | 21 |
| UI | Angular Material | 21 |
| Back-end | Spring Boot | 4.0.6 |
| Langage | Java | 25 LTS |
| Sécurité | Spring Security + JWT | 7 |
| ORM | Spring Data JPA | 4 |
| Base de données | MySQL | 8.4 LTS |
| Migrations | Flyway | — |
| Tests back | JUnit 5 + Mockito | — |
| Tests front | Jest | 30 |
| Tests E2E | Cypress | 15 |

---

## Installation et lancement

### Prérequis

- Java 25
- Node 22 + npm 10
- MySQL 8.4 (base `mdd_db` créée)
- Angular CLI 21

### Back-end

```bash
cd back
cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
# Renseigner les valeurs dans application-local.properties
./mvnw spring-boot:run
```

Le fichier `application-local.properties` doit contenir :

```properties
spring.datasource.username=<votre_user_mysql>
spring.datasource.password=<votre_mot_de_passe>
jwt.secret=<clé_secrète_min_32_caractères>
```

Le back-end démarre sur **http://localhost:8080**.  
Flyway applique automatiquement les migrations et les données de test au démarrage.

### Front-end

```bash
cd front
npm install
npm start
```

Le front-end démarre sur **http://localhost:4200** et proxifie `/api/*` vers le back-end.

### Données de test

Les migrations Flyway insèrent automatiquement :
- 4 utilisateurs : `alice`, `bob`, `charlie`, `diana` (mot de passe : `Test@1234`)
- 5 thèmes : JavaScript, Java, Python, Web3, DevOps
- 10 articles et 24 commentaires

---

## API REST — Endpoints

**Base URL :** `http://localhost:8080/api`  
**Auth :** header `Authorization: Bearer <token>` (sauf routes publiques)

### Authentification

| Méthode | Endpoint | Auth | Description | Corps |
|---|---|---|---|---|
| POST | `/auth/register` | Non | Inscription | `{ email, username, password }` |
| POST | `/auth/login` | Non | Connexion | `{ identifier, password }` |

**Réponse register / login :**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "email": "alice@example.com", "username": "alice" }
}
```

**Contraintes mot de passe :** 8 caractères minimum, une majuscule, une minuscule, un chiffre, un caractère spécial (`@$!%*?&#`).  
**Connexion :** l'`identifier` accepte l'email **ou** le nom d'utilisateur.

---

### Utilisateur

| Méthode | Endpoint | Auth | Description | Corps |
|---|---|---|---|---|
| GET | `/users/me` | Oui | Profil de l'utilisateur connecté | — |
| PUT | `/users/me` | Oui | Modifier le profil | `{ email?, username?, password? }` |

**Réponse GET `/users/me` :**
```json
{ "id": 1, "email": "alice@example.com", "username": "alice" }
```

---

### Thèmes

| Méthode | Endpoint | Auth | Description | Corps |
|---|---|---|---|---|
| GET | `/topics` | Oui | Liste de tous les thèmes avec statut d'abonnement | — |
| POST | `/topics/{id}/subscribe` | Oui | S'abonner à un thème | — |
| DELETE | `/topics/{id}/subscribe` | Oui | Se désabonner d'un thème | — |

**Réponse GET `/topics` :**
```json
[
  { "id": 1, "name": "JavaScript", "description": "...", "subscribed": true },
  { "id": 2, "name": "Java", "description": "...", "subscribed": false }
]
```

**Codes d'erreur :**
- `404` — thème introuvable
- `409` — déjà abonné (POST) / pas abonné (DELETE)

---

### Articles

| Méthode | Endpoint | Auth | Description | Corps |
|---|---|---|---|---|
| GET | `/posts/feed?sort=desc` | Oui | Fil d'actualité (thèmes abonnés) | — |
| POST | `/posts` | Oui | Créer un article | `{ title, content, topicId }` |
| GET | `/posts/{id}` | Oui | Détail d'un article + commentaires | — |
| POST | `/posts/{id}/comments` | Oui | Ajouter un commentaire | `{ content }` |

**Paramètre `sort` :** `desc` (plus récent en premier, défaut) ou `asc`.

**Réponse GET `/posts/feed` :**
```json
[
  {
    "id": 1,
    "title": "Les nouveautés d'ES2024",
    "content": "...",
    "authorUsername": "alice",
    "topicName": "JavaScript",
    "createdAt": "2026-04-01T10:00:00"
  }
]
```

**Réponse GET `/posts/{id}` :**
```json
{
  "id": 1,
  "title": "Les nouveautés d'ES2024",
  "content": "...",
  "authorUsername": "alice",
  "topicName": "JavaScript",
  "createdAt": "2026-04-01T10:00:00",
  "comments": [
    { "id": 1, "content": "Super article", "authorUsername": "bob", "createdAt": "2026-04-01T11:00:00" }
  ]
}
```

---

## Tests

### Lancer les tests

```bash
# Back-end (JUnit + MockMvc) — génère le rapport JaCoCo
cd back && ./mvnw test
# Rapport de couverture : back/target/site/jacoco/index.html

# Front-end (Jest) — avec couverture
cd front && npm run test:coverage
# Rapport de couverture : front/coverage/index.html

# E2E Cypress — avec rapport HTML fusionné (back + front démarrés)
cd front && npm run cypress:report
# Rapport : front/cypress/results/report.html
```

### Résultats

| Suite | Outil | Tests | Résultat |
|---|---|---|---|
| Services back | JUnit 5 + Mockito | 31 | ✅ 0 échec |
| Controllers back | Spring Boot Test + MockMvc + H2 | 33 | ✅ 0 échec |
| Reducers / Selectors / Guard | Jest | 40 | ✅ 0 échec |
| Composants | Jest + MockStore | 37 | ✅ 0 échec |
| Effets NgRx | Jest + HttpTestingController | 35 | ✅ 0 échec |
| E2E | Cypress | 34 | ✅ 0 échec |
| **Total** | | **210** | **✅ 0 échec** |

### Couverture front-end (Jest)

| Métrique | Résultat | Objectif |
|---|---|---|
| Statements | 85% | ≥ 70% ✅ |
| Branches | 80% | ≥ 70% ✅ |
| Functions | 71% | ≥ 70% ✅ |
| Lines | 88% | ≥ 70% ✅ |

---

## Documentation API (Swagger)

L'interface Swagger UI est disponible à l'adresse suivante lorsque le back-end est démarré :

**http://localhost:8080/swagger-ui.html**

La spécification OpenAPI brute est accessible à :

**http://localhost:8080/api-docs**
