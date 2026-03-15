# Claude Code
## L'IA dans ton terminal

*Présentation par [Ton Prénom]*

---

## Sommaire

1. Qu'est-ce que Claude Code ?
2. Installation & configuration
3. Modes d'utilisation
4. Capacités clés
5. CLAUDE.md — donner du contexte
6. Agents & sous-agents
7. MCP Servers
8. Hooks
9. Mémoire persistante
10. Skills & commandes slash
11. Bonnes pratiques
12. Démo live

---

## Qu'est-ce que Claude Code ?

**Claude Code** est un agent IA de terminal développé par Anthropic.

- Fonctionne directement dans le terminal (CLI)
- Accès natif au système de fichiers, git, bash
- Comprend le contexte de ton projet entier
- Prend des décisions et agit de manière autonome

> Pas un simple copilote — un **agent** qui peut réaliser des tâches complexes de bout en bout.

---

## Installation

```bash
# Prérequis : Node.js 18+
npm install -g @anthropic-ai/claude-code

# Lancer dans un projet
cd mon-projet
claude
```

### Configuration initiale

```bash
# Authentification (une seule fois)
claude auth

# Initialiser le projet (génère CLAUDE.md)
claude /init
```

---

## Modes d'utilisation

### Mode interactif (REPL)
```bash
claude
```
Conversation continue, Claude garde le contexte de session.

### Mode one-shot
```bash
claude "explique la fonction getUserById dans src/users.ts"
claude "crée des tests unitaires pour le service AuthService"
```

### Mode pipe
```bash
cat error.log | claude "que se passe-t-il ?"
git diff | claude "rédige un message de commit"
```

---

## Capacités clés — Fichiers

Claude peut **lire, créer, modifier et supprimer** des fichiers.

```
> Refactorise la classe UserRepository pour utiliser
  le pattern Repository proprement
```

Il va :
1. Lire les fichiers concernés
2. Comprendre l'architecture existante
3. Proposer et appliquer les modifications
4. Vérifier la cohérence avec le reste du code

---

## Capacités clés — Terminal & Git

Claude exécute des commandes bash et interagit avec git.

```
> Lance les tests, corrige les erreurs, puis fais un commit
```

Il va :
1. `npm test` → lire les erreurs
2. Corriger le code
3. Relancer les tests pour valider
4. `git add` + `git commit` avec un message pertinent

---

## Capacités clés — Recherche web

Claude peut chercher sur le web pour des informations à jour.

```
> Quelle est la dernière version de .NET et ses nouveautés ?
> Comment migrer de EF Core 8 à EF Core 9 ?
```

Utile pour :
- Documentation de librairies
- Changelog et migrations
- Résolution de bugs avec des solutions récentes

---

## CLAUDE.md — Donner du contexte

Un fichier `CLAUDE.md` à la racine du projet est **toujours chargé** dans le contexte.

```markdown
# Mon Projet API

## Stack
- .NET 9 / ASP.NET Core
- Entity Framework Core (PostgreSQL)
- xUnit pour les tests

## Conventions
- Nommage : PascalCase pour les classes, camelCase pour les variables
- Tests : un fichier de test par classe, suffixe `Tests`
- Ne jamais committer sur main directement

## Commandes utiles
- `dotnet test` — lancer les tests
- `dotnet ef migrations add` — créer une migration
```

---

## Agents & sous-agents

Claude peut **déléguer** des tâches à des sous-agents spécialisés.

```
> Analyse l'ensemble du codebase, identifie les
  problèmes de performance, et génère un rapport
```

Claude orchestre :
- Un agent pour explorer le code
- Un agent pour analyser chaque module
- Un agent pour rédiger le rapport

Chaque agent travaille en **parallèle** dans son propre contexte isolé.

---

## MCP Servers

**Model Context Protocol** — brancher des outils externes à Claude.

```json
// .claude/settings.json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"]
    }
  }
}
```

Claude peut alors interroger la DB, créer des issues GitHub, etc.

---

## Hooks

Les hooks permettent d'exécuter des scripts **automatiquement** lors d'événements.

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "dotnet build --no-restore"
      }]
    }]
  }
}
```

Événements disponibles :
- `PreToolUse` / `PostToolUse`
- `Stop` (fin de réponse)
- `UserPromptSubmit`

---

## Mémoire persistante

Claude peut **mémoriser** des informations entre les sessions.

```
> Souviens-toi que je préfère les interfaces explicites
  plutôt que les classes abstraites dans ce projet
```

Types de mémoire :
- **user** — préférences et profil
- **project** — contexte et décisions du projet
- **feedback** — corrections apportées à Claude
- **reference** — pointeurs vers des ressources externes

Les mémoires sont stockées dans `~/.claude/projects/[projet]/memory/`.

---

## Skills & commandes slash

Les skills sont des **comportements personnalisables** invocables via `/`.

```bash
/commit          # Génère et crée un commit git
/review-pr 42    # Revue de code d'une PR GitHub
/init            # Initialise CLAUDE.md pour le projet
```

Tu peux créer tes propres skills dans `~/.claude/commands/`.

```markdown
<!-- ~/.claude/commands/deploy.md -->
Vérifie que les tests passent, puis déploie sur staging
avec `npm run deploy:staging`. Notifie-moi du résultat.
```

---

## Bonnes pratiques

**Donne du contexte**
→ Un `CLAUDE.md` bien rempli = moins d'allers-retours

**Décompose les tâches complexes**
→ "Fais X, puis Y, puis Z" fonctionne bien

**Vérifie avant de confirmer**
→ Claude demande confirmation pour les actions destructives

**Utilise le mode watch**
→ Laisse Claude travailler en autonomie sur des tâches longues

**Itère**
→ "Non, fais plutôt comme ça..." — Claude apprend dans la session

---

## Démo live

### Ce qu'on va faire

1. Initialiser Claude sur un projet existant
2. Lui demander d'analyser le code
3. Lui faire corriger un bug
4. Générer des tests
5. Créer un commit

```bash
cd demo-project
claude
```

> *Place à la démo !*

---

## Merci !

### Ressources

- Documentation officielle : `claude.ai/docs`
- GitHub : `github.com/anthropics/claude-code`
- MCP Servers disponibles : `github.com/modelcontextprotocol/servers`

### Questions ?
