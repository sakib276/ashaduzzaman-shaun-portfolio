import assert from 'assert';
import { initialPortfolioData } from '../../frontend/src/data/initialData.js';

console.log('Testing Portfolio Controller Data Model...');
assert.ok(Array.isArray(initialPortfolioData.projects));
assert.ok(Array.isArray(initialPortfolioData.experience));
assert.ok(Array.isArray(initialPortfolioData.education));
console.log('✅ Portfolio controller tests passed!');
