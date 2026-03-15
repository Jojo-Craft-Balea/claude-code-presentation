# Claude Code Presentation

Présentation de Claude Code destinée aux collègues développeurs.

## Architecture

```
/
├── presentation.md       # Contenu des slides (source de vérité)
├── index.html            # Point d'entrée — charge marked.js et le JS/CSS
├── src/
│   ├── js/main.js        # Logique : fetch du markdown, split en slides, navigation
│   └── scss/main.scss    # Styles de la présentation
├── dist/
│   └── main.css          # CSS compilé (généré par npm run build)
└── package.json          # npm scripts (sass)
```

## Format des slides

`presentation.md` est découpé en slides par les séparateurs `---`.
Chaque slide commence généralement par un titre `##`.

## Commandes

```bash
npm install        # Installer sass
npm run build      # Compiler le SCSS une fois
npm run watch      # Compiler le SCSS en mode watch
```

Ouvrir `index.html` directement dans le navigateur (pas de serveur nécessaire).

## Conventions

- Le contenu de la présentation est dans `presentation.md` uniquement.
- Le JS est en vanilla ES6 (pas de framework).
- Le SCSS est compilé vers `dist/main.css`.
- `marked.js` est chargé via CDN.
