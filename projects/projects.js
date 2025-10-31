import { fetchJSON, renderProjects } from "../global.js";

(async () => {
  const projects = await fetchJSON("../lib/projects.json");
  const projectsContainer = document.querySelector(".projects");
  renderProjects(projects, projectsContainer, "h2");

  // Step 1.6 – Count projects
  const title = document.querySelector(".projects-title");
  if (title) {
    title.textContent = `${projects.length} Projects`;
  }
})();
