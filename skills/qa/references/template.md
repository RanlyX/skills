# QA Document Template

Use the following layout when generating QA conversation archive documents:

```markdown
---
title: "[Human-Readable Title of the Topic]"
catalog: [catalog-name]
subject: [subject-name]
timestamp: "[YYYY-MM-DD_HH-mm-ss]"
created_at: "[ISO 8601 Timestamp]"
tags:
  - [tag-1]
  - [tag-2]
summary: "[Concise 2-3 sentence summary of the session goals, discussion, and outcomes]"
---

# [Session Title]

## 1. Overview and Context
- **Catalog**: [catalog-name]
- **Subject**: [subject-name]
- **Recorded At**: [YYYY-MM-DD HH:mm:ss]
- **Objective**: [Brief description of what prompted this discussion]

---

## 2. Key Decisions and Takeaways
- **Decision 1**: [Description and rationale]
- **Decision 2**: [Description and rationale]
- **Action Items**:
  - [ ] [Next step or pending follow-up]

---

## 3. Chronological Transcript & Q&A Record

### Q1: [User Query / Topic 1]
**User:**
> [Verbatim or high-fidelity user inquiry]

**Resolution / Response:**
[Detailed explanation, technical solution, code snippets, and rationale]

**Actions & Commands Executed:**
```bash
[Command run]
```

---

### Q2: [User Query / Topic 2]
**User:**
> [Next user inquiry or follow-up]

**Resolution / Response:**
[Detailed explanation or implementation details]

---

## 4. References & Artifacts
- [Relevant file or link 1](file:///path/to/file)
- [Relevant issue or PR](https://github.com/...)
```
