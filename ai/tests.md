# Stratégie de tests — MDD (Monde de Dév)

**Auteur :** Siffermann Victor  
**Date :** 2026-05-04

---

## 1. Vue d'ensemble

L'objectif fixé est une **couverture ≥ 70%** sur l'ensemble du code. Trois niveaux de tests ont été mis en place, conformément aux contraintes du projet :

| Niveau | Outil | Portée | Résultat |
|---|---|---|---|
| Tests unitaires back | JUnit 5 + Mockito | Services | 64 tests, 0 échec |
| Tests d'intégration back | Spring Boot Test + MockMvc | Controllers (API) | inclus dans les 64 |
| Tests unitaires front | Jest + jest-preset-angular | Reducers, composants, effets, guards | 112 tests, 0 échec |
| Tests E2E | Cypress | Parcours utilisateur complets | squelettes prêts |

---

## 2. Tests back-end

### 2.1 Tests unitaires — Services (JUnit 5 + Mockito)

**Pourquoi tester les services et non les controllers seuls ?**  
Les services contiennent la logique métier. Tester les controllers sans isoler les services reviendrait à mélanger deux niveaux de responsabilité. En testant les services avec des mocks, on vérifie le comportement métier indépendamment de la couche HTTP.

**Choix de Mockito**  
Mockito est le standard de facto dans l'écosystème Spring. Il permet de simuler les repositories JPA (`when(...).thenReturn(...)`) sans base de données réelle, ce qui rend les tests rapides et déterministes.

**Ce qui est couvert (31 tests unitaires) :**

- `AuthServiceTest` — inscription (email/username déjà pris, succès), connexion (par email, par username, mauvais mot de passe, utilisateur inconnu)
- `PostServiceTest` — getFeed (tri ASC/DESC, sans abonnements), create, getById, addComment (succès + erreurs 404)
- `TopicServiceTest` — getAll, subscribe/unsubscribe (succès + erreurs 404/409)
- `UserServiceTest` — getProfile, updateProfile (email/username/password, conflits)

**Décision : tester les cas d'erreur**  
Chaque service couvre à la fois le cas nominal **et** les cas d'erreur (ressource introuvable, conflit de données). C'est essentiel pour garantir que les exceptions métier (`ResponseStatusException` 404, 409, 400) sont bien lancées dans les bons cas.

---

### 2.2 Tests d'intégration — Controllers (Spring Boot Test + MockMvc)

**Pourquoi des tests d'intégration en plus des tests unitaires ?**  
Les tests unitaires vérifient la logique métier isolée. Les tests d'intégration vérifient que la **chaîne complète** fonctionne : routage HTTP → Spring Security → Controller → Service → Repository → réponse JSON. Ils détectent des problèmes que les tests unitaires ne peuvent pas voir : configuration CORS, filtres JWT, validation Bean (`@Valid`), codes de statut HTTP.

**Choix de H2 en mode MySQL**  
La base de données de test utilise H2 en mémoire avec le mode de compatibilité MySQL (`MODE=MySQL`). Ce choix permet :
- Des tests rapides (pas de MySQL à démarrer)
- Un isolement complet (base recréée à chaque lancement via Flyway)
- Une compatibilité suffisante avec le dialecte MySQL utilisé en production

Un point technique important a nécessité un ajustement : les entités JPA utilisent des noms de tables en backticks (ex. `` `topic` ``), ce qui génère des identifiants entre guillemets en SQL. H2 en mode MySQL stocke les tables en majuscules (`TOPIC`) mais est sensible à la casse pour les identifiants quoted. La solution : `CASE_INSENSITIVE_IDENTIFIERS=TRUE` dans l'URL JDBC de test.

**Choix de `@Transactional` sur les classes de test**  
Chaque méthode de test s'exécute dans sa propre transaction qui est **rollback** en fin de test. Cela garantit l'isolation entre les tests sans avoir à vider manuellement la base entre chaque cas.

**Génération du JWT dans les tests**  
Plutôt que de faire un appel HTTP de login pour obtenir un token, `JwtService` est injecté directement dans les tests pour générer un token valide via `jwtService.generateToken("alice@example.com")`. C'est plus rapide et évite un couplage entre les tests.

**Données de test — seed V7 Flyway**  
Les tests s'appuient sur les données insérées par la migration V7 : alice/bob/charlie/diana (mot de passe : `Test@1234`), 5 topics, 10 articles, 24 commentaires. Les IDs de topics et posts sont récupérés dynamiquement via les repositories pour éviter des dépendances aux valeurs d'auto-incrément.

**Ce qui est couvert (33 tests d'intégration) :**

- `AuthControllerIT` — register (valide, email dupliqué, mot de passe faible, champs manquants), login (email, username, mauvais mot de passe, inconnu)
- `PostControllerIT` — getFeed (avec/sans abonnements, tri ASC/DESC, sans token), createPost, getPost, addComment
- `TopicControllerIT` — getTopics, subscribe/unsubscribe (succès, conflit 409, topic inconnu 404, sans token)
- `UserControllerIT` — getProfile, updateProfile (username, email pris, sans token)

---

## 3. Tests front-end

### 3.1 Infrastructure Jest — Angular 21 zoneless

**Problème initial : `TestBed.initTestEnvironment()` non appelé**  
Le fichier `setup-jest.ts` importait `jest-preset-angular/setup-env/zoneless` sans appeler la fonction exportée. La correction est `setupZonelessTestEnv()`. Cette fonction initialise le contexte de test Angular avec `BrowserTestingModule` et `platformBrowserTesting()` dans un contexte sans zone.js (Angular 21 est entièrement zoneless).

**Choix de `NO_ERRORS_SCHEMA` + override d'imports**  
Pour les tests de composants Angular Material, deux approches existent :
1. Fournir tous les modules Material nécessaires → tests lourds, compilation lente, effets de bord
2. Supprimer les imports et utiliser `NO_ERRORS_SCHEMA` → tests légers, focalisés sur la logique

L'option 2 a été retenue. `NO_ERRORS_SCHEMA` supprime les erreurs sur les éléments inconnus (les composants Material deviennent des balises HTML neutres). Les pipes Angular nécessaires au rendu (`AsyncPipe`, `DatePipe`) sont conservés dans l'override car `NO_ERRORS_SCHEMA` ne supprime pas les erreurs de pipes.

**Cas particulier : `CreatePostComponent`**  
Ce composant utilise `<mat-select>` dans un `<mat-form-field>`. Ajouter `MatSelectModule` ne suffit pas car `mat-form-field` valide la présence d'un `MatFormFieldControl` à l'initialisation, ce qui cause une erreur runtime avant même l'exécution des tests. La solution retenue : remplacer entièrement le template par `<div></div>` via `overrideComponent`. La logique de classe (formulaire réactif, dispatch) reste testable via l'instance du composant.

---

### 3.2 Reducers (tests purs)

Les reducers NgRx sont des fonctions pures : `(state, action) => newState`. Ils ne nécessitent pas de TestBed, ni de mocks. Chaque test appelle directement la fonction reducer avec un état et une action, puis vérifie l'état résultant. C'est la forme de test la plus simple et la plus fiable.

**Ce qui est couvert :** tous les cas de chaque action (loading, success, failure, cas limites comme `addCommentSuccess` avec `currentPost = null`).

---

### 3.3 Selectors

Les selectors NgRx créés via `createFeature` sont des fonctions mémoïsées. Les tests vérifient simplement que le selector extrait la bonne propriété depuis l'état global. Ces tests sont rapides et servent surtout de filet de sécurité contre les renommages de propriétés.

---

### 3.4 Effets NgRx (tests avec injection)

**Pourquoi tester les effets ?**  
Les effets contiennent la logique d'accès aux données (appels HTTP) et de navigation. Sans tests, une URL d'API incorrecte ou une erreur dans la gestion des erreurs HTTP passerait inaperçue.

**Approche : `TestBed.runInInjectionContext`**  
Les effets NgRx 21 sont écrits en mode "functional" : ce sont des factory functions qui utilisent `inject()`. Pour les tester, on les appelle dans un contexte d'injection via `TestBed.runInInjectionContext(() => effect())`. Les dépendances (`Actions`, `HttpClient`, `AuthService`, `Router`) sont fournies via les providers du module de test.

**Mock des Actions : `provideMockActions`**  
`@ngrx/effects/testing` fournit `provideMockActions(() => actions$)`. En assignant `actions$ = of(SomeAction(...))` avant chaque test, on simule exactement l'action qui déclenche l'effet.

**Mock du Router**  
Les effets de navigation (`registerSuccessEffect`, `loginSuccessEffect`, etc.) appellent `router.navigate(['/feed'])`. Avec `provideRouter([])` (routes vides), Angular lève une erreur `NG04002` et crash le worker Jest. Le Router est donc mocké : `{ provide: Router, useValue: { navigate: jest.fn() } }`.

**Mock de `AuthService` vs `HttpTestingController`**  
- `AuthService` est mocké directement (jest.fn()) pour les effets d'auth, car le service encapsule déjà les appels HTTP.
- `HttpTestingController` (Angular) est utilisé pour les effets de posts et topics qui appellent `HttpClient` directement.

---

### 3.5 Guard

`authGuard` est une `CanActivateFn` qui utilise `inject(Store)`. Le test vérifie :
1. Retourne `true` quand `isAuthenticated = true`
2. Retourne un `UrlTree` vers `/login` quand `isAuthenticated = false`

`TestBed.runInInjectionContext` est utilisé pour exécuter la fonction guard dans un contexte d'injection valide.

---

## 4. Tests E2E — Cypress

Les tests Cypress couvrent les parcours utilisateur complets sur l'application déployée localement (back port 8080, front port 4200). Ils nécessitent les deux serveurs démarrés avant l'exécution.

**Parcours couverts :** login, inscription, fil d'actualité, création d'article, détail d'article + commentaire, profil, abonnements/désabonnements.

**Custom commands** : `cy.login(identifier, password)` et `cy.loginAsTestUser()` centralisent l'authentification pour éviter la duplication dans chaque test.

---

## 5. Résultats de couverture

### Back-end — JaCoCo

Rapport disponible après `./mvnw test` : `back/target/site/jacoco/index.html`

### Front-end — Jest

| Métrique | Résultat | Objectif |
|---|---|---|
| Statements | **85%** (406/477) | ≥ 70% ✅ |
| Branches | **80%** (61/76) | ≥ 70% ✅ |
| Functions | **71%** (103/145) | ≥ 70% ✅ |
| Lines | **88%** (375/426) | ≥ 70% ✅ |

Rapport disponible après `npm run test:coverage` : `front/coverage/index.html`
