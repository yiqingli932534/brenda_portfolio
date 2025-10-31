console.log("IT’S ALIVE!");

// Step 1: Helper function
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}


// Step 3.1: Define the pages for automatic navigation
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "cv/", title: "CV" },
  { url: "https://github.com/yiqingli932534", title: "GitHub" },
];

// Detect if we're running locally or on GitHub Pages
// Replace '/portfolio/' with your actual GitHub repo name
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"               // Local environment (Live Server)
    : "/brenda_portfolio/";    // GitHub Pages repo (example: /brenda_portfolio/)

// Create a <nav> element and add it at the top of <body>
let nav = document.createElement("nav");
document.body.prepend(nav);


// -----------------------------
// Step 3.2: Highlight current page & open external links in new tab
// -----------------------------
// Now we generate the actual <a> links inside the <nav> dynamically.
for (let p of pages) {
  let url = p.url;   // The relative or absolute path
  let title = p.title; // The text that will be shown on the link

  // Prefix internal links (like "projects/" or "contact/") with the base path.
  // External links (starting with "http") are left unchanged.
  if (!url.startsWith("http")) {
    url = BASE_PATH + url;
  }

  // Create a new <a> element for this page
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // Highlight the current page link
  // ---------------------------------------
  // Compare the host (domain) and pathname (path after domain) of this link
  // to the current page. If they match, add the "current" class to highlight it.
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // Make external links open in a new browser tab
  // ---------------------------------------
  // If the link’s host (domain) differs from the current page’s host,
  // it’s considered external — e.g., GitHub.
  if (a.host !== location.host) {
    a.target = "_blank";               // Opens in a new tab
    a.rel = "noopener noreferrer";     // Security best practice for external links
  }

  // Finally, add the <a> link to the <nav> menu
  nav.append(a);
}


// Step 2.1: Get all nav links
const navLinks = $$("nav a");

// Step 2.2: From all the nav links, find the one whose URL matches the page I’m currently on.
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

// Step 2.3: If we found the matching link, add the class current so it looks highlighted.
currentLink?.classList.add("current");


// =========================================
// Step 4.2 – Insert dark-mode switch dropdown
// =========================================
document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);


// =========================================
// Step 4.4 – Make the dark-mode switch work
// =========================================

// Get the <select> element inside our label
const select = document.querySelector(".color-scheme select");

// Listen for user changes
select.addEventListener("input", (event) => {
  const newScheme = event.target.value;
  console.log("Color scheme changed to:", newScheme);

  // Apply the chosen color scheme to the <html> element
  document.documentElement.style.setProperty("color-scheme", newScheme);
});



// Step 4.1.2 - how to get data from a URL
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
    throw error; // re-throw if you want callers to catch it
  }
}

// Step 4.1.4 - how to create <article> elements for projects.
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // 1️⃣ Clear existing content
  containerElement.innerHTML = '';

  // 2️⃣ Validate inputs
  if (!Array.isArray(projects)) {
    console.error('renderProjects: "projects" must be an array.');
    return;
  }
  if (!containerElement) {
    console.error('renderProjects: containerElement not found.');
    return;
  }

  // 3️⃣ Loop through each project and create <article> elements
  for (const project of projects) {
    const article = document.createElement('article');

    // 4️⃣ Fill in the content dynamically including the year Step 5.0.1
     article.innerHTML = `
      <${headingLevel}>${project.title ?? 'Untitled Project'}</${headingLevel}>
      <img src="${project.image ?? 'https://vis-society.github.io/labs/2/images/empty.svg'}"
           alt="${project.title ?? 'Project image'}">
      <div class="project-desc">
        <p>${project.description ?? 'No description available.'}</p>
        <p class="project-year">${project.year ?? ''}</p>
      </div>
    `;

    // 5️⃣ Append to the container
    containerElement.appendChild(article);
  }
}

// Step 4.3.2 – knows how to get your GitHub profile info/Fetch GitHub data
export async function fetchGitHubData(username) {
  // Use our reusable fetchJSON() function to get data from the GitHub API
  return fetchJSON(`https://api.github.com/users/${username}`);
}
