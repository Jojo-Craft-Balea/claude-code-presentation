# Claude Code — Présentation

Présentation interactive de [Claude Code](https://claude.ai/code) destinée aux développeurs.

Couvre les fonctionnalités essentielles : navigation dans le codebase, édition de fichiers, commandes bash, configuration via `CLAUDE.md`, skills et MCP.

**Démo en ligne :** https://jojo-craft-balea.github.io/claude-code-presentation/

## Stack

- Slides en Markdown (`presentation.md`)
- Rendu via [marked.js](https://marked.js.org/) + highlight.js
- Styles en SCSS compilés avec sass
- Vanilla JS, aucun framework

## Développement

```bash
npm install
npm run watch   # compile le SCSS en mode watch
```

Ouvrir `index.html` directement dans le navigateur.

## Déploiement

Un push sur `main` déclenche automatiquement le déploiement sur GitHub Pages via la GitHub Action `.github/workflows/deploy.yml`.
