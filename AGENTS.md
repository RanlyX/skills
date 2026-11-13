# Project & Collaboration Rules

## A. Collaboration and Communication

1. **Languages for Communication**:
   - Primary conversation languages with the user are Traditional Chinese (繁體中文) and English.
   - Match the user's preferred language between Traditional Chinese and English based on the context.

2. **Clarification and Inquiry**:
   - Whenever goals, requirements, technical approaches, or edge cases are ambiguous, actively ask the user questions.
   - Do not make assumptions, speculations, or unilateral decisions without explicit confirmation.

3. **Web Search and Solution Verification**:
   - Search queries and sources are not restricted to any single language (use English, Traditional Chinese, or other languages as needed).
   - Exhaustively search for accurate, up-to-date information and thoroughly verify answers before proposing or executing solutions.

4. **Rule Maintenance Language**:
   - All rule definitions, guideline documents, and configuration instructions must be written in English.

---

## B. Project Participation and Engineering Standards

1. **Coding and Skill Creation Standards**:
   - All code, comments, documentation, and skill definitions must be written strictly in English.
   - Do not use emojis anywhere in the code, comments, documentation, skill definitions, or commit messages.

2. **Git Commit Message Format**:
   - Commit messages must strictly follow Conventional Commits (Husky-style convention) enforced by the project's git hooks (`.githooks/prepare-commit-msg`).
   - Format: `<type>(<scope>): <subject>`
   - Common types:
     - `feat`: A new feature
     - `fix`: A bug fix
     - `docs`: Documentation changes
     - `style`: Formatting changes with no functional logic impact
     - `refactor`: Code restructuring without bug fixes or feature additions
     - `perf`: Performance improvements
     - `test`: Adding or updating tests
     - `build`: Build system or external dependency updates
     - `ci`: Continuous integration configurations and scripts
     - `chore`: Maintenance tasks or repository housekeeping

3. **Project Phases and Issue Tracking**:
   - Use GitHub/GitLab issue labels to track project phases across different locations and devices:
     - `Backlog`: Ideas, backlog items, or unscheduled future tasks.
     - `Open`: Clarified tasks ready for design or implementation.
     - `Design`: Solution architecture and design in progress.
     - `DesignReview`: Design proposal awaiting user review and approval.
     - `Doing`: Active implementation in progress.
     - `Verify`: Verification and testing in progress.
     - `CodeReview`: Implementation completed and awaiting user review.
     - `Close`: Completed, verified, and closed tasks.
   - Ensure the label is updated whenever a task transitions to a new phase.

4. **Review Gates and Merge Approvals**:
   - Formal user confirmation is strictly required at two key checkpoints:
     - `DesignReview`: Design and architectural strategy must be explicitly approved before implementation starts.
     - `CodeReview`: Code changes and verification results must be explicitly approved before merging.
   - Never merge branches or finalize pull requests without explicit user sign-off.

5. **Issue Creation Workflow**:
   - Immediately after clarifying and agreeing on work objectives with the user, create an issue on GitHub/GitLab (e.g., using `gh issue create`) and apply the appropriate initial phase label (`Open` or `Design`).

---

## C. Efficiency and Multi-Agent Orchestration

1. **Skill-First Principle**:
   - Before beginning any task, proactively inspect installed and available skills to determine if an existing skill applies.
   - If a suitable skill is available, invoke and use it as the primary workflow.
   - Only implement ad-hoc or manual workflows if no relevant skill exists.

2. **Multitasking and Parallel Agent Execution**:
   - When handling multiple tasks or parallel workloads, autonomously create a new tmux pane or window.
   - Use `git worktree` to check out isolated branches in separate directories for independent AI agent sessions.
   - Assign distinct, non-overlapping tasks to each parallel agent to execute work concurrently and efficiently.
