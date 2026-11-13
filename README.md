# Skills

A collection of reusable AI agent skills compatible with the Agent Skills specification and installable via `npx skills add`.

## Available Skills

| Skill | Description | Usage |
| :--- | :--- | :--- |
| [`qa`](./skills/qa) | Archive and snapshot conversation transcripts, design decisions, and Q&A logs into Git-tracked Markdown files | `/qa` |

## Installation

Install skills into your workspace or global agent environment using `npx skills`:

```bash
# Install a specific skill
npx skills add RanlyX/skills --skill qa

# Install all skills in this repository
npx skills add RanlyX/skills
```

## Directory Structure

```text
skills/
└── qa/
    ├── SKILL.md
    ├── README.md
    └── references/
        └── template.md
```
