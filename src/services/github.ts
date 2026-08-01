import { FullRepoData, CompareData, DeveloperProfile } from '../types';

const TOKEN_KEY = 'github_analyzer_pat_token';

export function getSavedToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchRepoAnalysis(repoName: string): Promise<FullRepoData> {
  const token = getSavedToken();
  const res = await fetch('/api/analyze-repo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo: repoName, githubToken: token }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to analyze repository');
  }
  return data;
}

export async function fetchCompareAnalysis(repo1: string, repo2: string): Promise<CompareData> {
  const token = getSavedToken();
  const res = await fetch('/api/compare-repos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo1, repo2, githubToken: token }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to compare repositories');
  }
  return data;
}

export async function fetchDeveloperProfile(username: string): Promise<DeveloperProfile> {
  const token = getSavedToken();
  const res = await fetch('/api/developer-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, githubToken: token }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch developer profile');
  }
  return data;
}
