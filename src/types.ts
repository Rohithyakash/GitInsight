export interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  subscribersCount?: number;
  sizeKb: number;
}

export interface RepoInfo {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  topics: string[];
  license: string | null;
  defaultBranch: string;
  createdAt: string;
  pushedAt: string;
  updatedAt: string;
  language: string | null;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  fork: boolean;
  stats: RepoStats;
}

export interface LanguageBreakdown {
  [key: string]: number; // Bytes of code per language
}

export interface Contributor {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
  type: string;
}

export interface CommitActivity {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  url: string;
}

export interface IssueSummary {
  openIssuesCount: number;
  openPRsCount: number;
  closedIssuesEstimate: number;
}

export interface AiReview {
  healthScore: number; // 0 - 100
  statusLabel: string; // e.g. "Excellent", "Healthy", "Needs Attention", "Critical"
  executiveSummary: string;
  strengths: {
    title: string;
    description: string;
  }[];
  risks: {
    title: string;
    description: string;
  }[];
  recommendations: {
    title: string;
    description: string;
  }[];
  metrics: {
    documentationQuality: number; // 0-100
    testCoverageSignal: number; // 0-100
    maintenanceLiveliness: number; // 0-100
    communityEngagement: number; // 0-100
  };
}

export interface FullRepoData {
  info: RepoInfo;
  languages: LanguageBreakdown;
  contributors: Contributor[];
  recentCommits: CommitActivity[];
  issueSummary: IssueSummary;
  readmeContent: string | null;
  aiReview: AiReview;
}

export interface CompareData {
  repo1: FullRepoData;
  repo2: FullRepoData;
  aiComparison: {
    verdict: string;
    winner: 'repo1' | 'repo2' | 'tie';
    summary: string;
    repo1ProsCons: { pros: string[]; cons: string[] };
    repo2ProsCons: { pros: string[]; cons: string[] };
    useCaseRecommendations: string;
  };
}

export interface DeveloperProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  topLanguages: { name: string; percentage: number; color: string }[];
  totalStarsEarned: number;
  recentRepos: {
    name: string;
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    updatedAt: string;
    htmlUrl: string;
  }[];
  aiPersona?: {
    developerArchetype: string;
    keySkills: string[];
    summary: string;
    notableContributions: string;
  };
}
