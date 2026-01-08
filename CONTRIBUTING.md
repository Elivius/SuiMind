# Project Structure & Git Workflow Guide

This guide outlines the recommended structure for the **SuiMind** project and the standard Git workflow for collaboration.

## 1. Recommended Project Structure

For a project involving a Frontend, Smart Contracts, and an AI ADK, it is best practice to separate concerns into distinct directories at the root level.

```text
SuiMind/
├── frontend/       <# Your Next.js UI (currently 'my-app') #>
├── contracts/      <# Sui Move Smart Contracts (Move.toml, sources/) #>
├── ai-sdk/         <# AI Agent logic / SDK (Python or Node.js) #>
└── README.md       <# Main documentation #>
```

**Benefits:**
*   **No Conflicts:** Dependencies (like `package.json`) don't clash.
*   **Clear Deployment:** You can deploy just the `frontend` folder to Vercel easily.
*   **Isolation:** AI developers don't need to worry about the frontend build process.

---

## 2. Git Branching Strategy

**Rule:** Never work directly on `main`. Always create a new branch for every task.

### Naming Conventions
Prefix your branches to indicate the type of work:
*   `feature/ai-sdk-setup` (New features)
*   `fix/wallet-connection` (Bug fixes)
*   `chore/cleanup` (Maintenance/Configs)
*   `docs/updated-readme` (Documentation only)
*   `refactor/simplify-logic` (Code restructuring without behavior change)
*   `style/format-code` (Code formatting)

### How to Start a New Task
When you start a new task (e.g., building the AI Agent), run:

```bash
# 1. Make sure your local main is up to date
git checkout main
git pull

# 2. Create your new branch
git checkout -b feature/ai-sdk-initial-setup
```

---

## 3. Collaboration Workflow

### While Others are Working
*   **Do Nothing.** You do not need to pull or track their feature branches (`feature/login`, `feature/contracts`) while they are still working on them.
*   Focus entirely on your own branch (`feature/ai-sdk`).

### When Others Finish (They Merge to Main)
Once a teammate's code is merged into `main`, you must "sync" your branch to get their changes.

**Steps to Sync:**

```bash
# 1. Switch to main and download the latest changes
git checkout main
git pull origin main

# 2. Go back to your branch
git checkout feature/ai-sdk

# 3. Merge main into your branch
git merge main
```

**Why?** This ensures your AI code works correctly with the latest Frontend or Contract code they just added.

### When You Finish
1.  Push your branch: `git push -u origin feature/ai-sdk`
2.  Open a **Pull Request (PR)** on GitHub.
3.  Once approved, merge into `main`.