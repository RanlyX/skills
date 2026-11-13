# QA Conversation Archiving Skill

A standardized skill for AI agents to archive, snapshot, and preserve full conversation transcripts, technical decisions, and Q&A records directly into Git-tracked Markdown files.

## Installation

Install using `npx skills add`:

```bash
# Install directly from the repository
npx skills add RanlyX/skills --skill qa

# Or install all skills in the repository
npx skills add RanlyX/skills
```

## Usage

Trigger the skill in your AI assistant session by typing:

```text
/qa
```

Or provide explicit catalog and subject parameters:

```text
/qa <catalog> <subject>
```

Example:
```text
/qa architecture rules-engine
```

## File Output Convention

Archive files are written to:

```text
qa/<catalog>/<subject>_<yyyy-mm-dd_HH-MM-SS>.md
```

- `<catalog>`: Topic domain (e.g., `git`, `architecture`, `debugging`). Catalogs can be reorganized at any time.
- `<subject>`: Consistent topic title.
- `<yyyy-mm-dd_HH-MM-SS>`: Local timestamp of the archive event.
- **Revisions / Errata**: To update or correct an existing record, the skill maintains the same `<subject>` with a new timestamp: `<subject>_<new_timestamp>.md`.
