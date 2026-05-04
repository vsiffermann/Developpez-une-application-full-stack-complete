# MDD — Monde de Dév

Lis ces fichiers avant toute chose. Ils contiennent tout le contexte nécessaire — inutile d'explorer le projet pour retrouver des informations qui s'y trouvent déjà.

@ai/exercice.md
@ai/specs.md
@ai/choix-tech.md
@ai/done.md

---

## Maintenance

Après chaque session de travail significative, mets à jour `ai/done.md` :
- ce qui a été fait (fichiers créés/modifiés, décisions prises)
- la prochaine étape

---

## Conventions

- Gitflow : branche `develop`
- Commits en anglais, préfixés : `back:`, `front:`, `feat:`, `fix:`, `docs:`, `chore:`
- Secrets dans `application-local.properties` uniquement (ignoré par Git, jamais commité)
- Serveur back : `http://localhost:8080` — Serveur front : `http://localhost:4200`
