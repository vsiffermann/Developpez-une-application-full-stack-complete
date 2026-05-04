
# 📘 Specs — Projet MDD (Monde de Dév)

_Source : Contraintes techniques, Spécifications fonctionnelles et transcription réunion_  

---

# 🧭 Contexte

MDD est un réseau social pour développeurs visant à :
- Favoriser la collaboration
- Faciliter le recrutement

Le projet est développé sous forme de **MVP (Minimum Viable Product)**.

---

# ⚙️ Contraintes techniques

## Architecture
- Front-end et back-end séparés
- Communication via API
- Sécurisation obligatoire des échanges
- Respect des principes **SOLID**

## Stack imposée
- **Back-end** : Java + Spring  
  - Spring Core obligatoire (IoC / DI)
  - Spring Boot recommandé
  - Priorité aux modules Spring (ex: Spring Data)

- **Front-end** : Angular + TypeScript  
  - Respect des bonnes pratiques Angular

## Versionning
- Git + GitHub
- Un seul repository pour tout le projet

---

# 🧩 Spécifications fonctionnelles

## 👤 Gestion des utilisateurs
- Inscription (email, username, password)
- Connexion (email ou username)
- Session persistante
- Consultation du profil
- Modification du profil
- Déconnexion

---

## 🧷 Gestion des abonnements
- Liste des thèmes
- S’abonner à un thème
- Se désabonner

---

## 📝 Gestion des articles
- Fil d’actualité (chronologique)
- Tri (asc / desc)
- Création d’article
- Consultation d’article
- Ajout de commentaire

---

## 📱 Exigences spécifiques

- Application responsive (mobile + desktop)
- Mot de passe sécurisé :
  - ≥ 8 caractères
  - majuscule + minuscule + chiffre + spécial
- Auteur + date automatiques (articles & commentaires)
- Pas de commentaires imbriqués
- Bouton "Déjà abonné" après souscription

---

# 🎨 UX / Parcours utilisateur

## Pages principales

- Page d’accueil (connexion / inscription)
- Page connexion
- Page inscription
- Fil d’actualité (connecté)
- Page thèmes
- Page article
- Formulaire création article
- Page profil

## Actions utilisateur

- S’abonner à des thèmes
- Lire / créer articles
- Commenter
- Modifier profil

---

# 🧠 Informations issues de la réunion

## Organisation

- Projet repris après un début par Heidi
- Forte autonomie sur les choix techniques
- Documentation obligatoire des décisions

## Recommandations techniques

- Base de données relationnelle (MySQL suggéré)
- Utilisation de Spring Data JPA recommandée
- Liberté sur architecture (monolithe vs microservices)

⚠️ Attention : rester simple (MVP)

---

# 📌 Contraintes projet

- Respect strict des spécifications
- Pas de back-office
- MVP simple (pas de sur-ingénierie)
- Cohérence front / back
- Documentation obligatoire

---

# 🧾 Livrables attendus

- Application full-stack fonctionnelle
- API sécurisée
- Base de données cohérente
- Code versionné
- Documentation technique
- Justification des choix techniques

---

# 🎯 Objectif

Construire un MVP stable, cohérent, documenté et prêt à être présenté.
