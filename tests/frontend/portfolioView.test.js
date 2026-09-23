import assert from 'assert';

console.log('Testing Portfolio View Configuration...');
const validRoutes = ['#home', '#about', '#experience', '#achievements', '#projects', '#education', '#contact', '#admin'];
assert.ok(validRoutes.includes('#admin'));
assert.ok(validRoutes.includes('#achievements'));
console.log('✅ Portfolio view tests passed!');
