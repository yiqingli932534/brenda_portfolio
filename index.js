import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js";

(async () => {
  // 1️⃣ Fetch all projects
  const projects = await fetchJSON("./lib/projects.json");

  // 2️⃣ Keep only the first 3 projects
  const latestProjects = projects.slice(0, 3);

  // 3️⃣ Find the container on the homepage
  const projectsContainer = document.querySelector(".projects");
  if (!projectsContainer) {
    console.error("Home page: .projects container not found");
    return;
  }

  // 4️⃣ Render the latest 3 projects
  renderProjects(latestProjects, projectsContainer, "h2");


  // Step 4.3.4 
  const githubData = await fetchGitHubData('giorgianicolaou');
  const profileStats = document.querySelector('#profile-stats');

  // Step 4.3.5
  if (profileStats) {
  profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}

})();


