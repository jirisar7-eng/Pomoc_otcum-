/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GITHUB SERVER SERVICE - "Táta má právo" / Pomoc_otcum
 * Server-side wrapper for interacting with the GitHub REST API.
 * Reads, writes, commits, and checks status of repository docs & data.
 */

export interface GitHubStatusResult {
  configured: boolean;
  repo: string;
  user?: string;
  error?: string;
}

export interface GitHubFileResult {
  success: boolean;
  path: string;
  content?: string;
  sha?: string;
  size?: number;
  error?: string;
}

export interface GitHubSaveResult {
  success: boolean;
  path: string;
  commitSha?: string;
  message?: string;
  error?: string;
}

function getGitHubConfig() {
  const token = (process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || '').trim();
  const repo = (process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || 'Pomoc-otcum/Pomoc_otcum').trim();
  return { token, repo };
}

/**
 * Checks if GITHUB_TOKEN is configured and verifies authentication with GitHub API.
 */
export async function checkGitHubStatus(): Promise<GitHubStatusResult> {
  const { token, repo } = getGitHubConfig();

  if (!token) {
    return {
      configured: false,
      repo,
      error: 'GITHUB_TOKEN environment variable is not configured.'
    };
  }

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TataMaPravo-App'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        configured: false,
        repo,
        error: `GitHub Authentication failed (${res.status}): ${errText}`
      };
    }

    const userData = await res.json() as { login: string; name?: string };
    return {
      configured: true,
      repo,
      user: userData.login || userData.name
    };
  } catch (err: any) {
    return {
      configured: false,
      repo,
      error: err.message || 'Failed to connect to GitHub API'
    };
  }
}

/**
 * Reads a file from the GitHub repository.
 */
export async function readGitHubFile(filePath: string): Promise<GitHubFileResult> {
  const { token, repo } = getGitHubConfig();

  if (!token) {
    return {
      success: false,
      path: filePath,
      error: 'GITHUB_TOKEN is missing.'
    };
  }

  const cleanPath = filePath.replace(/^\/+/, '');

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${cleanPath}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TataMaPravo-App'
      }
    });

    if (!res.ok) {
      const errData = await res.json() as { message?: string };
      return {
        success: false,
        path: filePath,
        error: errData.message || `File fetch failed (${res.status})`
      };
    }

    const data = await res.json() as { content?: string; sha?: string; size?: number; encoding?: string };
    if (!data.content) {
      return {
        success: false,
        path: filePath,
        error: 'File content is empty or directory path was provided.'
      };
    }

    // Decode base64 content (handling UTF-8 strings properly)
    const rawContent = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');

    return {
      success: true,
      path: filePath,
      content: rawContent,
      sha: data.sha,
      size: data.size
    };
  } catch (err: any) {
    return {
      success: false,
      path: filePath,
      error: err.message || 'Error reading file from GitHub'
    };
  }
}

/**
 * Saves (creates or updates) a file in the GitHub repository.
 */
export async function saveGitHubFile(
  filePath: string,
  content: string,
  commitMessage?: string,
  existingSha?: string
): Promise<GitHubSaveResult> {
  const { token, repo } = getGitHubConfig();

  if (!token) {
    return {
      success: false,
      path: filePath,
      error: 'GITHUB_TOKEN is missing. Please set GITHUB_TOKEN in environment variables.'
    };
  }

  const cleanPath = filePath.replace(/^\/+/, '');

  try {
    // If SHA is not supplied, attempt to fetch current file SHA first to allow overwrite
    let shaToUse = existingSha;
    if (!shaToUse) {
      const current = await readGitHubFile(cleanPath);
      if (current.success && current.sha) {
        shaToUse = current.sha;
      }
    }

    const base64Content = Buffer.from(content, 'utf-8').toString('base64');
    const msg = commitMessage || `Update ${cleanPath} via Táta má právo web portal`;

    const bodyObj: Record<string, any> = {
      message: msg,
      content: base64Content
    };

    if (shaToUse) {
      bodyObj.sha = shaToUse;
    }

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${cleanPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'TataMaPravo-App'
      },
      body: JSON.stringify(bodyObj)
    });

    if (!res.ok) {
      const errData = await res.json() as { message?: string };
      return {
        success: false,
        path: filePath,
        error: errData.message || `GitHub save failed with status ${res.status}`
      };
    }

    const resData = await res.json() as { commit?: { sha?: string }, content?: { sha?: string } };
    return {
      success: true,
      path: filePath,
      commitSha: resData.commit?.sha || resData.content?.sha,
      message: `Změny byly úspěšně uloženy do repozitáře ${repo} (${cleanPath}).`
    };
  } catch (err: any) {
    return {
      success: false,
      path: filePath,
      error: err.message || 'Error saving file to GitHub'
    };
  }
}
