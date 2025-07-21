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

function maskElement(el) {
  if (el.classList.contains("masked-content")) return; // Prevent double-masking
  el.classList.add("masked-content");
  const overlay = document.createElement("div");
  overlay.className = "masked-overlay";
  overlay.innerText = "Masked: post from blocked subreddit";
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
  overlay.style.fontSize = "1.5em";
  overlay.style.zIndex = 10;
  overlay.style.pointerEvents = "none";
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

function hideBlockedSubredditPosts() {
  document.querySelectorAll("div[data-testid='post-container']").forEach(post => {
    if (post.classList.contains("masked-content")) return;
    const subreddit = getSubredditFromPost(post);
    if (!subreddit) return;
    if (blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
      maskElement(post);
    }
  });

  // Handle single post page (no post-container)
  if (document.querySelectorAll("div[data-testid='post-container']").length === 0) {
    // Try to find the main post content
    const main = document.querySelector("main");
    if (main && !main.classList.contains("masked-content")) {
      // Try to find subreddit from header
      const subreddit = getSubredditFromPost(document);
      if (subreddit && blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
        maskElement(main);
      }
    }
  }
}

setInterval(hideBlockedSubredditPosts, 1000);