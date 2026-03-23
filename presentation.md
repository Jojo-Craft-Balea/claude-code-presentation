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

> **Token** — unité de base traitée par le modèle (1 token ≈ 3/4 d'un mot courant).
> Chaque token consommé en entrée (ton prompt + contexte) et en sortie (la réponse) est comptabilisé — c'est ce qui détermine le coût de la session.

> Lance toujours Claude **depuis la racine du projet** pour qu'il ait le contexte complet.

Pour reprendre une session précédente :

```bash
claude --continue          # reprend automatiquement la dernière conversation
claude -c                  # alias de --continue

claude --resume            # affiche la liste des conversations récentes pour en choisir une
claude -r                  # alias de --resume
```

---

## Commandes & raccourcis essentiels

`?` — affiche toutes les commandes disponibles

`@fichier` — ajoute (tag) un fichier précis dans le contexte de la conversation

`/command-or-skill-name` — exécute un skill/command de claude (custom ou non)

`! shell-command` — exécute une commande shell directement sans quitter Claude

`Esc + Esc` — efface le texte en cours de saisie ; si le champ est vide, affiche l'historique des conversations

`/clear` — vide le contexte de la conversation en cours (utile entre deux tâches sans lien)

`Shift + Tab` — change le mode d'exécution :
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

Le dossier `.claude/rules/` permet d'ajouter des règles **ciblées par type de fichier** via un frontmatter `paths`.

```markdown
---
paths:
  - "**/*.test.ts"
---

Pour les fichiers de test :
- Utiliser describe/it de Vitest
- Ne jamais mocker la base de données
```

Claude charge ce fichier uniquement quand il travaille sur des fichiers qui matchent le pattern — le reste du temps, il n'occupe pas de contexte.

**Règle de décision :**
- Règle générale → `CLAUDE.md` (toujours en contexte, plus simple)
- Règle ciblée sur un type de fichier → `.claude/rules/` avec `paths`

> Sans `paths`, `.claude/rules/` n'apporte rien de plus qu'un `CLAUDE.md` et fragmente inutilement la config.

---

### Configuration > Skills

Les skills enrichissent les connaissances de Claude avec des informations spécifiques à votre projet, votre équipe ou votre domaine.
C'est un concept unifié stocké dans **`.claude/skills/<nom>/SKILL.md`**.

#### Configuration > Skills > 1. Principe

Un skill définit un **contexte ou un workflow** que Claude peut utiliser :

- **Par défaut** — Claude charge le skill automatiquement quand il juge le contenu pertinent (conventions de code, règles métier, format de commit...)
- **Avec `disable-model-invocation: true`** — le skill devient une commande `/skill-name` déclenchée manuellement : utile pour les workflows avec effets de bord (créer une PR, modifier des fichiers, appeler une API...)

---

#### Configuration > Skills > 2. Exemple concret — le skill `code`

Un skill peut orchestrer plusieurs agents spécialisés en séquence — chargé à la demande, il transforme une intention vague en workflow structuré et reproductible.

```markdown
<!-- .claude/skills/code.md -->
---
name: code
description: Implement a feature or fix from a ticket, with full explore/plan/execute/review cycle
disable-model-invocation: true
---
You are a senior full-stack developer implementing a task from a ticket.

1. **Explore** — Read the relevant files, understand the existing architecture and conventions
2. **Fetch ticket** — Retrieve the ticket details (Linear, Jira, etc.) using $ARGUMENTS as the ticket ID
3. **Plan** — Outline the required changes before touching any file; confirm with the user if scope is large
4. **Execute** — Implement the changes following the project conventions (SOLID, DRY, KISS, no unnecessary comments)
5. **Review** — Run the following checks on every modified file:
   - Optimization: remove dead code, simplify logic
   - Security: no injection, no exposed secrets, validate at boundaries
   - Clean code: naming, single responsibility, no magic values
```

---

#### Configuration > Skills > Règle de décision

| Cas | Outil |
|---|---|
| Règle utile à toutes les sessions | `CLAUDE.md` |
| Convention utile seulement parfois | Skill (chargé à la demande) |
| Workflow avec effets de bord à déclencher manuellement | Skill avec `disable-model-invocation: true` |

> Les skills globaux se placent dans `~/.claude/skills/` et sont disponibles dans tous les projets.

---

### Configuration > settings.json

Le fichier `~/.claude/settings.json` (global) ou `.claude/settings.local.json` (projet) permet de configurer le comportement de Claude.

---

#### Configuration > settings.json > Permissions

Contrôle quelles actions Claude peut effectuer :

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

### Configuration > Hiérarchie de priorité

Les fichiers de configuration s'empilent par couches, du plus général au plus spécifique. Chaque couche hérite des couches inférieures — la couche supérieure est plus ciblée et prend le dessus.

```
                   ╔══════════════════════╗
                   ║  /sous-dossier/      ║
                   ║  CLAUDE.md           ║
             ╔═════╩══════════════════════╩═════╗
             ║      .claude/  (projet)          ║
             ║      CLAUDE.md · skills          ║
             ║      rules · agents              ║
             ║      settings.local.json         ║
       ╔═════╩══════════════════════════════════╩═════╗
       ║          ~/.claude/  (global)                ║
       ║          CLAUDE.md · skills · agents         ║
       ║          settings.json                       ║
       ╚══════════════════════════════════════════════╝
```

---

## MCP — Model Context Protocol

**MCP** est un protocole ouvert qui permet à Claude de se connecter à des **sources de données et outils externes**.

Sans MCP, Claude ne peut accéder qu'à ce qui est dans son contexte (fichiers, bash, git).
Avec MCP, il peut interagir avec n'importe quel système tiers : bases de données, APIs, services cloud, outils métier...

> MCP transforme Claude en un agent connecté à ton écosystème entier.

> [Model Context Protocol](https://modelcontextprotocol.io/)

---

### MCP > Comment ça marche ?

Un **serveur MCP** est un petit processus qui expose des **outils** (actions) et/ou des **ressources** (données) à Claude via le protocole MCP.

```
Claude Code
    │
    ├── MCP Server : GitHub     → lire/créer des issues, PRs...
    ├── MCP Server : Postgres   → lire/écrire en base
    ├── MCP Server : Jira       → consulter/créer des tickets
    └── MCP Server : ...        → tout ce que tu veux
```

Claude découvre automatiquement les outils exposés par les serveurs configurés et peut les utiliser dans ses réponses.

> ⚠️ Chaque serveur MCP injecte la description de ses outils dans le contexte au démarrage. Plus tu en configures, plus la fenêtre de contexte est consommée — même si tu n'utilises pas ces outils. À ne pas abuser.

---

### MCP > Configuration

Les serveurs MCP se configurent dans **`.mcp.json`** à la racine du projet (ou `~/.claude/.mcp.json` pour une config globale) :

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```

> `.mcp.json` peut être commité dans le repo — pratique pour partager la config MCP avec toute l'équipe.

---

### MCP > Serveurs disponibles

Il existe déjà un large écosystème de serveurs MCP prêts à l'emploi :

- **Outils dev** : GitHub, GitLab, Jira, Linear, Sentry
- **Bases de données** : PostgreSQL, SQLite, MySQL, MongoDB
- **Cloud** : AWS, Azure, GCP
- **Productivité** : Google Drive, Notion, Slack, Gmail
- **Navigateur** : Puppeteer, Playwright (pour automatiser le browser)

---

### MCP > Alternative : CLI locale

Les MCPs sont chargés au démarrage et consomment de la fenêtre de contexte en permanence — même quand tu n'en as pas besoin.

**Alternative** : transformer une API accessible en CLI bash locale, puis l'appeler depuis un skill invocable.

```
Sans MCP :    API → (non accessible depuis Claude)
Avec MCP :    API → MCP Server → Claude           (contexte consommé en permanence)
Avec CLI :    API → script bash → Skill → Claude  (chargé uniquement à la demande)
```

> Idéal quand tu n'as pas accès à un serveur MCP pour l'outil ciblé, ou quand tu veux éviter de polluer le contexte avec des outils rarement utilisés.

---

### MCP > Alternative : CLI locale > Créer une CLI bash

Un simple script bash qui wrappe un appel `curl` suffit :

```bash
#!/usr/bin/env bash
# ~/.local/bin/my-api

BASE_URL="https://api.example.com"
API_KEY="${MY_API_KEY}"

case "$1" in
  get-user)
    curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/users/$2" | jq .
    ;;
  list-tickets)
    curl -s -H "Authorization: Bearer $API_KEY" "$BASE_URL/tickets" | jq .
    ;;
  *)
    echo "Usage: my-api <get-user|list-tickets> [args]" >&2
    exit 1
    ;;
esac
```

```bash
chmod +x ~/.local/bin/my-api
my-api get-user 42   # accessible depuis n'importe quel terminal
```

---

### MCP > Alternative : CLI locale > Intégration dans un skill

```markdown
<!-- .claude/skills/get-user/SKILL.md -->
---
name: get-user
description: Fetch a user from the internal API
disable-model-invocation: true
---
Retrieve the user details using the local CLI:

1. Run `my-api get-user $ARGUMENTS` via Bash
2. Display the result to the user
```

Invoquer avec `/get-user 42`.

> La description de la CLI n'est **pas injectée dans le contexte** au démarrage — elle n'existe que le temps de l'exécution du skill.

**Règle de décision :**
- Intégration permanente, outils complexes, accès à une base de données → **MCP**
- Usage ponctuel, API simple, éviter la consommation de contexte → **CLI bash + Skill**

---

## Sub-agents

Pour les tâches complexes, Claude peut lancer des **sous-agents** : des instances Claude indépendantes auxquelles il délègue une partie du travail.

Chaque sous-agent dispose de son propre contexte, travaille en parallèle, et renvoie son résultat à l'agent principal.

```
Agent principal
    │
    ├── Sous-agent A : analyse le module auth
    ├── Sous-agent B : analyse le module paiement
    └── Sous-agent C : analyse le module notifications
            │
            └── Agent principal agrège les résultats
```

> Idéal pour les tâches longues ou les analyses à grande échelle qui dépasseraient la fenêtre de contexte d'un seul agent.

---

### Sub-agents > Comment les déclencher ?

Claude décide **de lui-même** de spawner des sous-agents quand la tâche s'y prête. Il suffit de lui donner une instruction de haut niveau :

```
Analyse l'ensemble du codebase et identifie tous les endroits
où les erreurs ne sont pas correctement gérées.
```

Il peut aussi être guidé explicitement :

```
Travaille en parallèle : analyse chaque module séparément
puis synthétise les résultats.
```

---

### Sub-agents > Types disponibles

| Type | Rôle |
|---|---|
| `general-purpose` | Agent polyvalent — recherche, exploration de code, tâches multi-étapes. Accès à tous les outils. |
| `Explore` | Exploration rapide de codebase — recherche par patterns glob, grep, lecture de fichiers. Rapide, sans accès en écriture. |
| `Plan` | Architecte logiciel — conçoit un plan d'implémentation, identifie les fichiers clés, analyse les compromis. Sans accès en écriture. |

> Claude choisit automatiquement le type adapté à la tâche. Il est aussi possible de le spécifier explicitement dans son prompt.

---

### Sub-agents > Créer ses propres agents

Il est possible de définir ses propres types de sous-agents dans **`.claude/agents/<nom>/AGENT.md`** :

```markdown
<!-- .claude/agents/reviewer/AGENT.md -->
---
name: reviewer
description: Reviews code for quality, security, and adherence to team conventions
model: sonnet
color: cyan
---

You are a code reviewer. Analyze the provided files and report:
- Security issues
- Violations of SOLID principles
- Deviations from team conventions defined in CLAUDE.md
```

Le champ `model` définit le modèle utilisé par l'agent. Si omis, il hérite du modèle de la conversation parente.

| Valeur | Usage recommandé |
|---|---|
| `haiku` | Tâches légères, agents workers fréquemment invoqués |
| `sonnet` | Cas général — équilibre capacité / coût |
| `opus` | Décisions complexes nécessitant le maximum de raisonnement |

Claude peut alors déléguer automatiquement les revues de code à cet agent, ou être invoqué explicitement.

La commande `/agent` permet de créer et gérer ses agents sans éditer manuellement les fichiers.

> Les agents globaux se placent dans `~/.claude/agents/` et sont disponibles dans tous les projets.

---

### Sub-agents > Contexte et isolation

Chaque sous-agent :
- A sa propre fenêtre de contexte (indépendante de l'agent principal)
- Peut lire des fichiers, exécuter des commandes, appeler des outils MCP
- Ne partage pas d'état avec les autres sous-agents
- Renvoie uniquement son résultat final à l'agent principal

> Sur les tâches volumineuses, les sous-agents sont souvent **plus économiques** qu'un seul agent : chaque instance travaille sur un contexte réduit et ne renvoie que ses résultats synthétisés à l'agent principal. Le surcoût existe surtout sur les petites tâches.

---

## Status line

La **status line** est la barre affichée en bas du terminal pendant une session Claude Code. 
Elle donne en un coup d'œil les informations clés de la session en cours.

```
claude-sonnet-4-6  ●  auto  |  ↑ 12.4k tokens  |  ~$0.08  |  plan mode
```

- **Modèle actif** — version de Claude utilisée
- **Mode courant** — `auto`, `plan`, `bypass`
- **Tokens consommés** — contexte utilisé depuis le début de la session
- **Coût estimé** — coût cumulé de la session


---

### Status line > Personnalisation

La status line est entièrement personnalisable via `settings.json`. Le principe : tu fournis un script shell qui reçoit les données de la session en JSON via `stdin` et affiche ce que tu veux.

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2
  }
}
```

| Paramètre | Type | Description |
|---|---|---|
| `type` | string | Toujours `"command"` |
| `command` | string | Chemin vers un script ou commande inline |
| `padding` | number | Espacement horizontal (optionnel) |

> Toute la flexibilité vient du script : il reçoit un objet JSON avec les infos de session et affiche exactement ce que tu veux.

Tool qui permet de pimper ça : [ccstatusline](https://github.com/sirmalloc/ccstatusline)

```bash
npx -y ccstatusline@latest
```

---

## Récap — Quel outil pour quel cas ?

| Outil | Cas d'usage | Déclenchement |
|---|---|---|
| `CLAUDE.md` global | Préférences perso, langue, conventions universelles | Toujours actif |
| `CLAUDE.md` projet | Contexte métier, règles permanentes du projet | Toujours actif |
| `.claude/rules/` | Règles d'équipe, conventions (ciblables par glob) | Toujours actif |
| MCP | Connexion à un outil/service externe (GitHub, BDD...) | Toujours actif |
| CLI bash + Skill | Appel ponctuel à une API externe, sans consommer le contexte | Manuel (`/nom`) |
| Skill contextuel | Connaissance chargée quand Claude la juge pertinente | Automatique |
| Skill invocable | Workflow à effets de bord, déclenché explicitement | Manuel (`/nom`) |
| Agent custom | Tâche spécialisée déléguée à une instance dédiée | Automatique |

**Règle simple** :
- Ça doit toujours s'appliquer → `CLAUDE.md`
- Ça cible un type de fichier précis → `.claude/rules/` (avec `globs`)
- C'est une connaissance contextuelle → Skill
- C'est un workflow à déclencher → Skill invocable
- C'est une tâche autonome spécialisée → Agent
- C'est un système externe permanent → MCP
- C'est un appel ponctuel à une API externe → CLI bash + Skill invocable

---
