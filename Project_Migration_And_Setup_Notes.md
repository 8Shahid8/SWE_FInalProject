# Project Migration and Setup Notes

This document summarizes the steps taken to migrate the `safehands` project to a new GitHub account ("8Shahid8"), rewrite the commit history, and deploy the application to GitHub Pages.

---

## Objective

The primary goal was to move the project to a new repository under a new user (`8Shahid8`) and ensure that all commit history, both past and future, is attributed to this new user. A secondary goal was to deploy the live application using GitHub Pages.

---

## Part 1: New GitHub User SSH Configuration

To interact with GitHub as the new user, we configured a dedicated SSH key and SSH host alias.

### 1.1: SSH Key Generation

A new, unique SSH key pair was generated for the "8Shahid8" account to keep its authentication separate from your other accounts.

*   **Command Used:**
    ```bash
    ssh-keygen -t ed25519 -C "shahid35-377@diu.edu.bd" -f "C:\Users\Ashraf Mahmud\.ssh\id_ed25519_shahid"
    ```
*   **Outcome:** This created a new private key (`id_ed25519_shahid`) and public key (`id_ed25519_shahid.pub`) in your `.ssh` directory.

### 1.2: Adding SSH Key to GitHub

This was a manual step you performed:
1.  The content of the public key (`id_ed25519_shahid.pub`) was copied.
2.  You logged into the "8Shahid8" GitHub account.
3.  You navigated to **Settings > SSH and GPG keys** and added the copied public key.

### 1.3: SSH Config File Update

To allow your system to use the correct SSH key for the new user, we configured an SSH host alias.

*   **Action:** You manually added the following block to your `.ssh/config` file:
    ```
    # Config for 8Shahid8 project account
    Host github.com-shahid
      HostName github.com
      User git
      IdentityFile "C:\Users\Ashraf Mahmud\.ssh\id_ed25519_shahid"
      IdentitiesOnly yes
    ```
*   **Purpose:** This tells SSH that whenever it sees a URL with `github.com-shahid`, it should use the `id_ed25519_shahid` key for authentication.

### 1.4: Verifying the SSH Connection

We tested the SSH setup to confirm it was working correctly.

*   **Command Used:**
    ```bash
    ssh -T git@github.com-shahid
    ```
*   **Outcome:** The successful response (`Hi 8Shahid8! You've successfully authenticated...`) confirmed that the SSH configuration was correct.

---

## Part 2: Project Migration and History Rewrite

With the SSH configuration in place, we moved the project to the new repository and updated its history.

### 2.1: Setting Local Git Identity

To ensure all *future* commits are authored by the new user, we set the local Git identity for this specific project.

*   **Commands Used:**
    ```bash
    git config --local user.name "8Shahid8"
    git config --local user.email "shahid35-377@diu.edu.bd"
    ```

### 2.2: Rewriting Commit History

To change the author of all *past* commits, we used the `git filter-branch` command.

*   **Reason:** This was necessary to remove your old author information from the project's history, as requested for the assignment.
*   **Command Used:**
    ```bash
    git filter-branch --env-filter '
    OLD_EMAIL="ashrafrs.talk@gmail.com"
    CORRECT_NAME="8Shahid8"
    CORRECT_EMAIL="shahid35-377@diu.edu.bd"

    if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
    then
        export GIT_COMMITTER_NAME="$CORRECT_NAME"
        export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    fi
    if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
    then
        export GIT_AUTHOR_NAME="$CORRECT_NAME"
        export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
    fi
    ' --tag-name-filter cat -- --all
    ```
*   **Safety:** While risky for collaborative projects, this was safe in your case because we were about to push to a brand new, empty repository.

### 2.3: Pushing to the New Repository

We updated the project's remote URL to point to your new repository and pushed the rewritten history.

*   **Commands Used:**
    ```bash
    # Set the remote URL to use the new SSH alias
    git remote set-url origin git@github.com-shahid:8Shahid8/SWE_FInalProject.git

    # Force push the rewritten history to the new repository's main branch
    git push --force origin main
    ```

---

## Part 3: GitHub Pages Deployment

Finally, we deployed the project as a live website.

### 3.1: Vite Configuration

We configured Vite to build the project with the correct asset paths for GitHub Pages.

*   **File:** `safehands/vite.config.js`
*   **Change:** Added the `base` property.
    ```javascript
    export default defineConfig({
      // ... other config
      base: '/SWE_FInalProject/',
    })
    ```

### 3.2: `package.json` Updates

We added scripts to `package.json` to make deployment easier.

*   **File:** `safehands/package.json`
*   **Changes:**
    *   Added a `homepage` URL.
    *   Added `predeploy` and `deploy` scripts.
    ```json
    {
      "homepage": "https://8shahid8.github.io/SWE_FInalProject",
      "scripts": {
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      }
    }
    ```

### 3.3: Deployment Command

We used the new `deploy` script to build the project and push it to the `gh-pages` branch of the new repository.

*   **Command Used:**
    ```bash
    npm run deploy
    ```

### 3.4: GitHub Pages Settings

This was the final manual step you performed:
1.  You navigated to your new repository's **Settings > Pages**.
2.  You set the **Source** to "Deploy from a branch".
3.  You selected the **`gh-pages`** branch with the `/ (root)` folder.

### 3.5: Final Live URL

The project is now live at: **https://8shahid8.github.io/SWE_FInalProject/**
