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
  el.classList.add("masked-content");

  const overlay = document.createElement("div");
  overlay.className = "masked-overlay";
  overlay.innerText = "Masked: user active in blocked subreddit";

  el.appendChild(overlay);
}

async function getUserSubreddits(username) {
  const response = await fetch(`https://www.reddit.com/user/${username}/overview.json?limit=50`);
  if (!response.ok) return [];

  const data = await response.json();
  const subreddits = new Set();

  for (const item of data.data.children) {
    if (item.data.subreddit) {
      subreddits.add(item.data.subreddit.toLowerCase());
    }
  }

  return Array.from(subreddits);
}

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