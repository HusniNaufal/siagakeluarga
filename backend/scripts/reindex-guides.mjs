import 'dotenv/config';
import { reindexGuides } from '../src/services/ai.service.js';

const r = await reindexGuides();
console.log(JSON.stringify(r, null, 2));
process.exit(r.failed.length ? 1 : 0);
