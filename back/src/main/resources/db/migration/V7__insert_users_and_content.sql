-- =============================================================
-- V7 — Jeu de données de test complet
-- Mot de passe de tous les utilisateurs : Test@1234
-- =============================================================

-- ---------------------------------------------------------------
-- UTILISATEURS (4)
-- ---------------------------------------------------------------
INSERT INTO `user` (email, username, password, created_at) VALUES
    ('alice@example.com',   'alice',   '$2b$10$kYRaB9n74VFFtvmuPE67Ne4GgPxs70h84VVZXbTHLtkpFsYXxSYfy', '2026-03-01 09:00:00'),
    ('bob@example.com',     'bob',     '$2b$10$7EIuR6g1vn3Wfw.1lnGPieH9fCZPBljz3bHF05nWb27/qV94erhna', '2026-03-02 10:30:00'),
    ('charlie@example.com', 'charlie', '$2b$10$iprmrRySJyCVFIuklVLjjeZCnerQD2u4GJFnB6e88vHiJxripJeCy', '2026-03-05 14:00:00'),
    ('diana@example.com',   'diana',   '$2b$10$Oyo876LGTQgf3ybdVZd3tuaRvW1vBcDCchwy2dLNnKB09JtsxZeOu', '2026-03-10 08:45:00');

-- ---------------------------------------------------------------
-- ABONNEMENTS
-- alice  → JavaScript, Python
-- bob    → Java, DevOps
-- charlie→ JavaScript, Web3, DevOps
-- diana  → Python, Java
-- ---------------------------------------------------------------
INSERT INTO `subscription` (user_id, topic_id, created_at)
SELECT u.id, t.id, '2026-03-15 10:00:00'
FROM `user` u, `topic` t
WHERE (u.username = 'alice'   AND t.name IN ('JavaScript', 'Python'))
   OR (u.username = 'bob'     AND t.name IN ('Java', 'DevOps'))
   OR (u.username = 'charlie' AND t.name IN ('JavaScript', 'Web3', 'DevOps'))
   OR (u.username = 'diana'   AND t.name IN ('Python', 'Java'));

-- ---------------------------------------------------------------
-- ARTICLES (10)
-- ---------------------------------------------------------------
INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Les nouveautés d''ES2024',
    'ES2024 apporte plusieurs améliorations bienvenues au langage JavaScript. Parmi les plus notables, on trouve Object.groupBy() et Map.groupBy() qui permettent de regrouper des éléments par critère sans dépendre de bibliothèques externes.\n\nLa méthode Promise.withResolvers() simplifie la création de promesses en exposant directement resolve et reject. Plus besoin de stocker ces références dans des variables externes.\n\nLes expressions régulières bénéficient également d''une nouvelle option /v (unicodeSets) qui étend les possibilités de correspondance de caractères Unicode, notamment utile pour les applications multilingues.\n\nEnfin, Array.prototype.toSorted(), toReversed() et toSpliced() offrent des alternatives immutables aux méthodes existantes, ce qui facilite la programmation fonctionnelle et évite les effets de bord inattendus.',
    u.id,
    t.id,
    '2026-04-01 09:15:00'
FROM `user` u, `topic` t
WHERE u.username = 'alice' AND t.name = 'JavaScript';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Spring Boot 4 : ce qui change vraiment',
    'Spring Boot 4.0 marque une rupture importante avec les versions précédentes. La première nouveauté majeure est l''abandon du support de Java 17 comme minimum : il faut désormais Java 21 LTS (ou supérieur) pour faire tourner une application Spring Boot 4.\n\nLe module spring-boot-starter-web est maintenant basé sur Jakarta EE 11, ce qui implique une mise à jour de tous les imports javax.* vers jakarta.*. Cette migration, déjà entamée avec Spring Boot 3, est ici définitive.\n\nDu côté des performances, le démarrage à froid a été significativement réduit grâce à l''optimisation de l''auto-configuration. Spring Boot 4 tire également parti des Virtual Threads (Project Loom), activables via spring.threads.virtual.enabled=true.\n\nLes développeurs habitués à Spring Data JPA noteront que les repository sont désormais non-bloquants par défaut lorsque les Virtual Threads sont activés. À prendre en compte lors de la migration.',
    u.id,
    t.id,
    '2026-04-03 11:00:00'
FROM `user` u, `topic` t
WHERE u.username = 'bob' AND t.name = 'Java';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Python pour la data science en 2026',
    'Le paysage data science Python a beaucoup évolué. Pandas 2.x avec son backend Arrow change radicalement les performances pour les gros volumes : les opérations sur des DataFrames de 10M lignes sont jusqu''à 5x plus rapides.\n\nPolars s''impose de plus en plus comme alternative à Pandas pour les pipelines critiques. Sa syntaxe lazy evaluation et son moteur multithreadé en font un choix pertinent dès que les données dépassent quelques centaines de Mo.\n\nDu côté du machine learning, scikit-learn 1.4 introduit les pipelines HTML (représentation visuelle dans les notebooks) et améliore considérablement le support des types catégoriels natifs.\n\nPour le deep learning, la convergence entre PyTorch et JAX continue. JAX gagne du terrain pour la recherche grâce à ses capacités de différentiation automatique et son support natif des TPUs. PyTorch 2.x avec torch.compile() reste le standard en production.\n\nMa recommandation pour 2026 : maîtriser Polars + scikit-learn + PyTorch couvre 90% des besoins du terrain.',
    u.id,
    t.id,
    '2026-04-05 14:30:00'
FROM `user` u, `topic` t
WHERE u.username = 'diana' AND t.name = 'Python';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Déployer ses contrats Solidity sur Ethereum',
    'Déployer un contrat Solidity en production nécessite une méthodologie rigoureuse. Voici les étapes clés que j''applique systématiquement.\n\nPremièrement, l''audit du code. Avant tout déploiement sur mainnet, un audit par une société spécialisée (Trail of Bits, OpenZeppelin Audits) est indispensable. Les vulnérabilités comme la réentrance, l''overflow arithmétique ou la manipulation des oracles coûtent cher.\n\nDeuxièmement, les tests exhaustifs avec Hardhat ou Foundry. Foundry est devenu le standard en 2025 grâce à ses tests en Solidity natif et ses capacités de fuzzing intégrées.\n\nTroisièmement, le déploiement progressif. Je recommande de passer par Sepolia (testnet) → staging multisig → mainnet avec timelocks. Un proxy upgradeable (pattern OpenZeppelin Transparent Proxy) permet de corriger des bugs post-déploiement.\n\nEnfin, la surveillance on-chain via Tenderly ou OpenZeppelin Defender permet de détecter des transactions suspectes en temps réel.',
    u.id,
    t.id,
    '2026-04-07 16:00:00'
FROM `user` u, `topic` t
WHERE u.username = 'charlie' AND t.name = 'Web3';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Docker Compose pour le développement local',
    'Docker Compose est l''outil indispensable pour reproduire fidèlement son environnement de production en local. Voici les bonnes pratiques que j''ai consolidées après plusieurs projets Spring Boot + MySQL.\n\nD''abord, structurer son compose.yml avec des health checks. Un service Spring Boot qui démarre avant que MySQL soit prêt va planter. La bonne pratique : condition: service_healthy sur la dépendance vers la base de données.\n\nEnsuite, utiliser des volumes nommés pour persister les données MySQL entre les redémarrages. Éviter les volumes anonymes qui s''accumulent et consomment de l''espace disque.\n\nPour le hot-reload en développement, monter le dossier target/classes en volume et activer Spring DevTools. Le rechargement automatique à la recompilation évite de reconstruire l''image à chaque modification.\n\nEnfin, créer des profils Compose séparés : un pour le développement (avec outils de debug, ports exposés) et un pour les tests d''intégration (services minimalistes, données éphémères).',
    u.id,
    t.id,
    '2026-04-10 10:00:00'
FROM `user` u, `topic` t
WHERE u.username = 'bob' AND t.name = 'DevOps';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'TypeScript 5.4 : les nouvelles fonctionnalités',
    'TypeScript 5.4 continue d''affiner le système de types avec des améliorations pragmatiques. La plus impactante au quotidien : la préservation des types dans les closures après une assertion de type.\n\nAvant 5.4, TypeScript oubliait qu''une variable avait été vérifiée non-null dès qu''elle était capturée dans une closure. Ce comportement, source de nombreux casts redondants, est corrigé.\n\nNoSyntax introduit NoInfer<T>, un utilitaire qui empêche TypeScript d''inférer un type à partir d''un argument particulier. Utile pour forcer l''annotation explicite dans certains génériques.\n\nLes imports de types dans les fichiers .d.ts bénéficient également d''une amélioration : TypeScript peut maintenant résoudre les imports circulaires de manière plus intelligente, réduisant les erreurs de compilation dans les gros monorepos.\n\nPour les utilisateurs Angular, la migration vers TypeScript 5.4 est transparente. Les strict mode restent compatibles sans modification de tsconfig.',
    u.id,
    t.id,
    '2026-04-12 09:30:00'
FROM `user` u, `topic` t
WHERE u.username = 'charlie' AND t.name = 'JavaScript';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Sécuriser son API Spring avec JWT',
    'La sécurisation d''une API REST avec JWT suit un pattern bien établi dans Spring Security 7. Voici l''architecture que j''utilise sur ce projet.\n\nLe filtre JWT (OncePerRequestFilter) intercepte chaque requête, extrait le token de l''en-tête Authorization, le valide (signature + expiration) et positionne l''Authentication dans le SecurityContext.\n\nPour la génération des tokens, j''utilise la bibliothèque Auth0 java-jwt plutôt que jjwt. Elle est plus maintenable et son API fluent est plus lisible. Le secret est stocké dans application-local.properties, jamais dans le code.\n\nPoints de vigilance importants : ne jamais stocker d''informations sensibles dans le payload JWT (il est encodé en Base64, pas chiffré). Définir une durée d''expiration courte (1h max) et implémenter un mécanisme de refresh token si nécessaire.\n\nEnfin, tester systématiquement les cas limites : token expiré, signature invalide, token absent, utilisateur supprimé après émission du token.',
    u.id,
    t.id,
    '2026-04-15 11:45:00'
FROM `user` u, `topic` t
WHERE u.username = 'alice' AND t.name = 'Java';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'FastAPI vs Django : que choisir en 2026 ?',
    'La question revient régulièrement : FastAPI ou Django pour un nouveau projet Python en 2026 ? Ma réponse courte : FastAPI pour les APIs, Django pour les applications web complètes.\n\nFastAPI brille par ses performances (comparable à Node.js grâce à Starlette/ASGI), sa génération automatique de documentation OpenAPI et son système de dépendances élégant. Le typage Python est utilisé nativement pour la validation des données via Pydantic v2.\n\nDjango reste imbattable pour les projets qui nécessitent un back-office (Django Admin), une ORM mature avec migrations automatiques, et un écosystème de plugins immense. Django REST Framework reste excellent malgré son ancienneté.\n\nPour les microservices ou les APIs consommées par un front-end séparé (comme Angular), FastAPI est mon choix par défaut. Pour un projet avec une équipe moins expérimentée qui a besoin de scaffolding rapide, Django + DRF est plus sécurisant.\n\nNotez que Django 5.x avec son support ASGI natif a réduit l''écart de performances. Le choix se fait de plus en plus sur des critères d''équipe et de besoin.',
    u.id,
    t.id,
    '2026-04-18 15:00:00'
FROM `user` u, `topic` t
WHERE u.username = 'diana' AND t.name = 'Python';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'CI/CD complet avec GitHub Actions',
    'Mettre en place un pipeline CI/CD robuste avec GitHub Actions pour un projet Spring Boot + Angular. Voici l''architecture que j''ai adoptée.\n\nLe workflow se décompose en 4 jobs parallélisés : lint-front (ESLint + Prettier), test-front (Jest), test-back (JUnit + couverture JaCoCo) et security-scan (Dependabot alerts). Ces jobs tournent sur chaque PR.\n\nLe job de déploiement est conditionné au merge sur main. Il build les deux artefacts (ng build --configuration production + mvn package -P prod), publie l''image Docker sur GHCR, puis déclenche un rolling update sur le cluster.\n\nPoint important : les secrets (credentials DB, JWT secret, Docker registry token) sont stockés dans GitHub Secrets et injectés comme variables d''environnement au runtime. Jamais dans le code ni dans les fichiers de configuration versionnés.\n\nPour les projets Java, mettre en cache le répertoire ~/.m2 réduit le temps de build de 4 min à 90 secondes. Pour Node.js, cacher node_modules via actions/cache économise 2 min supplémentaires.',
    u.id,
    t.id,
    '2026-04-20 09:00:00'
FROM `user` u, `topic` t
WHERE u.username = 'charlie' AND t.name = 'DevOps';

INSERT INTO `post` (title, content, author_id, topic_id, created_at)
SELECT
    'Angular Signals : le nouveau paradigme de réactivité',
    'Les Signals dans Angular 21 ont définitivement remplacé l''ancien modèle basé sur Zone.js pour les nouveaux projets. Après plusieurs semaines d''utilisation intensive, voici mon retour d''expérience.\n\nLe principal avantage des Signals est la granularité de la détection de changements. Avec Zone.js, Angular vérifiait l''intégralité de l''arbre des composants à chaque événement asynchrone. Avec les Signals, seuls les composants qui dépendent d''un Signal modifié sont re-rendus.\n\nL''API est simple : signal() pour créer un signal mutable, computed() pour dériver une valeur, effect() pour les effets de bord. La courbe d''apprentissage est très accessible.\n\nL''intégration avec NgRx via toSignal() et toObservable() permet une migration progressive. Je recommande de conserver NgRx pour l''état global (authentification, données partagées) et d''utiliser les Signals pour l''état local des composants.\n\nUn point d''attention : les Signals ne remplacent pas les Observables RxJS pour les flux de données complexes (combinaison de sources, gestion des erreurs réseau). Les deux coexistent bien.',
    u.id,
    t.id,
    '2026-04-25 10:30:00'
FROM `user` u, `topic` t
WHERE u.username = 'alice' AND t.name = 'JavaScript';

-- ---------------------------------------------------------------
-- COMMENTAIRES (24)
-- ---------------------------------------------------------------

-- Article 1 : Les nouveautés d'ES2024 (alice/JavaScript)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Super résumé ! Object.groupBy() m''a déjà sauvé la mise sur un projet la semaine dernière. Plus besoin de réduire manuellement en objet.', u.id, p.id, '2026-04-01 14:20:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'Les nouveautés d''ES2024';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'La méthode toSorted() est vraiment un game-changer pour React et Angular. On évitait de trier directement les tableaux du store pour ne pas muter l''état — maintenant c''est natif.', u.id, p.id, '2026-04-02 09:05:00'
FROM `user` u, `post` p WHERE u.username = 'charlie' AND p.title = 'Les nouveautés d''ES2024';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'À noter que Promise.withResolvers() est déjà supporté dans Node.js 22 et tous les navigateurs modernes. Pas besoin d''attendre un polyfill.', u.id, p.id, '2026-04-03 11:30:00'
FROM `user` u, `post` p WHERE u.username = 'diana' AND p.title = 'Les nouveautés d''ES2024';

-- Article 2 : Spring Boot 4 (bob/Java)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Je confirme pour les Virtual Threads, le gain est notable sur les applications I/O-bound. Sur notre API interne, on est passé de 200 à 800 req/s sans toucher au code métier.', u.id, p.id, '2026-04-04 08:30:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'Spring Boot 4 : ce qui change vraiment';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'La migration javax → jakarta reste le point le plus douloureux. Les librairies tierces qui n''ont pas encore migré bloquent tout. On a dû forker une dépendance legacy pour notre projet.', u.id, p.id, '2026-04-04 16:45:00'
FROM `user` u, `post` p WHERE u.username = 'charlie' AND p.title = 'Spring Boot 4 : ce qui change vraiment';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Merci pour le point sur spring.threads.virtual.enabled. J''avais raté ça dans les release notes. Tu as des benchmarks à partager ?', u.id, p.id, '2026-04-05 10:00:00'
FROM `user` u, `post` p WHERE u.username = 'diana' AND p.title = 'Spring Boot 4 : ce qui change vraiment';

-- Article 3 : Python data science (diana/Python)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Polars a vraiment changé ma façon de travailler. L''API est plus cohérente que Pandas et les performances sur les jointures complexes sont imbattables.', u.id, p.id, '2026-04-06 09:20:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'Python pour la data science en 2026';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Tu penses quoi de DuckDB comme alternative pour les analyses ad-hoc ? Je l''utilise de plus en plus comme "SQLite pour la data" et c''est impressionnant.', u.id, p.id, '2026-04-07 14:00:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'Python pour la data science en 2026';

-- Article 4 : Web3 Solidity (charlie/Web3)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Foundry pour les tests, totalement d''accord. Écrire ses tests en Solidity évite la couche de traduction JS/TS et les assertions sont beaucoup plus lisibles.', u.id, p.id, '2026-04-08 10:00:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'Déployer ses contrats Solidity sur Ethereum';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'OpenZeppelin Defender a beaucoup évolué. La nouvelle version v2 avec les Actions et les Monitors est vraiment bien pensée pour la surveillance en production.', u.id, p.id, '2026-04-09 11:15:00'
FROM `user` u, `post` p WHERE u.username = 'diana' AND p.title = 'Déployer ses contrats Solidity sur Ethereum';

-- Article 5 : Docker Compose (bob/DevOps)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Le point sur les health checks est crucial. J''ai perdu tellement de temps sur des conteneurs qui démarraient dans le mauvais ordre avant de comprendre ce mécanisme.', u.id, p.id, '2026-04-11 09:00:00'
FROM `user` u, `post` p WHERE u.username = 'charlie' AND p.title = 'Docker Compose pour le développement local';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Tu utilises Testcontainers pour les tests d''intégration ou tu gardes Docker Compose ? Je me pose la question pour standardiser notre stack de test.', u.id, p.id, '2026-04-11 15:30:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'Docker Compose pour le développement local';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Testcontainers pour les tests, Docker Compose pour le dev local — les deux sont complémentaires. Testcontainers garantit l''isolation par test, Compose donne un env persistant.', u.id, p.id, '2026-04-12 08:00:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'Docker Compose pour le développement local';

-- Article 6 : TypeScript 5.4 (charlie/JavaScript)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Le fix sur les closures est en effet très attendu. Combien de fois j''ai ajouté un const local = myVar juste pour que TypeScript arrête de se plaindre...', u.id, p.id, '2026-04-13 10:00:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'TypeScript 5.4 : les nouvelles fonctionnalités';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'NoInfer<T> règle un problème que j''avais exactement la semaine dernière sur un utilitaire générique. Je mets à jour ce soir.', u.id, p.id, '2026-04-14 16:00:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'TypeScript 5.4 : les nouvelles fonctionnalités';

-- Article 7 : JWT Spring Security (alice/Java)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Bel article. Un complément important : penser à invalider les tokens côté serveur lors d''un changement de mot de passe (blacklist ou rotation du secret par utilisateur).', u.id, p.id, '2026-04-16 09:30:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'Sécuriser son API Spring avec JWT';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Tu stockes le JWT en localStorage ou httpOnly cookie ? On débat de ça en équipe, les deux approches ont des arguments valides.', u.id, p.id, '2026-04-17 11:00:00'
FROM `user` u, `post` p WHERE u.username = 'charlie' AND p.title = 'Sécuriser son API Spring avec JWT';

-- Article 8 : FastAPI vs Django (diana/Python)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'On vient de migrer un service Django vers FastAPI pour les raisons que tu mentionnes. La validation Pydantic v2 est effectivement bien supérieure à DRF Serializers.', u.id, p.id, '2026-04-19 08:45:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'FastAPI vs Django : que choisir en 2026 ?';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Django Admin reste imbattable pour les back-offices internes. J''ai du mal à imaginer le reconstruire from scratch avec FastAPI + React juste pour gagner quelques ms de latence.', u.id, p.id, '2026-04-20 14:20:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'FastAPI vs Django : que choisir en 2026 ?';

-- Article 9 : GitHub Actions CI/CD (charlie/DevOps)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Le cache Maven est effectivement transformateur. J''utilise aussi actions/setup-java avec distribution: temurin qui gère le cache automatiquement depuis la v3.', u.id, p.id, '2026-04-21 10:00:00'
FROM `user` u, `post` p WHERE u.username = 'bob' AND p.title = 'CI/CD complet avec GitHub Actions';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Tu as envisagé de séparer le déploiement du CI ? Sur les gros projets, avoir un workflow dédié au déploiement déclenché manuellement ou par tag donne plus de contrôle.', u.id, p.id, '2026-04-22 09:15:00'
FROM `user` u, `post` p WHERE u.username = 'diana' AND p.title = 'CI/CD complet avec GitHub Actions';

-- Article 10 : Angular Signals (alice/JavaScript)
INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'L''intégration avec NgRx via toSignal() est vraiment bien pensée. On a migré nos sélecteurs les plus fréquents et le rendu est nettement plus fluide sur les listes longues.', u.id, p.id, '2026-04-26 08:30:00'
FROM `user` u, `post` p WHERE u.username = 'charlie' AND p.title = 'Angular Signals : le nouveau paradigme de réactivité';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Quid de la compatibilité avec les librairies qui utilisent encore Zone.js ? On a quelques dépendances UI qui ne semblent pas prêtes pour le mode zoneless.', u.id, p.id, '2026-04-27 11:00:00'
FROM `user` u, `post` p WHERE u.username = 'diana' AND p.title = 'Angular Signals : le nouveau paradigme de réactivité';

INSERT INTO `comment` (content, author_id, post_id, created_at)
SELECT 'Zone.js est toujours inclus par défaut même en mode Signals. Le mode fully zoneless est opt-in et encore expérimental. Les librairies tierces restent compatibles pour l''instant.', u.id, p.id, '2026-04-28 14:30:00'
FROM `user` u, `post` p WHERE u.username = 'alice' AND p.title = 'Angular Signals : le nouveau paradigme de réactivité';
