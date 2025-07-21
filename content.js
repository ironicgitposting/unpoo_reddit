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
  try {
    const res = await fetch(`https://www.reddit.com/user/${username}/overview.json?limit=25`);
    const data = await res.json();
    return data.data.children.map(post => post.data.subreddit.toLowerCase());
  } catch (err) {
    return [];
  }
}

async function processAuthors() {
  const authors = document.querySelectorAll("a[href*='/user/']");
  const seen = new Set();

  for (const link of authors) {
    const username = link.href.split("/user/")[1].split("/")[0];
    if (seen.has(username)) continue;
    seen.add(username);

    const container = link.closest("div[data-testid='comment'], div[data-testid='post-container']");
    if (!container) continue;

    const subs = await getUserSubreddits(username);
    if (subs.some(sub => blockedSubreddits.includes(sub))) {
      maskElement(container);
    }
  }
}

setTimeout(processAuthors, 2000);