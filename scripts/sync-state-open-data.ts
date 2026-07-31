import stateDataSyncService from '../server/stateDataSyncService.js';

/**
 * Automated script to synchronize state open data (ČSÚ, MPSV, e-Sbírka, MS ČR)
 * Can be executed via Cron, CLI (`npx tsx scripts/sync-state-open-data.ts`) or API trigger.
 */
async function runStateDataSync() {
  console.log('===============================================================');
  console.log('  TÁTA MÁ PRÁVO - AUTOMATICKÁ SYNCHRONIZACE OTEVŘENÝCH DAT     ');
  console.log('  Zdroj: ČSÚ DataStat, MPSV Registr, e-Sbírka MV ČR, MS ČR     ');
  console.log('===============================================================');

  try {
    const result = await stateDataSyncService.syncAllStateData();
    console.log(`\n[STATUS]: ${result.success ? 'ÚSPĚCH ✅' : 'CHYBA ❌'}`);
    console.log(`[ČAS HODNOTY]: ${result.syncedAt}`);
    console.log(`[SOUHRN]: ${result.message}`);
    console.log(`[POČET ZÁKONŮ E-SBÍRKY]: ${result.lawsCount}`);
    console.log(`[POČET PARAGRAFŮ]: ${result.paragraphsCount}`);

    const stats = stateDataSyncService.getStatistics();
    console.log('\n--- AKTUÁLNÍ STATISTICKÉ METRIKY ČSÚ & MPSV ---');
    console.log(`- Střídavá péče v ČR (2024/2025): ${stats.summaryMetrics.alternatingCustodyPercent} %`);
    console.log(`- Výhradní péče matky: ${stats.summaryMetrics.motherCustodyPercent} %`);
    console.log(`- Výhradní péče otce: ${stats.summaryMetrics.fatherCustodyPercent} %`);
    console.log(`- Průměrná délka soudního řízení: ${stats.summaryMetrics.avgCourtDurationMonths} měsíců`);
    console.log(`- Průměrné výživné na dítě: ${stats.summaryMetrics.avgAlimonyPerChildCzK} Kč`);
    console.log(`- Celkem vyřešených případů: ${stats.summaryMetrics.totalCustodyCases2024}`);

    console.log('===============================================================');
  } catch (error: any) {
    console.error('[CRITICAL FAILURE] Synchronizace selhala:', error.message);
    process.exit(1);
  }
}

runStateDataSync();
