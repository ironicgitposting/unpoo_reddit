## 🧘 UNPOO REDDIT

A lightweight browser extension for Chrome and Firefox that **masks Reddit posts and comments from users active in specific subreddits**, helping you curate your feed for focus, clarity, and peace of mind.

---

### 🧠 Why?

Reddit is a diverse platform with millions of users and countless communities. While this diversity is a strength, it can sometimes result in exposure to content, drama, or perspectives that are **mentally draining, repetitive, or simply irrelevant** to your interests or values.

This extension exists to help you:

* 🧘‍♂️ Reduce cognitive fatigue from overexposure to certain topics or communities
* 🧼 Maintain a calmer, more focused Reddit browsing experience
* ⚙️ Customize your feed without blocking or reporting other users
* 🕊️ Avoid unproductive discourse and internet arguments

It’s **not about censorship, hate, or exclusion**, but rather about giving yourself the ability to **filter noise** in an open ecosystem.

---

### 🚀 What It Does

* Scans visible Reddit posts and comments
* Identifies the **authors**
* Checks if they’ve been active in any of the **user-defined “blocked” subreddits**
* If so, **masks** their content with a subtle blur and a warning overlay
* Optional: reveal on hover

Example warning:

> “Masked: user active in blocked subreddit”

---

### 🔧 Default Blocklist

The extension includes a default list of subreddits commonly associated with high-volume discourse, political polarization, or regional drama (e.g., `r/Chodi`, `r/sipstea`, `r/IndianSocial`, `r/Bangladesh`, etc.).

You are **free to modify** this list to suit your preferences.

---

### 📦 Installation

See full instructions for [Chrome](#) and [Firefox](#) in the `/docs/` folder or [here](#installation).

---

### 💡 Philosophy

> *“Your attention is your most precious resource. Spend it wisely.”*

This project is about **content hygiene**, not exclusion. Everyone has the right to speak. You have the right **not to listen** if it harms your mental clarity or well-being.

---

### 🙏 Disclaimer

This is a personal-use tool. It makes no judgment about the quality or value of any subreddit or user. It’s designed to help **you** regain control over your experience — nothing more, nothing less.


🧩 For Chrome (Manual Install)

    Prepare your files in a folder named (e.g.) reddit-masker/, including:

reddit-masker/
├── manifest.json
├── content.js
├── style.css
└── icons/icon.png (optional)

Open Chrome and go to:

chrome://extensions/

Enable Developer mode (top right).

Click "Load unpacked" and select the reddit-masker/ folder.

Navigate to Reddit. Your extension should now run on matching URLs like:

    https://www.reddit.com/*

    To debug: right-click the page → Inspect → Console/Elements → check if blur overlays are applied.

🦊 For Firefox (Manual Install)

    Open Firefox and go to:

    about:debugging#/runtime/this-firefox

    Click “Load Temporary Add-on”.

    Select the manifest.json file from your reddit-masker/ folder.

    Navigate to Reddit and test the extension.

    Firefox doesn't persist temporary extensions between restarts. For permanent use, you’ll need to package and sign it via addons.mozilla.org (AMO).