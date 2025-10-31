import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

(async () => {
  // ================================
  // Load project data
  // ================================
  const allProjects = await fetchJSON("../lib/projects.json");
  const projectsContainer = document.querySelector(".projects");
  const title = document.querySelector(".projects-title");
  const svg = d3.select("#projects-pie-plot");
  const legend = d3.select(".legend");
  const searchInput = document.querySelector(".searchBar");

  let selectedIndex = -1; // no wedge selected

  // ================================
  // Helper: renderPieChart()
  // ================================
  function renderPieChart(projectsGiven) {
    const rolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year
    );

    const data = rolledData.map(([year, count]) => ({
      label: year,
      value: count,
    }));

    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcData = sliceGenerator(data);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    svg.selectAll("*").remove();
    legend.selectAll("*").remove();

    // ================================
    // Draw pie slices
    // ================================
    svg
      .selectAll("path")
      .data(arcData)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (_, i) => colors(i))
      .attr("class", (_, i) => (i === selectedIndex ? "selected" : null))
      .on("click", function (event, d) {
        const i = arcData.indexOf(d);
        selectedIndex = selectedIndex === i ? -1 : i;

        // Determine which year (if any) is selected
        let filteredProjects = projectsGiven;
        if (selectedIndex !== -1) {
          const selectedYear = data[selectedIndex].label;
          filteredProjects = projectsGiven.filter(
            (p) => String(p.year) === String(selectedYear)
          );
        }

        // Re-render everything
        renderProjects(filteredProjects, projectsContainer, "h2");
        title.textContent = `${filteredProjects.length} Projects`;
        renderPieChart(projectsGiven); // re-render chart but preserve selection
      });

    // ================================
    // Draw legend
    // ================================
    legend
      .selectAll("li")
      .data(data)
      .join("li")
      .attr("style", (_, i) => `--color:${colors(i)}`)
      .attr("class", (_, i) => `legend-item ${i === selectedIndex ? "selected" : ""}`)
      .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", function (event, d) {
        const i = data.indexOf(d);
        selectedIndex = selectedIndex === i ? -1 : i;

        let filteredProjects = projectsGiven;
        if (selectedIndex !== -1) {
          const selectedYear = data[selectedIndex].label;
          filteredProjects = projectsGiven.filter(
            (p) => String(p.year) === String(selectedYear)
          );
        }

        renderProjects(filteredProjects, projectsContainer, "h2");
        title.textContent = `${filteredProjects.length} Projects`;
        renderPieChart(projectsGiven);
      });
  }

  // ================================
  // Initial render
  // ================================
  renderProjects(allProjects, projectsContainer, "h2");
  title.textContent = `${allProjects.length} Projects`;
  renderPieChart(allProjects);

  // ================================
  // Step 4 – Search functionality
  // ================================
  let query = "";

  searchInput.addEventListener("input", (event) => {
    query = event.target.value.toLowerCase();

    const filteredProjects = allProjects.filter((project) => {
      const values = Object.values(project).join("\n").toLowerCase();
      return values.includes(query);
    });

    renderProjects(filteredProjects, projectsContainer, "h2");
    title.textContent = `${filteredProjects.length} Projects`;
    renderPieChart(filteredProjects);
  });
})();
