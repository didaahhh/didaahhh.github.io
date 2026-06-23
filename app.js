const githubUsername = "YOUR_GITHUB_USERNAME";
const repoContainer = document.getElementById("repo-container");

async function getGithubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`
    );

    if (!response.ok) {
      throw new Error("GitHub data not found");
    }

    const repos = await response.json();

    if (repos.length === 0) {
      repoContainer.innerHTML = `
        <p class="loading">No public repositories found.</p>
      `;
      return;
    }

    repoContainer.innerHTML = "";

    repos.forEach((repo) => {
      const repoCard = document.createElement("article");
      repoCard.className = "repo-card";

      repoCard.innerHTML = `
        <div>
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available for this repository."}</p>
        </div>

        <div>
          <div class="repo-meta">
            <span>${repo.language || "Code"}</span>
            <span>★ ${repo.stargazers_count}</span>
            <span>Fork ${repo.forks_count}</span>
          </div>

          <br>

          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            View Repository
          </a>
        </div>
      `;

      repoContainer.appendChild(repoCard);
    });
  } catch (error) {
    repoContainer.innerHTML = `
      <p class="loading">
        GitHub repositories could not be loaded. Please check your GitHub username in app.js.
      </p>
    `;
  }
}

getGithubRepos();
