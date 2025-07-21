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
  if (el.classList.contains("masked-content")) return;

  el.classList.add("masked-content");

  const overlay = document.createElement("div");
  overlay.className = "masked-overlay";
  overlay.innerText = "Masked: user active in blocked subreddit";
  el.appendChild(overlay);
}

async function getUserSubreddits(username) {
  try {
    const res = await fetch(`https://www.reddit.com/user/${username}/overview.json?limit=30`);
    const json = await res.json();

    const subs = json.data.children.map(i => i.data?.subreddit?.toLowerCase()).filter(Boolean);
    return Array.from(new Set(subs));
  } catch (e) {
    console.warn("Reddit API error", e);
    return [];
  }
}

const seen = new Set();

async function handleNewAuthors() {
  const authorLinks = document.querySelectorAll("a[href^='/user/']");

  for (const a of authorLinks) {
    const username = a.href.split("/user/")[1].split("/")[0];
    if (seen.has(username)) continue;

    seen.add(username);

    const container = a.closest("div[data-testid='comment'], div[data-testid='post-container']");
    if (!container) continue;

    const subs = await getUserSubreddits(username);
    if (subs.some(sub => blockedSubreddits.includes(sub))) {
      maskElement(container);
    }
  }
}

// Observe DOM for React-based Reddit
const observer = new MutationObserver(() => {
  handleNewAuthors();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

async function processAuthors() {
  const authors = document.querySelectorAll("a[href^='/user/']");

  const checkedUsers = new Set();

  for (const authorLink of authors) {
    const username = authorLink.href.split("/user/")[1].replace(/\/.*/, "");
    const container = authorLink.closest("div[data-testid='comment'], div[data-testid='post-container']");
    if (!container || checkedUsers.has(username)) continue;

    checkedUsers.add(username);
    const subs = await getUserSubreddits(username);

    if (subs.some(s => blockedSubreddits.includes(s))) {
      maskElement(container);
    }
  }
}

// Wait for page to load and run
setTimeout(processAuthors, 3000);