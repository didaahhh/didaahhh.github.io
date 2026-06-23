// Ganti username ini dengan username GitHub kamu.
// Contoh: const githubUsername = "didaahhh";
const githubUsername = "YOUR_GITHUB_USERNAME";

const year = document.getElementById("year");
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");
const githubProfile = document.getElementById("githubProfile");
const repoStatus = document.getElementById("repoStatus");
const repoContainer = document.getElementById("repoContainer");

year.textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("show");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function showMessage(title, message) {
  repoStatus.textContent = message;
  repoContainer.innerHTML = `
    <article class="repo-card">
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
      </div>
      <a class="button" href="https://github.com/" target="_blank" rel="noopener">Buka GitHub</a>
    </article>
  `;
}

async function loadGithubRepos() {
  if (!githubUsername || githubUsername === "YOUR_GITHUB_USERNAME") {
    githubProfile.href = "https://github.com/";
    showMessage(
      "Username belum diatur",
      "Ganti YOUR_GITHUB_USERNAME di file app.js agar project GitHub bisa tampil di halaman ini."
    );
    return;
  }

  githubProfile.href = `https://github.com/${githubUsername}`;
  repoStatus.textContent = "Mengambil data dari GitHub...";

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!response.ok) {
      throw new Error("Username tidak ditemukan atau batas akses GitHub API sedang penuh.");
    }

    const repos = await response.json();

    if (!repos.length) {
      showMessage("Belum ada repositori", "Akun GitHub ini belum memiliki repositori publik.");
      return;
    }

    repoStatus.textContent = `Menampilkan ${repos.length} repositori publik terbaru.`;
    repoContainer.innerHTML = repos
      .map((repo) => {
        const name = escapeHtml(repo.name);
        const description = escapeHtml(repo.description || "Belum ada deskripsi repositori.");
        const language = escapeHtml(repo.language || "General");
        const updatedAt = escapeHtml(formatDate(repo.updated_at));

        return `
          <article class="repo-card">
            <div>
              <h3>${name}</h3>
              <p>${description}</p>
            </div>
            <div>
              <div class="repo-meta">
                <span>${language}</span>
                <span>★ ${repo.stargazers_count}</span>
                <span>Fork ${repo.forks_count}</span>
                <span>Update ${updatedAt}</span>
              </div>
              <a class="button" href="${repo.html_url}" target="_blank" rel="noopener">Lihat Repo</a>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    showMessage("Repositori belum bisa ditampilkan", error.message);
  }
}

loadGithubRepos();
