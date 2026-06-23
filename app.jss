const githubUsername = "YOUR_GITHUB_USERNAME";
const repoContainer = document.getElementById("repo-container");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadGithubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const repositories = await response.json();

    if (!repositories.length) {
      repoContainer.innerHTML = `
        <p class="loading-text">No public repositories found.</p>
      `;
      return;
    }

    repoContainer.innerHTML = "";

    repositories.forEach((repo) => {
      const repoCard = document.createElement("article");
      repoCard.className = "repo-card";

      const description = repo.description
        ? escapeHtml(repo.description)
        : "A public GitHub repository created for learning, practice, or project development.";

      repoCard.innerHTML = `
        <div>
          <h3>${escapeHtml(repo.name)}</h3>
          <p>${description}</p>
        </div>

        <div>
          <div class="repo-meta">
            <span>${escapeHtml(repo.language || "Code")}</span>
            <span>★ ${repo.stargazers_count}</span>
            <span>Fork ${repo.forks_count}</span>
          </div>

          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            Open Repository →
          </a>
        </div>
      `;

      repoContainer.appendChild(repoCard);
    });
  } catch (error) {
    repoContainer.innerHTML = `
      <p class="loading-text">
        GitHub repositories could not be loaded. Please check your GitHub username in app.js.
      </p>
    `;
  }
}

loadGithubRepos();
