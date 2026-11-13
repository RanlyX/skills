---
name: qa
description: Archives and preserves conversation transcripts, technical decisions, and Q&A logs into structured markdown files under qa/<catalog>/<subject>_<yyyy-mm-dd_HH-MM-SS>.md. Always invoke this skill whenever the user types /qa, requests to archive, snapshot, save, document, or record the current conversation or session, or asks to log technical discussions for future reference.
---

# Conversation Archive & QA Logger (`/qa`)

## Purpose
The `qa` skill provides a standardized mechanism to snapshot and preserve conversation transcripts, architectural deliberations, bug diagnoses, and technical decisions directly into version-controlled markdown records.

---

## Invocation & Triggers
Invoke this skill whenever:
- The user inputs `/qa` or `/qa <catalog> <subject>`
- The user requests to archive, save, record, or snapshot the current conversation
- Important architectural, design, or technical decisions are agreed upon and require durable documentation

---

## Workflow & Step-by-Step Instructions

### Step 1: Identify Catalog and Subject
1. **Catalog (`<catalog>`)**:
   - Determine the broad domain or category of the discussion (e.g., `architecture`, `skills`, `git`, `devops`, `frontend`, `backend`, `testing`).
   - If the user specifies a catalog explicitly in the prompt (e.g., `/qa git commit-rules`), use the requested catalog.
   - If unstated, infer the most suitable single-word or kebab-case catalog from the conversation.
   - Note: Catalogs are flexible and can be restructured or moved later by the user as documentation evolves.
2. **Subject (`<subject>`)**:
   - Summarize the specific topic in a concise, descriptive kebab-case name (e.g., `husky-git-hooks`, `qa-skill-workflow`, `rule-setup`).
   - **Correction & Errata Rule (勘誤)**: When updating, correcting, or appending to an existing topic record, keep the existing `<subject>` name intact and create a new record with the new timestamp: `<subject>_<new_timestamp>.md`. This maintains a chronological audit trail without losing previous versions.

### Step 2: Determine Current Local Timestamp
- Obtain the current local timestamp in format: `YYYY-MM-DD_HH-mm-ss` (e.g., `2026-11-13_14-55-00`).
- Ensure all components are padded with leading zeros (two digits for month, day, hour, minute, second; four digits for year).

### Step 3: Compile Document Content
Construct the archive file adhering to the reference format in [references/template.md](references/template.md):
1. **Frontmatter**:
   - `title`: Human-readable title of the session
   - `catalog`: Selected catalog name
   - `subject`: Subject identifier
   - `timestamp`: ISO 8601 or formatted local time
   - `tags`: Relevant keyword tags
   - `summary`: Concise 2-3 sentence overview of the conversation
2. **Session Overview**:
   - Primary goal, participants, and background context.
3. **Key Decisions & Takeaways**:
   - Bulleted list of architectural choices, trade-offs, and agreed standards.
4. **Detailed Transcript & Q&A Record**:
   - Complete, chronological record of questions, answers, command executions, and code modifications.
   - Preserve technical depth and fidelity without omitting critical technical details.

### Step 4: Write Archive File
- Target file path: `qa/<catalog>/<subject>_<yyyy-mm-dd_HH-MM-SS>.md`
- Ensure parent directories (`qa/<catalog>/`) exist before writing.
- Write the full document content to disk.

### Step 5: Git Awareness & Reporting
- This repository is tracked with Git.
- After creating the file, verify the new file exists.
- Report the created file path to the user with a clickable link.
- Remind the user of the project commit convention (e.g., `docs(qa): archive <subject> session`).

---

## Output Path Specification
```
qa/
└── <catalog>/
    ├── <subject>_<yyyy-mm-dd_HH-MM-SS>.md
    └── <subject>_<new-timestamp>.md  # Revisions / Errata
```

- Path components:
  - `qa`: Root documentation directory.
  - `<catalog>`: Topic domain folder.
  - `<subject>`: Consistent topic name across revisions.
  - `<yyyy-mm-dd_HH-MM-SS>`: Local timestamp of the archive event.
