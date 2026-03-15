# Claude Code

## Qu'est-ce que Claude Code ?

**Claude Code** est un agent IA de terminal développé par Anthropic.

- Fonctionne directement dans le terminal (CLI)
- Accès natif au système de fichiers, git, bash
- Comprend le contexte de ton projet entier
- Prend des décisions et agit de manière autonome

> Pas un simple copilote — un **agent** qui peut réaliser des tâches complexes de bout en bout.

---

## Claude web vs Claude Code

| | Claude (web) | Claude Code |
|---|---|---|
| **Interface** | Navigateur | Terminal |
| **Accès aux fichiers** | ✗ | ✓ |
| **Exécute des commandes** | ✗ | ✓ |
| **Lit ton codebase** | ✗ | ✓ |
| **Agit de manière autonome** | ✗ | ✓ |

Le LLM sous-jacent est le **même** — c'est l'environnement qui change.

**Claude web** — mode one-shot : tu poses une question, il répond, c'est fini.

**Claude Code** — mode agent : il tourne une **boucle autonome** — planifie, exécute, observe les résultats, s'adapte — et recommence jusqu'à ce que la tâche soit terminée.

> Claude web te répond. Claude Code **agit**.

---

## Installation

**macOS / Linux / WSL**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell**
```powershell
irm https://claude.ai/install.ps1 | iex
```

Documentation officielle : [code.claude.com/docs/en/quickstart](https://code.claude.com/docs/en/quickstart)

---

## Lancer Claude dans le terminal

```bash
cd mon-projet
claude
```

Claude analyse automatiquement le répertoire courant : structure des fichiers, code source, historique git, fichiers de config...

**Tout ce qui est dans le dossier fait partie de son contexte.**

> Lance toujours Claude **depuis la racine du projet** pour qu'il ait le contexte complet.

---

## Commandes & raccourcis essentiels

`?` — affiche toutes les commandes disponibles

`@fichier` — ajoute un fichier précis dans le contexte de la conversation

`/commande` — lance une commande slash

`! commande` — exécute une commande shell directement sans quitter Claude

`Esc Esc` — efface le texte en cours de saisie ; si le champ est vide, affiche l'historique des conversations

`Shift + Tab` — change le mode d'exécution :
- **accept edits on** — Claude applique les modifications sans demander
- **plan mode on** — Claude planifie uniquement, sans rien exécuter
- **bypass permissions on** — Claude exécute toutes les actions sans aucune confirmation, y compris les opérations sensibles ⚠️

---

## Configuration

---

## CLAUDE.md

### Configuration locale (projet)

Un fichier `CLAUDE.md` peut être placé n'importe où dans le projet. Claude l'intègre automatiquement dans son contexte lorsqu'il travaille sur des fichiers situés au même niveau ou en dessous.

```
mon-projet/
├── CLAUDE.md           ← contexte global du projet
├── src/
│   ├── CLAUDE.md       ← contexte spécifique au dossier src/
│   └── ...
└── ...
```

La commande `/init` demande à Claude de scanner le projet et de générer un `CLAUDE.md` adapté à son contenu.

### Configuration globale

Le fichier `~/.claude/CLAUDE.md` est chargé dans **toutes** les sessions, quel que soit le projet. C'est l'endroit pour y mettre ses préférences personnelles : langue, conventions de code, comportements à adopter ou éviter.

> ⚠️ Claude applique tout ce qui est dans ce fichier à chaque conversation. N'y mettre que des instructions claires et utiles pour lui — une information floue ou hors sujet risque de perturber son comportement plutôt que de l'améliorer.

---

## .claude/rules

Le dossier `.claude/rules/` dans un projet permet d'ajouter des règles locales, propres à ce projet.

```
mon-projet/
├── .claude/
│   └── rules/
│       ├── conventions.md    ← conventions de code du projet
│       ├── architecture.md   ← règles d'architecture
│       └── ...
└── ...
```

Chaque fichier Markdown dans ce dossier est automatiquement chargé par Claude au démarrage de la session.

### Règles par type de fichier

Un frontmatter `globs` permet de cibler un type de fichier spécifique :

```markdown
---
globs: "**/*.test.ts"
---

Pour les fichiers de test :
- Utiliser describe/it de Vitest
- Ne jamais mocker la base de données
```

Claude charge ce fichier uniquement quand il travaille sur des fichiers qui matchent le glob.

> Idéal pour partager des règles d'équipe : conventions de nommage, patterns à respecter, fichiers à ne jamais modifier...

---

## .claude/commands

Le dossier `.claude/commands/` permet de définir des commandes slash personnalisées, disponibles avec `/` dans Claude Code.

```
mon-projet/
├── .claude/
│   └── commands/
│       ├── review.md     ← /review
│       ├── deploy.md     ← /deploy
│       └── ...
└── ...
```

Chaque fichier Markdown devient une commande : son contenu est injecté comme prompt lorsque la commande est invoquée.

```markdown
<!-- .claude/commands/review.md -->
Fais une revue de code du fichier courant :
- Vérifie le respect des conventions du projet
- Identifie les problèmes de performance
- Propose des améliorations concrètes
```

> Les commandes globales se placent dans `~/.claude/commands/` et sont disponibles dans tous les projets.

---

## settings.json

Le fichier `~/.claude/settings.json` (global) ou `.claude/settings.json` (projet) permet de configurer le comportement de Claude.

### Permissions

Contrôle quelles actions Claude peut effectuer sans demander de confirmation :

```json
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm *)", "Edit"],
    "deny": ["Bash(rm *)"]
  }
}
```

Le mode `bypassPermissions` autorise **toutes** les actions sans confirmation — équivalent au `Shift+Tab` vu précédemment, mais persistant :

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

> ⚠️ À réserver aux environnements isolés (CI, conteneurs). Ne jamais activer en local sur une machine de travail.

### Hooks

Les hooks permettent d'exécuter des commandes shell en réponse aux actions de Claude :

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{ "type": "command", "command": "echo 'Commande shell détectée'" }]
    }],
    "PostToolUse": [{
      "matcher": "Edit",
      "hooks": [{ "type": "command", "command": "npm run lint" }]
    }]
  }
}
```

Événements disponibles : `PreToolUse`, `PostToolUse`, `Notification`, `Stop`

> Utile pour lancer automatiquement le linter après chaque modification de fichier, notifier une action sensible, logger les outils utilisés...
