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
