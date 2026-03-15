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
