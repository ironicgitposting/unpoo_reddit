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

function hideBlockedSubredditPosts() {
  document.querySelectorAll("div[data-testid='post-container']").forEach(post => {
    // Already masked? Skip
    if (post.classList.contains("masked-content")) return;
    // Find subreddit link
    const subredditLink = post.querySelector("a[data-testid='subreddit-link']");
    if (!subredditLink) return;
    const subreddit = subredditLink.textContent.replace(/^r\//, "").toLowerCase();
    if (blockedSubreddits.map(s => s.toLowerCase()).includes(subreddit)) {
      maskElement(post);
    }
  });
}

setInterval(hideBlockedSubredditPosts, 1000);