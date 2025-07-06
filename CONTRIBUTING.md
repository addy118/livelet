# Contributing to Livelet

Thank you for considering contributing to Livelet!  
Follow the steps below to set up the project and contribute effectively.

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/addy118/livelet
```

### 2. Create a `.env` file

Copy the `.env.example` file, rename it and fill it with your details:

```bash
cp .env.example .env
```

### 3. Install dependencies

```bash
npm install
```

## 🧑‍💻 For Collaborators

1. Update your local codebase with the remote master branch before making your changes:

  ```bash
  git pull origin master
  ```

2. Make your changes and commit them locally:

  ```bash
  git add <changed_files> && git commit -m "type: commit message"
  ```

3. Before pushing, sync with the master branch:

  ```bash
  git pull --rebase origin master
  ```

4. Check for production errors before pushing:

  ```bash
  npm run prod:lint
  ```

5. After resolving any conflicts and errors, push your changes:

  ```bash
  git push origin master
  ```

## 🙋 For External Contributors

If you're not a collaborator:

1. Fork the repository.

2. Create a new branch.

```bash
git checkout -b <new_branch>
```

3. Commit your changes.

```bash
git add <changed_files> && git commit -m "type: commit message"
```

4. Push to your fork.

```bash
git push origin <your_branch>
```

5. Open a pull request on GitHub with a clear description.

## 📌 General Guidelines

- In case of potential branch merge conflicts, please contact relevant collaborators before merging.
- Always ensure your branch is up-to-date with `master` before pushing.
- Follow project conventions and write clean, commented code.

---

# ✍️ Commit Message Conventions

To maintain consistency throughout the codebase, follow these conventions to write clean and meaningful commit messages.

## ✅ General Rule

- Use **imperative/command tone**, not descriptive or past tense
- Keep messages short and meaningful
- Use lowercase for the prefix and after the prefix unless using a proper noun
- Use a colon and a space after the prefix
- Write in **present tense**, as if completing the sentence:  
  `"This commit will <your message>"`

  For example: `feat: implement dark mode toggle`
  - "This commit will implement dark mode toggle" ✅
  - "This commit will implemented dark mode toggle" ❌ (wrong tense)

## 🔖 Commit Type Prefixes

Use the following prefixes based on the type of change:

| Prefix     | When to Use                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| `feat`     | For any **new feature**, big or small                                         |
| `fix`      | For changes that **fix bugs or issues**                                       |
| `refactor` | For **code optimizations**, **clean-ups**, or **non-functional improvements** |
| `chore`    | For **codebase structure**, file movements, CI configs, README updates, etc.  |

## 🧪 Examples

```bash
feat: implement dark mode toggle
fix: resolve crash on invalid session token
refactor: extract session logic into utility function
chore: restructure components into feature folders
```
