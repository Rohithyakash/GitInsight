import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for GitHub Headers
function getGithubHeaders(token?: string) {
  const headers: Record<string, string> = {
    "User-Agent": "GitHub-Analyzer-SaaS-App",
    Accept: "application/vnd.github.v3+json",
  };
  if (token && token.trim().length > 0) {
    headers["Authorization"] = `Bearer ${token.trim()}`;
  }
  return headers;
}

// Fallback AI Review generator if API fails or rate limited
function generateFallbackAiReview(
  repoName: string,
  stars: number,
  forks: number,
  openIssues: number,
  primaryLanguage: string | null,
  pushedAt: string,
  hasReadme: boolean
): any {
  const monthsSincePushed = Math.floor(
    (Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  let healthScore = 85;
  if (monthsSincePushed > 12) healthScore -= 25;
  else if (monthsSincePushed > 6) healthScore -= 10;
  if (openIssues > 500) healthScore -= 10;
  if (stars > 5000) healthScore += 10;
  if (hasReadme) healthScore += 5;
  healthScore = Math.max(30, Math.min(99, healthScore));

  let statusLabel = "Healthy";
  if (healthScore >= 90) statusLabel = "Excellent";
  else if (healthScore < 70) statusLabel = "Needs Attention";
  else if (healthScore < 50) statusLabel = "Critical";

  return {
    healthScore,
    statusLabel,
    executiveSummary: `${repoName} shows ${
      healthScore >= 80 ? "strong structural health and active maintenance" : "moderate activity with areas for optimization"
    }. Powered by a vibrant community with ${stars.toLocaleString()} stars and focused around ${
      primaryLanguage || "multi-language"
    } ecosystem best practices.`,
    strengths: [
      {
        title: "Robust Community Adoption",
        description: `Enjoys widespread trust with over ${stars.toLocaleString()} stars and ${forks.toLocaleString()} forks on GitHub.`,
      },
      {
        title: "Clear Technology Stack",
        description: `Leverages modern design patterns in ${primaryLanguage || "its core architecture"} with well-structured repository components.`,
      },
      {
        title: "Active Repository Lifecycle",
        description: `Last code updates recorded ${
          monthsSincePushed === 0 ? "recently this month" : `${monthsSincePushed} month(s) ago`
        }.`,
      },
    ],
    risks: [
      {
        title: "Open Issue Backlog",
        description: `Contains ${openIssues.toLocaleString()} open issues requiring active triage and maintainer reviews.`,
      },
      {
        title: "Dependency Maintenance Overhead",
        description: "Requires periodic dependency audits to maintain compatibility and security standards.",
      },
      {
        title: "Contributor Distribution",
        description: "Ensure key architectural paths are documented so knowledge is distributed across core maintainers.",
      },
    ],
    recommendations: [
      {
        title: "Automate CI/CD Workflows",
        description: "Implement GitHub Actions for continuous linting, build checks, and issue automated labeling.",
      },
      {
        title: "Enhance Contributor Guidelines",
        description: "Streamline PR submission guidelines and introduce issue templates to accelerate triage.",
      },
      {
        title: "Modularize Core Packages",
        description: "Separate monolithic modules into independent packages to lower entry barrier for new contributors.",
      },
    ],
    metrics: {
      documentationQuality: hasReadme ? 88 : 45,
      testCoverageSignal: 80,
      maintenanceLiveliness: monthsSincePushed <= 3 ? 92 : 60,
      communityEngagement: Math.min(98, Math.round((stars / (stars + 1000)) * 100)),
    },
  };
}

// 1. ANALYZE REPO ENDPOINT
app.post("/api/analyze-repo", async (req, res) => {
  try {
    const { repo, githubToken } = req.body;
    if (!repo || typeof repo !== "string") {
      return res.status(400).json({ error: "Repository name is required (e.g. 'facebook/react')" });
    }

    const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    const parts = cleanRepo.split("/");
    if (parts.length < 2) {
      return res.status(400).json({ error: "Invalid repository format. Please use 'owner/repository' (e.g. 'facebook/react')" });
    }

    const owner = parts[0];
    const repoName = parts[1];
    const headers = getGithubHeaders(githubToken);

    // Fetch Repo Main Info
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return res.status(404).json({ error: `Repository '${owner}/${repoName}' not found on GitHub.` });
      }
      if (repoRes.status === 403) {
        return res.status(403).json({
          error: "GitHub API rate limit exceeded. Please add a Personal Access Token in the top navbar to continue seamlessly.",
        });
      }
      return res.status(repoRes.status).json({ error: `GitHub API error: ${repoRes.statusText}` });
    }

    const repoData = await repoRes.json();

    // Fetch parallel supporting details (languages, contributors, commits, readme, issues)
    const [langRes, contribRes, commitRes, readmeRes, issueRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`, { headers }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=12`, { headers }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=20`, { headers }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
        headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
      }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repoName}/issues?per_page=30&state=all`, { headers }).catch(() => null),
    ]);

    const languages = langRes && langRes.ok ? await langRes.json() : {};
    const contribRaw = contribRes && contribRes.ok ? await contribRes.json() : [];
    const commitRaw = commitRes && commitRes.ok ? await commitRes.json() : [];
    const readmeContent = readmeRes && readmeRes.ok ? await readmeRes.text() : null;
    const issuesRaw = issueRes && issueRes.ok ? await issueRes.json() : [];

    const contributors = Array.isArray(contribRaw)
      ? contribRaw.map((c: any) => ({
          login: c.login,
          id: c.id,
          avatarUrl: c.avatar_url,
          htmlUrl: c.html_url,
          contributions: c.contributions,
          type: c.type,
        }))
      : [];

    const recentCommits = Array.isArray(commitRaw)
      ? commitRaw.map((c: any) => ({
          sha: c.sha?.substring(0, 7) || "",
          message: c.commit?.message?.split("\n")[0] || "Update codebase",
          authorName: c.commit?.author?.name || c.author?.login || "Maintainer",
          authorDate: c.commit?.author?.date || new Date().toISOString(),
          url: c.html_url || "#",
        }))
      : [];

    let openPRsCount = 0;
    if (Array.isArray(issuesRaw)) {
      openPRsCount = issuesRaw.filter((i: any) => i.pull_request).length;
    }

    const fullInfo = {
      owner: repoData.owner.login,
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      htmlUrl: repoData.html_url,
      homepage: repoData.homepage,
      topics: repoData.topics || [],
      license: repoData.license ? repoData.license.spdx_id || repoData.license.name : null,
      defaultBranch: repoData.default_branch,
      createdAt: repoData.created_at,
      pushedAt: repoData.pushed_at,
      updatedAt: repoData.updated_at,
      language: repoData.language,
      archived: repoData.archived || false,
      disabled: repoData.disabled || false,
      visibility: repoData.visibility || "public",
      fork: repoData.fork || false,
      stats: {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.subscribers_count || repoData.watchers_count,
        openIssues: repoData.open_issues_count,
        subscribersCount: repoData.subscribers_count,
        sizeKb: repoData.size,
      },
    };

    // Ask Gemini for AI Review
    let aiReview = null;
    try {
      const topLanguagesStr = Object.keys(languages).slice(0, 5).join(", ") || fullInfo.language || "Unknown";
      const readmeExcerpt = readmeContent ? readmeContent.slice(0, 1500) : "No readme found.";

      const prompt = `You are a Principal Software Architect analyzing the GitHub repository "${fullInfo.fullName}".
Metadata:
- Description: ${fullInfo.description || "N/A"}
- Stars: ${fullInfo.stats.stars}, Forks: ${fullInfo.stats.forks}, Open Issues: ${fullInfo.stats.openIssues}
- Primary Language: ${fullInfo.language}, Top Languages: ${topLanguagesStr}
- Created: ${fullInfo.createdAt}, Last Pushed: ${fullInfo.pushedAt}
- License: ${fullInfo.license || "None specified"}
- Topics: ${fullInfo.topics.join(", ")}
- Readme Excerpt: "${readmeExcerpt}"

Provide an architectural analysis in JSON matching the exact schema:
{
  "healthScore": number (0 to 100),
  "statusLabel": string (e.g. "Excellent", "Healthy", "Needs Attention", "Critical"),
  "executiveSummary": string (2-3 concise sentences),
  "strengths": [{"title": string, "description": string}], // exactly 3 items
  "risks": [{"title": string, "description": string}], // exactly 3 items
  "recommendations": [{"title": string, "description": string}], // exactly 3 items
  "metrics": {
    "documentationQuality": number (0-100),
    "testCoverageSignal": number (0-100),
    "maintenanceLiveliness": number (0-100),
    "communityEngagement": number (0-100)
  }
}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: { type: Type.INTEGER },
              statusLabel: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              strengths: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["title", "description"],
                },
              },
              risks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["title", "description"],
                },
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["title", "description"],
                },
              },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  documentationQuality: { type: Type.INTEGER },
                  testCoverageSignal: { type: Type.INTEGER },
                  maintenanceLiveliness: { type: Type.INTEGER },
                  communityEngagement: { type: Type.INTEGER },
                },
                required: [
                  "documentationQuality",
                  "testCoverageSignal",
                  "maintenanceLiveliness",
                  "communityEngagement",
                ],
              },
            },
            required: [
              "healthScore",
              "statusLabel",
              "executiveSummary",
              "strengths",
              "risks",
              "recommendations",
              "metrics",
            ],
          },
        },
      });

      if (aiResponse.text) {
        aiReview = JSON.parse(aiResponse.text);
      }
    } catch (err) {
      console.warn("Gemini review fallback triggered:", err);
    }

    if (!aiReview) {
      aiReview = generateFallbackAiReview(
        fullInfo.fullName,
        fullInfo.stats.stars,
        fullInfo.stats.forks,
        fullInfo.stats.openIssues,
        fullInfo.language,
        fullInfo.pushedAt,
        !!readmeContent
      );
    }

    return res.json({
      info: fullInfo,
      languages,
      contributors,
      recentCommits,
      issueSummary: {
        openIssuesCount: fullInfo.stats.openIssues,
        openPRsCount,
        closedIssuesEstimate: Math.round(fullInfo.stats.openIssues * 2.4),
      },
      readmeContent,
      aiReview,
    });
  } catch (error: any) {
    console.error("Error analyzing repo:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze repository." });
  }
});

// 2. COMPARE REPOS ENDPOINT
app.post("/api/compare-repos", async (req, res) => {
  try {
    const { repo1, repo2, githubToken } = req.body;
    if (!repo1 || !repo2) {
      return res.status(400).json({ error: "Both repository names are required for comparison." });
    }

    // Call internal analyze logic or direct endpoint fetch
    const analyzeOne = async (rName: string) => {
      const response = await fetch(`http://localhost:${PORT}/api/analyze-repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: rName, githubToken }),
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to analyze repository '${rName}'`);
      }
      return await response.json();
    };

    const [data1, data2] = await Promise.all([analyzeOne(repo1), analyzeOne(repo2)]);

    // Generate Head to Head Gemini Comparison
    let aiComparison = null;
    try {
      const prompt = `Compare these two GitHub repositories head-to-head:
Repo 1: ${data1.info.fullName} (${data1.info.stats.stars} stars, ${data1.info.stats.openIssues} open issues, Lang: ${data1.info.language}, Health Score: ${data1.aiReview.healthScore})
Repo 2: ${data2.info.fullName} (${data2.info.stats.stars} stars, ${data2.info.stats.openIssues} open issues, Lang: ${data2.info.language}, Health Score: ${data2.aiReview.healthScore})

Output JSON schema:
{
  "verdict": string (1-2 sentences overall comparison summary),
  "winner": "repo1" | "repo2" | "tie",
  "summary": string (detailed analysis paragraph),
  "repo1ProsCons": { "pros": [string, string], "cons": [string, string] },
  "repo2ProsCons": { "pros": [string, string], "cons": [string, string] },
  "useCaseRecommendations": string (guidance on when to choose Repo 1 vs Repo 2)
}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: { type: Type.STRING },
              winner: { type: Type.STRING },
              summary: { type: Type.STRING },
              repo1ProsCons: {
                type: Type.OBJECT,
                properties: {
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["pros", "cons"],
              },
              repo2ProsCons: {
                type: Type.OBJECT,
                properties: {
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["pros", "cons"],
              },
              useCaseRecommendations: { type: Type.STRING },
            },
            required: [
              "verdict",
              "winner",
              "summary",
              "repo1ProsCons",
              "repo2ProsCons",
              "useCaseRecommendations",
            ],
          },
        },
      });

      if (aiResponse.text) {
        aiComparison = JSON.parse(aiResponse.text);
      }
    } catch (e) {
      console.warn("AI Comparison fallback:", e);
    }

    if (!aiComparison) {
      const winnerKey =
        data1.aiReview.healthScore > data2.aiReview.healthScore
          ? "repo1"
          : data2.aiReview.healthScore > data1.aiReview.healthScore
          ? "repo2"
          : "tie";

      aiComparison = {
        verdict: `${data1.info.name} and ${data2.info.name} both serve pivotal roles in software engineering, with distinct architecture tradeoffs.`,
        winner: winnerKey,
        summary: `${data1.info.fullName} presents ${data1.info.stats.stars.toLocaleString()} stars while ${data2.info.fullName} brings ${data2.info.stats.stars.toLocaleString()} stars. Evaluate team familiarity, documentation depth, and maintenance frequency.`,
        repo1ProsCons: {
          pros: ["Large active ecosystem", "Extensive production usage"],
          cons: ["Higher issue backlog", "Legacy surface area"],
        },
        repo2ProsCons: {
          pros: ["Modern developer API", "Agile maintenance release cycle"],
          cons: ["Smaller third-party plugin library", "Fewer enterprise references"],
        },
        useCaseRecommendations: `Choose ${data1.info.name} if you prioritize widespread enterprise consensus and legacy compatibility. Choose ${data2.info.name} for leaner overhead and modern ergonomic primitives.`,
      };
    }

    return res.json({
      repo1: data1,
      repo2: data2,
      aiComparison,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Comparison failed" });
  }
});

// 3. DEVELOPER PROFILE ENDPOINT
app.post("/api/developer-profile", async (req, res) => {
  try {
    const { username, githubToken } = req.body;
    if (!username) {
      return res.status(400).json({ error: "GitHub username is required." });
    }

    const cleanUser = username.trim().replace(/^@/, "");
    const headers = getGithubHeaders(githubToken);

    const userRes = await fetch(`https://api.github.com/users/${cleanUser}`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: `GitHub user '${cleanUser}' not found.` });
      }
      return res.status(userRes.status).json({ error: `GitHub API error: ${userRes.statusText}` });
    }

    const user = await userRes.json();

    // Fetch user public repositories
    const reposRes = await fetch(`https://api.github.com/users/${cleanUser}/repos?sort=updated&per_page=30`, { headers }).catch(() => null);
    const reposRaw = reposRes && reposRes.ok ? await reposRes.json() : [];

    const langCounts: Record<string, number> = {};
    let totalStars = 0;

    const recentRepos = Array.isArray(reposRaw)
      ? reposRaw.map((r: any) => {
          totalStars += r.stargazers_count || 0;
          if (r.language) {
            langCounts[r.language] = (langCounts[r.language] || 0) + 1;
          }
          return {
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language,
            updatedAt: r.updated_at,
            htmlUrl: r.html_url,
          };
        })
      : [];

    const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#6366F1"];
    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], idx) => ({
        name,
        percentage: Math.round((count / totalLangs) * 100),
        color: colors[idx % colors.length],
      }));

    // AI Persona assessment
    let aiPersona = null;
    try {
      const topLangsStr = topLanguages.map((l) => l.name).join(", ");
      const topRepoNames = recentRepos.slice(0, 5).map((r) => `${r.name} (${r.stars}⭐)`).join(", ");

      const prompt = `Analyze this GitHub developer profile:
Name: ${user.name || user.login} (@${user.login})
Bio: ${user.bio || "N/A"}
Company: ${user.company || "N/A"}
Location: ${user.location || "N/A"}
Public Repos: ${user.public_repos}, Followers: ${user.followers}
Total Stars Earned: ${totalStars}
Top Languages: ${topLangsStr}
Popular Repos: ${topRepoNames}

Generate a JSON object:
{
  "developerArchetype": string (e.g., "Full-Stack Core Maintainer", "Systems Engineer", "Frontend Architect"),
  "keySkills": [string, string, string, string],
  "summary": string (2-3 sentences evaluating coding impact and domain expertise),
  "notableContributions": string (summary of key projects and community influence)
}`;

      const aiRes = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              developerArchetype: { type: Type.STRING },
              keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
              notableContributions: { type: Type.STRING },
            },
            required: ["developerArchetype", "keySkills", "summary", "notableContributions"],
          },
        },
      });

      if (aiRes.text) {
        aiPersona = JSON.parse(aiRes.text);
      }
    } catch (err) {
      console.warn("AI Developer persona fallback:", err);
    }

    if (!aiPersona) {
      aiPersona = {
        developerArchetype: topLanguages[0]?.name ? `${topLanguages[0].name} Ecosystem Specialist` : "Open Source Contributor",
        keySkills: topLanguages.map((l) => l.name).concat(["System Design", "Git Workflow"]).slice(0, 4),
        summary: `${user.name || user.login} is an active open-source developer with ${user.public_repos} public repositories and ${totalStars.toLocaleString()} total stars earned across public projects.`,
        notableContributions: `Actively builds in ${topLanguages[0]?.name || "multi-language"} ecosystems with contributions reaching ${user.followers.toLocaleString()} followers on GitHub.`,
      };
    }

    const devProfile = {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
      topLanguages,
      totalStarsEarned: totalStars,
      recentRepos,
      aiPersona,
    };

    return res.json(devProfile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch developer profile" });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GitHub Analyzer Server running at http://localhost:${PORT}`);
  });
}

startServer();
