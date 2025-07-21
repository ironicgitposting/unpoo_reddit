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

function maskElement(el, reason = "post from blocked subreddit") {
  if (el.classList.contains("masked-content")) return; // Prevent double-masking
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
  overlay.style.zIndex = 10;
  overlay.style.pointerEvents = "none";
  overlay.style.textAlign = "center";
  overlay.style.padding = "20px";
  el.style.position = "relative";
  el.appendChild(overlay);
}

function getSubredditFromPost(post) {
  // Try the feed/listing selector first
  let link = post.querySelector("a[data-testid='subreddit-link']");
  if (link) return link.textContent.replace(/^r\//, "").toLowerCase();

  // Fallback: look for any a[href^='/r/']
  link = post.querySelector("a[href^='/r/']");
  if (link) {
    // Extract subreddit from href, e.g. /r/india/
    const match = link.getAttribute("href").match(/^\/r\/([^\/]+)/);
    if (match) return match[1].toLowerCase();
  }

  // Fallback: look for span or strong with text r/{subreddit}
  const regex = /^r\/(.+)$/i;
  let el = Array.from(post.querySelectorAll("span, strong")).find(
    n => regex.test(n.textContent)
  );
  if (el) return el.textContent.replace(/^r\//, "").toLowerCase();

  return null;
}

function getUsernameFromPost(post) {
  // Try different selectors for username
  let userLink = post.querySelector("a[data-testid='post_author_link']");
  if (userLink) return userLink.textContent.replace(/^u\//, "").toLowerCase();

  // Alternative selector for author link
  userLink = post.querySelector("a[href^='/user/']");
  if (userLink) {
    const match = userLink.getAttribute("href").match(/^\/user\/([^\/]+)/);
    if (match) return match[1].toLowerCase();
  }

  // Look for author in various text patterns
  const authorElement = post.querySelector("[data-testid='post-author']");
  if (authorElement) return authorElement.textContent.replace(/^u\//, "").toLowerCase();

  // Fallback: look for any username pattern
  const usernameRegex = /u\/([a-zA-Z0-9_-]+)/;
  const textElements = post.querySelectorAll("span, strong, a");
  for (let el of textElements) {
    const match = el.textContent.match(usernameRegex);
    if (match) return match[1].toLowerCase();
  }

  return null;
}

function getUsernameFromComment(comment) {
  // Try comment author selector
  let userLink = comment.querySelector("a[data-testid='comment_author_link']");
  if (userLink) return userLink.textContent.replace(/^u\//, "").toLowerCase();

  // Alternative selector
  userLink = comment.querySelector("a[href^='/user/']");
  if (userLink) {
    const match = userLink.getAttribute("href").match(/^\/user\/([^\/]+)/);
    if (match) return match[1].toLowerCase();
  }

  // Look for comment author element
  const authorElement = comment.querySelector("[data-testid='comment-author']");
  if (authorElement) return authorElement.textContent.replace(/^u\//, "").toLowerCase();

  // Fallback: look for username pattern in comment
  const usernameRegex = /u\/([a-zA-Z0-9_-]+)/;
  const textElements = comment.querySelectorAll("span, strong, a");
  for (let el of textElements) {
    const match = el.textContent.match(usernameRegex);
    if (match) return match[1].toLowerCase();
  }

  return null;
}

function trackUsersFromBlockedSubreddits() {
  // Track users from posts in blocked subreddits
  document.querySelectorAll("div[data-testid='post-container']").forEach(post => {
    const subreddit = getSubredditFromPost(post);
    if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
      const username = getUsernameFromPost(post);
      if (username) {
        blockedUsers.add(username);
      }
    }
  });

  // Track users from comments in blocked subreddits
  document.querySelectorAll("[data-testid='comment']").forEach(comment => {
    // Check if this comment is on a post from a blocked subreddit
    const postContainer = comment.closest("div[data-testid='post-container']") || document;
    const subreddit = getSubredditFromPost(postContainer);
    
    if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
      const username = getUsernameFromComment(comment);
      if (username) {
        blockedUsers.add(username);
      }
    }
  });
}

function hideBlockedContent() {
  // First, track users who interact with blocked subreddits
  trackUsersFromBlockedSubreddits();

  // Hide posts from blocked subreddits
  document.querySelectorAll("div[data-testid='post-container']").forEach(post => {
    if (post.classList.contains("masked-content")) return;
    
    const subreddit = getSubredditFromPost(post);
    const username = getUsernameFromPost(post);
    
    // Block if subreddit is blocked
    if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
      maskElement(post, "post from blocked subreddit");
      return;
    }
    
    // Block if user has interacted with blocked subreddits
    if (username && blockedUsers.has(username)) {
      maskElement(post, "post from user who interacts with blocked subreddits");
      return;
    }
  });

  // Hide comments from blocked users
  document.querySelectorAll("[data-testid='comment']").forEach(comment => {
    if (comment.classList.contains("masked-content")) return;
    
    const username = getUsernameFromComment(comment);
    if (username && blockedUsers.has(username)) {
      maskElement(comment, "comment from user who interacts with blocked subreddits");
    }
  });

  // Handle single post page (no post-container)
  if (document.querySelectorAll("div[data-testid='post-container']").length === 0) {
    const main = document.querySelector("main");
    if (main && !main.classList.contains("masked-content")) {
      const subreddit = getSubredditFromPost(document);
      const username = getUsernameFromPost(document);
      
      if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
        maskElement(main, "post from blocked subreddit");
      } else if (username && blockedUsers.has(username)) {
        maskElement(main, "post from user who interacts with blocked subreddits");
      }
    }
  }
}

// Run the blocking function every second
setInterval(hideBlockedContent, 1000);

// Also run once immediately
hideBlockedContent();