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

Le LLM sous-jacent est le **même** — c'est l'environnement qui change.

**Claude web** — interface navigateur, mode one-shot : tu poses une question, il répond, sans accès à tes fichiers ni à ton environnement.

**Claude Code** — interface terminal, mode agent : il accède à ton codebase, exécute des commandes, tourne une **boucle autonome** — planifie, exécute, observe les résultats, s'adapte — et recommence jusqu'à ce que la tâche soit terminée.

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

Documentation officielle : [docs.anthropic.com/en/docs/claude-code/quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)

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

`@fichier` — ajoute (tag) un fichier précis dans le contexte de la conversation

`/commande` — exécute un skill/command de claude (custom ou non)

`! shell-command` — exécute une commande shell directement sans quitter Claude

`Esc Esc` — efface le texte en cours de saisie ; si le champ est vide, affiche l'historique des conversations

`Shift+Tab` — change le mode d'exécution :
- **accept edits on** — Claude applique les modifications sans demander
- **plan mode on** — Claude planifie uniquement, sans rien exécuter
- **bypass permissions on** — Claude exécute toutes les actions sans aucune confirmation, y compris les opérations sensibles ⚠️

---

## Configuration

### Configuration > CLAUDE.md

#### Configuration > CLAUDE.md > Configuration locale (projet)

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

---

#### Configuration > CLAUDE.md > Configuration globale

Le fichier `~/.claude/CLAUDE.md` est chargé dans **toutes** les sessions, quel que soit le projet. C'est l'endroit pour y mettre ses préférences personnelles : langue, conventions de code, comportements à adopter ou éviter.

> ⚠️ Claude applique tout ce qui est dans ce fichier à chaque conversation. N'y mettre que des instructions claires et utiles pour lui — une information floue ou hors sujet risque de perturber son comportement plutôt que de l'améliorer.

---

### Configuration > .claude/rules

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

---

#### Configuration > .claude/rules > Règles par type de fichier

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

### Configuration > Skills

Les skills enrichissent les connaissances de Claude avec des informations spécifiques à votre projet, votre équipe ou votre domaine. 
C'est un concept unifié stocké dans **`.claude/skills/<nom>/SKILL.md`**.

Un skill joue **deux rôles** selon sa configuration :

#### Configuration > Skills > 1. Connaissance contextuelle (chargé automatiquement)

Claude charge le skill quand il le juge pertinent, sans que tu le demandes.

```markdown
<!-- .claude/skills/api-conventions/SKILL.md -->
---
name: api-conventions
description: REST API design conventions for our services
---
- Use kebab-case for URL paths
- Always include pagination for list endpoints
```

---

#### Configuration > Skills > 2. Workflow invocable (déclenché manuellement)

Avec `disable-model-invocation: true`, le skill devient une commande `/skill-name`.

```markdown
<!-- .claude/skills/fix-issue/SKILL.md -->
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---
Analyze and fix the GitHub issue: $ARGUMENTS.

1. Use `gh issue view` to get the issue details
2. Search the codebase for relevant files
3. Implement the fix
4. Write and run tests
5. Create a descriptive commit and open a PR
```

Invoquer avec `/fix-issue 1234`.

---

#### Configuration > Skills > Règle de décision

| Cas | Outil |
|---|---|
| Convention utile seulement parfois | Skill (chargé à la demande) |
| Règle utile à toutes les sessions | `CLAUDE.md` |
| Workflow avec effets de bord à déclencher manuellement | Skill avec `disable-model-invocation: true` |

> Les skills globaux se placent dans `~/.claude/skills/` et sont disponibles dans tous les projets.

---

### Configuration > settings.json

Le fichier `~/.claude/settings.json` (global) ou `.claude/settings.json` (projet) permet de configurer le comportement de Claude.

---

#### Configuration > settings.json > Permissions

Contrôle quelles actions Claude peut effectuer sans demander de confirmation :

```json
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm *)", "Edit"],
    "deny": ["Bash(rm *)"]
  }
}
```

**`"defaultMode": "bypassPermissions"`** — active le mode bypass de façon persistante : Claude exécute toutes les actions sans jamais demander de confirmation.

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

> ⚠️ À réserver aux environnements isolés (CI, conteneurs). Ne jamais activer en local sur une machine de travail.

**`"skipDangerousModePermissionPrompt": true`** — supprime uniquement le message de confirmation affiché quand tu actives manuellement le mode bypass via `Shift+Tab`. Le bypass n'est pas activé en permanence — tu dois toujours le déclencher toi-même.

```json
{
  "skipDangerousModePermissionPrompt": true
}
```

> Utile si tu actives souvent le bypass manuellement et que le prompt de confirmation est superflu pour toi.

---

#### Configuration > settings.json > Hooks

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

---
