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
| Inscription utilisateur | Email + username + password (regex) |        |
| Connexion               | JWT + localStorage                  |        |
| Consultation profil     | Email, username, abonnements        |        |
| Modification profil     | Mise à jour infos                   |        |
| Déconnexion             | Suppression JWT                     |        |
| Liste des thèmes        | Tous les topics                     |        |
| S’abonner               | Bouton dynamique                    |        |
| Se désabonner           | Depuis profil                       |        |
| Fil d’actualité         | Articles abonnements                |        |
| Tri du fil              | Ascendant / descendant              |        |
| Créer un article        | Thème + contenu                     |        |
| Consulter article       | + commentaires                      |        |
| Ajouter commentaire     | Non récursif                        |        |

---

# 2. Architecture et conception technique

## 2.1 Schéma global de l’architecture

*(À compléter)*

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

| Type             | Outil            | Portée               | Résultat |
| ---------------- | ---------------- | -------------------- | -------- |
| Test unitaire BE | JUnit + Mockito  | Services             | ≥ 70%    |
| Test intégration | Spring Boot Test | API                  | OK       |
| Test unitaire FE | Jest             | Composants           | ≥ 70%    |
| Test E2E         | Cypress          | Parcours utilisateur | OK       |

---

## 3.2 Performance et optimisation

Prévu :

* Lazy loading Angular
* Pagination du feed
* Audit Lighthouse ≥ 80
* Index MySQL

---

## 3.3 Revue technique

### Points forts

* Architecture SOLID
* API REST claire
* Angular standalone

### Améliorations

* Spring Boot 4 récent
* Angular 21 peu supporté
* JWT en localStorage (à sécuriser)

---

# 4. Documentation utilisateur et supervision

## 4.1 FAQ

**Créer un compte**
→ Page d’accueil > S’inscrire

**Connexion**
→ Email ou username

**Session**
→ Persistante sauf logout

**S’abonner**
→ Page thèmes

**Se désabonner**
→ Profil

**Bug chargement**
→ Refresh / vérifier backend

---

## 4.2 Tâches IA

| Tâche           | Outil  | Objectif    | Vérification       |
| --------------- | ------ | ----------- | ------------------ |
| Entités JPA     | Claude | Boilerplate | Vérif relations    |
| DTO / Mapper    | Claude | Sécurité    | Supprimer password |
| Tests JUnit     | Claude | Couverture  | Cas erreurs        |
| Spring Security | Claude | JWT         | Test complet       |
| Angular         | Claude | Structure   | Vérif types        |

---

# 5. Annexes

À produire :

* ERD
* Screens UI
* Couverture tests
* Audit Lighthouse
* Revue technique
* Swagger

---

## Annexes complémentaires

* UI screenshots
* Analyse front
* Schémas données
* Rapports tests
* Revue technique complète