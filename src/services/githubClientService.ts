/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GITHUB CLIENT SERVICE - "Táta má právo" / Pomoc_otcum
 * Client-side interface to communicate with backend proxy for GitHub read/write operations.
 */

export interface GitHubStatus {
  configured: boolean;
  repo: string;
  user?: string;
  error?: string;
}

export interface GitHubReadResult {
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

/**
 * Checks the status of GitHub token configuration and repository connection on backend.
 */
export async function fetchGitHubStatus(): Promise<GitHubStatus> {
  try {
    const res = await fetch('/api/github/status');
    if (!res.ok) {
      return {
        configured: false,
        repo: 'Pomoc-otcum/Pomoc_otcum',
        error: `HTTP Error ${res.status}`
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      configured: false,
      repo: 'Pomoc-otcum/Pomoc_otcum',
      error: err.message || 'Nepodařilo se připojit k backendu'
    };
  }
}

/**
 * Reads a file from GitHub repository.
 */
export async function readGitHubFileClient(filePath: string): Promise<GitHubReadResult> {
  try {
    const res = await fetch(`/api/github/read?path=${encodeURIComponent(filePath)}`);
    if (!res.ok) {
      return {
        success: false,
        path: filePath,
        error: `Server vrátil chybu ${res.status}`
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      path: filePath,
      error: err.message || 'Chyba při komunikaci se serverem'
    };
  }
}

/**
 * Saves/commits a file to GitHub repository.
 */
export async function saveGitHubFileClient(
  filePath: string,
  content: string,
  commitMessage?: string,
  sha?: string
): Promise<GitHubSaveResult> {
  try {
    const res = await fetch('/api/github/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: filePath,
        content,
        commitMessage,
        sha
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        path: filePath,
        error: data.error || `Server vrátil chybu ${res.status}`
      };
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      path: filePath,
      error: err.message || 'Chyba při uložení do GitHubu'
    };
  }
}
