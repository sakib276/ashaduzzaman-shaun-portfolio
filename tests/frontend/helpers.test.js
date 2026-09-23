import assert from 'assert';
import { initialPortfolioData } from '../../frontend/src/data/initialData.js';

console.log('Testing Frontend Initial Data...');
assert.strictEqual(initialPortfolioData.profile.name, 'Ashaduzzaman Shaun');
assert.strictEqual(initialPortfolioData.profile.image, '/profile.png');
assert.strictEqual(initialPortfolioData.contact.linkedin, 'https://www.linkedin.com/in/ashaduzzaman-shaun-4aa737374/');
assert.ok(initialPortfolioData.achievements.length >= 3);
console.log('✅ Frontend initial data tests passed!');
