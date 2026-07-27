/**
 * ============================================================================
 * SYNTHESIS TESTER - Standalone QA Agent & Uptime Diagnostics Client
 * ============================================================================
 * Independent QA agent script for monitoring "Táta má právo" (https://tatovacesta.vercel.app).
 * Connects securely to /api/testing-bridge via Bearer token authorization.
 * 
 * Usage:
 *   npx tsx scripts/synthesis-tester.ts
 *   TARGET_URL=https://tatovacesta.vercel.app TESTER_SECRET_KEY=my_secret npx tsx scripts/synthesis-tester.ts
 *   npm run test:qa
 */

import dotenv from 'dotenv';
dotenv.config();

// Configuration
const TARGET_URL = (process.env.TARGET_URL || process.env.APP_URL || 'https://tatovacesta.vercel.app').replace(/\/$/, '');
const TESTER_SECRET_KEY = process.env.TESTER_SECRET_KEY || process.env.VITE_TESTER_SECRET_KEY || 'synthesis-tester-default-secret-key-2026';

interface QAModuleResult {
  id: string;
  name: string;
  status: string;
  description?: string;
  details?: string;
  latencyMs?: number;
}

interface TestingBridgeResponse {
  success: boolean;
  service: string;
  targetUrl: string;
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  responseTimeMs: number;
  environment: {
    nodeVersion: string;
    platform: string;
    uptimeSeconds: number;
    envChecks: Record<string, boolean>;
  };
  database: {
    supabase: string;
    firebase: string;
    localAuditLogs?: {
      status: string;
      totalEntries: number;
    };
  };
  modules: Record<string, QAModuleResult>;
  diagnosticsSummary: string;
  error?: string;
}

// Color formatting for console
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bgRed: '\x1b[41m\x1b[37m',
  bgGreen: '\x1b[42m\x1b[30m',
  bgYellow: '\x1b[43m\x1b[30m'
};

async function runHealthCheck(baseUrl: string): Promise<{ ok: boolean; latencyMs: number; data?: any }> {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: { 'User-Agent': 'Synthesis-Tester-QA-Agent/1.0' }
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      return { ok: true, latencyMs, data };
    }
    return { ok: false, latencyMs };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

async function fetchTestingBridge(baseUrl: string, secretKey: string): Promise<{ ok: boolean; latencyMs: number; data?: TestingBridgeResponse; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/api/testing-bridge`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Synthesis-Tester-QA-Agent/1.0'
      }
    });

    const latencyMs = Date.now() - start;
    const data = await res.json();

    if (res.status === 200 && data.success) {
      return { ok: true, latencyMs, data };
    } else {
      return { ok: false, latencyMs, data, error: data.error || `HTTP ${res.status}` };
    }
  } catch (err: any) {
    return { ok: false, latencyMs: Date.now() - start, error: err.message || 'Nepodařilo se připojit k bráně' };
  }
}

async function runAiAssistantPing(baseUrl: string): Promise<{ ok: boolean; latencyMs: number; textSnippet?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Synthesis-Tester-QA-Agent/1.0'
      },
      body: JSON.stringify({ message: 'QA Test ping: Jaké je základní právo dítěte na péči obou rodičů?' })
    });

    const latencyMs = Date.now() - start;
    if (res.ok) {
      const data = await res.json();
      return { ok: data.success !== false, latencyMs, textSnippet: (data.text || '').substring(0, 120) };
    }
    return { ok: false, latencyMs };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

function generateMarkdownReport(
  targetUrl: string,
  bridgeData?: TestingBridgeResponse,
  healthCheckOk?: boolean,
  aiPingOk?: boolean,
  errorMessage?: string
): string {
  const now = new Date().toISOString();
  const isHealthy = bridgeData?.status === 'healthy' && healthCheckOk;
  const isDegraded = bridgeData?.status === 'degraded' || !aiPingOk;
  const statusBadge = isHealthy ? '🟢 V POŘÁDKU (HEALTHY)' : isDegraded ? '🟡 ČÁSTEČNÉ OMEZENÍ (DEGRADED)' : '🔴 KRITICKÝ VÝPADEK (CRITICAL)';

  let report = `# 🛡️ QA DIAGNOSTICKÝ REPORT - SYNTHESIS TESTER\n\n`;
  report += `**Cílová aplikace:** ${targetUrl}\n`;
  report += `**Čas kontroly:** ${now}\n`;
  report += `**Celkový stav webu:** ${statusBadge}\n\n`;

  report += `--- \n\n`;
  report += `## 📊 1. PREHLEDU KLÍČOVÝCH MODULŮ A SLUŽEB\n\n`;
  report += `| Modul / Služba | Stav | Popis & Diagnostika | Odezva |\n`;
  report += `| :--- | :---: | :--- | :---: |\n`;

  report += `| **Základní API endpoint (/api/health)** | ${healthCheckOk ? '✅ OK' : '❌ CHYBA'} | Základní dostupnost HTTP serveru | ${bridgeData?.responseTimeMs || 0} ms |\n`;

  if (bridgeData?.modules) {
    Object.values(bridgeData.modules).forEach((mod) => {
      const icon = mod.status === 'operational' ? '✅ OK' : mod.status === 'notice' ? 'ℹ️ NOTICE' : '⚠️ VAROVÁNÍ';
      report += `| **${mod.name}** | ${icon} | ${mod.details || mod.description || '-'} | ${mod.latencyMs ? `${mod.latencyMs} ms` : '-'} |\n`;
    } );
  }

  report += `| **AI Právní Asistent (Gemini Chat)** | ${aiPingOk ? '✅ OK' : '⚠️ ZÁLOHA'} | Test syntetické odpovědi AI asistenta | - |\n`;

  report += `\n## 🔧 2. KONFIGURACE PROSTŘEDÍ & DATABÁZE\n\n`;
  if (bridgeData?.environment) {
    const env = bridgeData.environment.envChecks;
    report += `- **Node.js runtime:** \`${bridgeData.environment.nodeVersion}\` (${bridgeData.environment.platform})\n`;
    report += `- **Supabase databáze:** ${bridgeData.database.supabase === 'connected' ? '✅ Připojeno' : 'ℹ️ Použito lokální úložiště'}\n`;
    report += `- **Firebase projekty:** ${bridgeData.database.firebase === 'connected' ? '✅ Konfigurováno' : 'ℹ️ Nepoužito'}\n`;
    report += `- **Gemini API Klíč:** ${env.geminiKey ? '✅ Nastaven (Aktivní)' : '⚠️ Chybí (Aktivní lokální AI záloha)'}\n`;
    report += `- **GitHub Token:** ${env.githubTokenSet ? '✅ Propojeno s repozitářem' : 'ℹ️ Pouze lokální zápis'}\n`;
    report += `- **Resend Email API:** ${env.resendKeySet ? '✅ Aktivní' : 'ℹ️ Simulace doručování'}\n`;
  } else {
    report += `⚠️ Diagnostické údaje z brány se nepodařilo načíst: ${errorMessage || 'Neznámá chyba'}\n`;
  }

  report += `\n## 💡 3. DOPORUČENÉ KROKY PRO SPRÁVCE\n\n`;
  if (isHealthy) {
    report += `✓ Všechny moduly portálu "Táta má právo" fungují v pořádku bez zjištěných chyb.\n`;
    report += `✓ Není vyžadován žádný manuální zásah administrátora.\n`;
  } else {
    report += `1. **Zkontrolujte proměnné prostředí (Settings > Secrets):** Ujistěte se, že \`GEMINI_API_KEY\` a \`TESTER_SECRET_KEY\` jsou platné.\n`;
    report += `2. **Overte připojení k databázi Supabase:** Zkontrolujte \`VITE_SUPABASE_URL\` a anon klic v nastavení.\n`;
    report += `3. **Detail chybového hlášení:** ${errorMessage || bridgeData?.error || 'Zkontrolovat logy serveru.'}\n`;
  }

  report += `\n---\n*Vygenerováno automatickým QA agentem Synthesis Tester.*`;
  return report;
}

export async function runSynthesisQaAudit() {
  console.log(`\n${colors.cyan}${colors.bold}=====================================================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold} 🛡️ SYNTHESIS TESTER - QA AGENT MONITORING PORTÁLU TÁTA MÁ PRÁVO${colors.reset}`);
  console.log(`${colors.cyan}${colors.bold}=====================================================================${colors.reset}\n`);

  console.log(`${colors.dim}Cílová URL:${colors.reset} ${colors.bold}${TARGET_URL}${colors.reset}`);
  console.log(`${colors.dim}Ověřovací klíč:${colors.reset} ${TESTER_SECRET_KEY.substring(0, 6)}***\n`);

  // Step 1: Check basic health endpoint
  process.stdout.write(`[1/3] Testování základního endpointu /api/health... `);
  const healthRes = await runHealthCheck(TARGET_URL);
  if (healthRes.ok) {
    console.log(`${colors.green}${colors.bold}PASSED${colors.reset} (${healthRes.latencyMs} ms)`);
  } else {
    console.log(`${colors.red}${colors.bold}FAILED${colors.reset} (${healthRes.latencyMs} ms)`);
  }

  // Step 2: Query secure Testing Bridge endpoint
  process.stdout.write(`[2/3] Připojování k zabezpečené bráně /api/testing-bridge... `);
  const bridgeRes = await fetchTestingBridge(TARGET_URL, TESTER_SECRET_KEY);
  if (bridgeRes.ok && bridgeRes.data) {
    console.log(`${colors.green}${colors.bold}PASSED${colors.reset} (${bridgeRes.latencyMs} ms)`);
  } else {
    console.log(`${colors.red}${colors.bold}FAILED${colors.reset} (${bridgeRes.latencyMs} ms) - ${bridgeRes.error || 'Unauthorized'}`);
  }

  // Step 3: Ping AI Assistant Chat route
  process.stdout.write(`[3/3] Testování odezvy AI asistenta (/api/chat)... `);
  const aiRes = await runAiAssistantPing(TARGET_URL);
  if (aiRes.ok) {
    console.log(`${colors.green}${colors.bold}PASSED${colors.reset} (${aiRes.latencyMs} ms)`);
  } else {
    console.log(`${colors.yellow}${colors.bold}DEGRADED / FALLBACK${colors.reset} (${aiRes.latencyMs} ms)`);
  }

  // Output Executive Terminal Table
  console.log(`\n${colors.bold}---------------------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}📊 VÝSLEDKY SYSTEMOVÉ DIAGNOSTIKY:${colors.reset}`);
  console.log(`${colors.bold}---------------------------------------------------------------------${colors.reset}`);

  if (bridgeRes.data) {
    const d = bridgeRes.data;
    console.log(`• Celkový stav:         ${d.status === 'healthy' ? colors.green + '🟢 HEALTHY' : colors.yellow + '🟡 DEGRADED'} ${colors.reset}`);
    console.log(`• Node.js verze:        ${d.environment.nodeVersion} (${d.environment.platform})`);
    console.log(`• Supabase spojení:     ${d.database.supabase === 'connected' ? colors.green + 'Connected' : colors.yellow + 'Offline / Local'} ${colors.reset}`);
    console.log(`• GEMINI AI klíč:       ${d.environment.envChecks.geminiKey ? colors.green + 'Aktivní' : colors.yellow + 'Chybí klíč (Záloha)'} ${colors.reset}`);
    console.log(`• Kalendář a spisy:     ${d.modules.calendar_and_case_files?.status || 'OK'}`);
    console.log(`• Co-Parenting Hub:     ${d.modules.coparenting_hub?.status || 'OK'}`);
    console.log(`• AI Právní Asistent:   ${d.modules.ai_assistant?.status || 'OK'}`);
  } else {
    console.log(`${colors.red}❌ Nepodařilo se dekódovat data z brány: ${bridgeRes.error}${colors.reset}`);
  }

  // Generate Markdown report
  const markdownReport = generateMarkdownReport(
    TARGET_URL,
    bridgeRes.data,
    healthRes.ok,
    aiRes.ok,
    bridgeRes.error
  );

  console.log(`\n${colors.bold}---------------------------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}📝 FORMÁTOVANÝ STRUKTUROVANÝ REPORT PRO SPRÁVCE:${colors.reset}`);
  console.log(`${colors.bold}---------------------------------------------------------------------${colors.reset}\n`);
  console.log(markdownReport);
  console.log(`\n${colors.cyan}=====================================================================${colors.reset}\n`);

  return {
    success: healthRes.ok && bridgeRes.ok,
    bridgeData: bridgeRes.data,
    reportMarkdown: markdownReport
  };
}

// Auto-run if executed directly via CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('synthesis-tester.ts')) {
  runSynthesisQaAudit().catch((err) => {
    console.error('Fatal error running Synthesis Tester QA script:', err);
    process.exit(1);
  });
}
