# Deploying SecureView PDF to GitHub Pages

This guide outlines exactly how to deploy this "SecureView" application to GitHub Pages for free.

## 1. Prepare Your Codebase

1.  **Ensure `base: './'` is in `vite.config.ts`.** (We have already done this for you).
2.  **Initialize Git** (if you haven't already):
    Open your terminal in the project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

## 2. Set Up the Repository on GitHub

1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name the repository: `secure-pdf-viewer` (or whatever you prefer).
4.  **Important**: Keep it **Public** (required for free GitHub Pages, unless you have Pro) or Private if you have Pro.
5.  Click **Create repository**.
6.  Copy the commands under the section **"…or push an existing repository from the command line"**. They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/secure-pdf-viewer.git
    git branch -M main
    git push -u origin main
    ```
7.  Run those exact commands in your terminal.

## 3. Configure Deployment Automation (The Easy Way)

We will use a standard tool called `gh-pages` to handle the deployment for you. This avoids manual file dragging.

### Step 3.1: Install the deployment tool
In your terminal, run:
```bash
npm install gh-pages --save-dev
```

### Step 3.2: Update package.json
Open your `package.json` file and add these two items:

1.  At the very top, add a "homepage" property:
    ```json
    "homepage": "https://YOUR_USERNAME.github.io/secure-pdf-viewer",
    ```
    *(Replace `YOUR_USERNAME` and `secure-pdf-viewer` with your actual GitHub username and repo name).*

2.  In the `"scripts"` section, add these two lines:
    ```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
    ```

### Step 3.3: Deploy!
Run this command in your terminal:
```bash
npm run deploy
```

This command will:
1.  Build your project (create the production-ready `dist` folder).
2.  Upload just that folder to a special `gh-pages` branch on GitHub.

## 4. Activate GitHub Pages

1.  Go to your repository on GitHub.
2.  Click **Settings** (tab at the top).
3.  On the left sidebar, click **Pages** (under the "Code and automation" section).
4.  Under **Build and deployment** / **Source**, select **Deploy from a branch**.
5.  Under **Branch**, confirm it says **gh-pages** / /(root). (It usually auto-selects this after you run `npm run deploy`).
6.  Click **Save** if needed.

## 5. Verify It Works

Wait about 1-2 minutes. Top of the Pages settings screen will show a bar saying "Your site is live at...". Click that link.

**You are done!**

---

## 6. How to Use the App for Clients

Once the site is live:

1.  **Host your PDF**:
    *   **Option A (Dropbox)**: Upload PDF -> Share -> Copy Link. *Change `dl=0` to `dl=1` or `raw=1` at the end of the link.*
    *   **Option B (GitHub)**: Upload PDF to a repo -> Click file -> "Raw".
    *   **Option C (Google Drive)**: *Harder*. Requires changing the link to a direct export format `https://drive.google.com/uc?export=view&id=FILE_ID`.
    
2.  **Generate Secure Link**:
    *   Go to your new SecureView website.
    *   Paste the direct PDF link.
    *   Click "Generate Secure Link".
    *   Send **that** link to your students.

3.  **Client Experience**:
    *   They click the SecureView link.
    *   They see the PDF securely.
    *   They cannot download or print it.
    *   Access expires in 1 hour.
