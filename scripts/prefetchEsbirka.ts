/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * e-Sbírka Pre-fetching CLI Script
 * Downloads and caches key family law & custody statutes from e-Sbírka REST API into local cache.
 */

import dotenv from 'dotenv';
dotenv.config();

import { esbirkaService } from '../src/services/esbirkaService.js';

async function main() {
  console.log('====================================================');
  console.log('   e-Sbírka (MVČR) Pre-fetching Key Statutes Script ');
  console.log('====================================================');

  try {
    const result = await esbirkaService.prefetchKeyStatutes();
    console.log(`\n[SUCCESS] Pre-fetched ${result.totalFetched} key paragraphs!`);
    console.log(`- Source: ${result.source}`);
    console.log(`- Cached Laws: ${result.lawsCount}`);
    console.log(`- Total Cached Entries: ${result.cacheStats.totalEntries}`);
    console.log(`- Cache File: ${result.cacheStats.diskCacheLocation}`);
  } catch (err: any) {
    console.error('[ERROR] Pre-fetching failed:', err.message);
    process.exit(1);
  }
}

main();
