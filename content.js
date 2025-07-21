const blockedSubreddits = [
  // 🇮🇳 Indian Subreddits
  "india",
  "IndianSocial",
  "IndianPoliticalForum",
  "Chodi",
  "IndianLanguage",
  "bangalore",
  "Delhi",
  "mumbai",
  "kolkata",
  "Chennai",
  "Hyderabad",
  "Kerala",
  "Goa",
  "TamilNadu",
  "WestBengal",
  "pune",
  "assam",
  "JEENEETards",
  "CBSE",
  "GATE",
  "UPSC",
  "IndianAcademia",
  "IndianGaming",
  "IndianStartups",
  "IndianProgrammers",
  "IndianTeenagers",
  "indiameme",
  "indianmemer",
  "desimemes",
  "DesiMeta",
  "DesiDankMemes",
  "DesiCelebs",
  "ArrangedMarriage",
  "ABCDesis",
  "DesiWives",
  "DesiSex",

  // 🇧🇩 Bangladeshi Subreddits
  "Bangladesh",
  "Chittagong",
  "Dhaka",
  "BangladeshiPolitics",
  "BanglaTalk",
  "Bengali",
  "BanglaCringe",

  // 🌍 Diaspora & South Asian Subreddits
  "SouthAsianMasculinity",
  "Sarees",
  "SouthAsia",
  "sipstea"
];

// Track users who have interacted with blocked subreddits
const blockedUsers = new Set();

// Debug logging
console.log("🧘 Unpoo Reddit: Extension loaded", { blockedSubreddits: blockedSubreddits.length });

function maskElement(el, reason = "post from blocked subreddit") {
  if (el.classList.contains("masked-content")) return; // Prevent double-masking
  
  console.log("🧘 Masking element:", reason, el);
  
  el.classList.add("masked-content");
  const overlay = document.createElement("div");
  overlay.className = "masked-overlay";
  overlay.innerText = `Masked: ${reason}`;
  overlay.style.position = "absolute";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.color = "#fff";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.fontSize = "1.2em";
  overlay.style.zIndex = 10000;
  overlay.style.pointerEvents = "none";
  overlay.style.textAlign = "center";
  overlay.style.padding = "20px";
  overlay.style.borderRadius = "8px";
  el.style.position = "relative";
  el.appendChild(overlay);
}

function getSubredditFromPost(post) {
  // Modern Reddit selectors
  const selectors = [
    "a[data-testid='subreddit-link']",
    "a[href*='/r/']",
    "[data-click-id='subreddit'] a",
    ".s1okvo8w a", // New Reddit class
    "a[href^='/r/']",
    "[data-testid='subreddit-link']"
  ];

  for (let selector of selectors) {
    let link = post.querySelector(selector);
    if (link) {
      let text = link.textContent || link.href;
      if (text.includes('/r/')) {
        const match = text.match(/\/r\/([^\/\?\s]+)/);
        if (match) {
          console.log("🧘 Found subreddit:", match[1], "via selector:", selector);
          return match[1].toLowerCase();
        }
      }
      if (text.match(/^r\/(.+)$/i)) {
        const subreddit = text.replace(/^r\//, "").toLowerCase();
        console.log("🧘 Found subreddit:", subreddit, "via text match");
        return subreddit;
      }
    }
  }

  // Check URL if we're on a subreddit page
  const url = window.location.href;
  const urlMatch = url.match(/reddit\.com\/r\/([^\/\?]+)/);
  if (urlMatch) {
    console.log("🧘 Found subreddit from URL:", urlMatch[1]);
    return urlMatch[1].toLowerCase();
  }

  console.log("🧘 No subreddit found for post:", post);
  return null;
}

function getUsernameFromPost(post) {
  // Modern Reddit username selectors
  const selectors = [
    "a[data-testid='post_author_link']",
    "a[href*='/user/']",
    "a[href*='/u/']",
    "[data-testid='post-author'] a",
    "[data-click-id='user'] a",
    ".s1461iz-1 a", // New Reddit author class
    "span:contains('u/')"
  ];

  for (let selector of selectors) {
    let userLink = post.querySelector(selector);
    if (userLink) {
      let text = userLink.textContent || userLink.href;
      
      // Extract from href like /user/username or /u/username  
      if (userLink.href) {
        const hrefMatch = userLink.href.match(/\/(?:user|u)\/([^\/\?\s]+)/);
        if (hrefMatch) {
          console.log("🧘 Found username from href:", hrefMatch[1], "via selector:", selector);
          return hrefMatch[1].toLowerCase();
        }
      }
      
      // Extract from text like u/username
      const textMatch = text.match(/u\/([a-zA-Z0-9_-]+)/);
      if (textMatch) {
        console.log("🧘 Found username from text:", textMatch[1], "via selector:", selector);
        return textMatch[1].toLowerCase();
      }
    }
  }

  console.log("🧘 No username found for post:", post);
  return null;
}

function getUsernameFromComment(comment) {
  // Modern Reddit comment author selectors
  const selectors = [
    "a[data-testid='comment_author_link']",
    "a[href*='/user/']",
    "a[href*='/u/']",
    "[data-testid='comment-author'] a",
    ".Comment__username a"
  ];

  for (let selector of selectors) {
    let userLink = comment.querySelector(selector);
    if (userLink) {
      let text = userLink.textContent || userLink.href;
      
      if (userLink.href) {
        const hrefMatch = userLink.href.match(/\/(?:user|u)\/([^\/\?\s]+)/);
        if (hrefMatch) {
          return hrefMatch[1].toLowerCase();
        }
      }
      
      const textMatch = text.match(/u\/([a-zA-Z0-9_-]+)/);
      if (textMatch) {
        return textMatch[1].toLowerCase();
      }
    }
  }

  return null;
}

function trackUsersFromBlockedSubreddits() {
  // Track users from posts in blocked subreddits
  const postSelectors = [
    "div[data-testid='post-container']",
    "[data-click-id='background']",
    ".Post",
    "article",
    "[id^='t3_']"
  ];

  let postsFound = 0;
  for (let selector of postSelectors) {
    document.querySelectorAll(selector).forEach(post => {
      postsFound++;
      const subreddit = getSubredditFromPost(post);
      if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
        const username = getUsernameFromPost(post);
        if (username) {
          console.log("🧘 Tracking user from blocked subreddit:", username, "from r/" + subreddit);
          blockedUsers.add(username);
        }
      }
    });
  }
  
  console.log("🧘 Checked", postsFound, "posts. Blocked users:", blockedUsers.size);

  // Track users from comments in blocked subreddits
  const commentSelectors = [
    "[data-testid='comment']",
    ".Comment",
    "[id^='t1_']"
  ];

  for (let selector of commentSelectors) {
    document.querySelectorAll(selector).forEach(comment => {
      const postContainer = comment.closest("div[data-testid='post-container']") || document;
      const subreddit = getSubredditFromPost(postContainer);
      
      if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
        const username = getUsernameFromComment(comment);
        if (username) {
          console.log("🧘 Tracking commenter from blocked subreddit:", username, "from r/" + subreddit);
          blockedUsers.add(username);
        }
      }
    });
  }
}

function hideBlockedContent() {
  console.log("🧘 Running hideBlockedContent...");
  
  // First, track users who interact with blocked subreddits
  trackUsersFromBlockedSubreddits();

  // Hide posts from blocked subreddits and blocked users
  const postSelectors = [
    "div[data-testid='post-container']",
    "[data-click-id='background']",
    ".Post",
    "article",
    "[id^='t3_']"
  ];

  let maskedCount = 0;
  for (let selector of postSelectors) {
    document.querySelectorAll(selector).forEach(post => {
      if (post.classList.contains("masked-content")) return;
      
      const subreddit = getSubredditFromPost(post);
      const username = getUsernameFromPost(post);
      
      console.log("🧘 Checking post - subreddit:", subreddit, "username:", username);
      
      // Block if subreddit is blocked
      if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
        maskElement(post, "post from blocked subreddit r/" + subreddit);
        maskedCount++;
        return;
      }
      
      // Block if user has interacted with blocked subreddits
      if (username && blockedUsers.has(username)) {
        maskElement(post, "post from user who interacts with blocked subreddits");
        maskedCount++;
        return;
      }
    });
  }

  // Hide comments from blocked users
  const commentSelectors = [
    "[data-testid='comment']",
    ".Comment",
    "[id^='t1_']"
  ];

  for (let selector of commentSelectors) {
    document.querySelectorAll(selector).forEach(comment => {
      if (comment.classList.contains("masked-content")) return;
      
      const username = getUsernameFromComment(comment);
      if (username && blockedUsers.has(username)) {
        maskElement(comment, "comment from user who interacts with blocked subreddits");
        maskedCount++;
      }
    });
  }

  console.log("🧘 Masked", maskedCount, "items this run");

  // Handle single post page (no post-container)
  if (document.querySelectorAll("div[data-testid='post-container']").length === 0) {
    const main = document.querySelector("main");
    if (main && !main.classList.contains("masked-content")) {
      const subreddit = getSubredditFromPost(document);
      const username = getUsernameFromPost(document);
      
      if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
        maskElement(main, "post from blocked subreddit r/" + subreddit);
      } else if (username && blockedUsers.has(username)) {
        maskElement(main, "post from user who interacts with blocked subreddits");
      }
    }
  }
}

// Run the blocking function every 2 seconds (less aggressive)
setInterval(hideBlockedContent, 2000);

// Run once immediately
hideBlockedContent();

// Also run when page changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log("🧘 Page changed, re-running...");
    setTimeout(hideBlockedContent, 1000);
  }
}).observe(document, { subtree: true, childList: true });