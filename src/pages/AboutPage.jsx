import { useEffect, useState } from "react";

export default function AboutPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.github.com/users/rishavraj2004/repos?sort=updated&per_page=12",
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data.filter((repo) => !repo.fork));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="lg-shell">
      <section className="lg-about">
        <div className="lg-eyebrow">About the builder</div>
        <h1>Built by someone who almost lost a streak.</h1>
        <p>
          I'm Rishav Raj, a Backend Developer pursuing a B.Tech in Computer
          Science. I enjoy building systems that solve real-world problems
          through automation, scalable backend architecture, and intelligent AI
          workflows.
        </p>
        <p>
          The stack is deliberately boring where it should be: a Node.js backend
          that checks public LeetCode activity on a schedule, a Telegram bot
          that only speaks when needed, and this React frontend — no UI library,
          no login, no data beyond the two IDs the job requires.
        </p>
        <p className="quiet">
          Outside of building products, I consistently practice Data Structures
          & Algorithms, contribute to open-source projects, participate in
          hackathons, and continuously learn modern backend and AI technologies.
        </p>
        <div className="lg-about-links">
          <a
            className="lg-chip a"
            href="https://github.com/rishavraj2004"
            target="_blank"
            rel="noreferrer"
          >
            github ↗
          </a>
          <a
            className="lg-chip b"
            href="https://www.linkedin.com/in/rishavraj04"
            target="_blank"
            rel="noreferrer"
          >
            linkedin ↗
          </a>
          <a className="lg-chip" href="mailto:rishav413raj@gmail.com">
            email ↗
          </a>
        </div>
      </section>

      <section className="lg-projects-section">
        <h2>Other Projects</h2>
        {loading ? (
          <p className="quiet">Fetching projects from GitHub...</p>
        ) : (
          <div className="lg-projects-grid">
            {projects.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="lg-project-card"
              >
                <h3>{repo.name}</h3>
                <p>{repo.description || "No description provided."}</p>
                <div className="lg-project-meta">
                  {repo.language && (
                    <span>
                      <span className="lang-color" />
                      {repo.language}
                    </span>
                  )}
                  <span>⭐ {repo.stargazers_count}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
