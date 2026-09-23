import app from '../backend/src/app.js';
import assert from 'assert';

async function runTests() {
  console.log('🧪 Starting Full-Stack Backend Integration Tests...');
  const server = app.listen(5098);

  try {
    const BASE = 'http://localhost:5098/api';
    const ADMIN_KEY = 'shaun2026';

    // 1. Health check
    const healthRes = await fetch(`${BASE}/health`);
    const health = await healthRes.json();
    assert.strictEqual(health.status, 'ok');
    console.log('✅ Test 1: Health check endpoint passed');

    // 2. Fetch portfolio data
    const portRes = await fetch(`${BASE}/portfolio`);
    const portData = await portRes.json();
    assert.strictEqual(portData.success, true);
    assert.strictEqual(portData.data.profile.name, 'Ashaduzzaman Shaun');
    assert.strictEqual(portData.data.contact.linkedin, 'https://www.linkedin.com/in/ashaduzzaman-shaun-4aa737374/');
    assert.ok(portData.data.achievements.length > 0);
    console.log('✅ Test 2: Portfolio retrieval returned Shaun\'s profile & achievements');

    // 3. Auth login with correct passcode
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: ADMIN_KEY })
    });
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    console.log('✅ Test 3: Admin login with passcode succeeded');

    // 4. Auth login with invalid passcode
    const badLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'wrong_pass' })
    });
    assert.strictEqual(badLoginRes.status, 401);
    console.log('✅ Test 4: Admin login rejected invalid passcode (401)');

    // 5. Unauthorized attempt to add achievement
    const unauthRes = await fetch(`${BASE}/portfolio/achievements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Achievement' })
    });
    assert.strictEqual(unauthRes.status, 401);
    console.log('✅ Test 5: Mutating without admin key rejected (401)');

    // 6. Authorized add achievement
    const testAchTitle = `Test Milestone ${Date.now()}`;
    const addAchRes = await fetch(`${BASE}/portfolio/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY
      },
      body: JSON.stringify({
        title: testAchTitle,
        description: 'Testing dynamic CMS achievement insertion',
        year: '2026',
        badge: 'Award'
      })
    });
    assert.strictEqual(addAchRes.status, 201);
    const addedAchData = await addAchRes.json();
    const createdAch = addedAchData.data.achievements.find(a => a.title === testAchTitle);
    assert.ok(createdAch, 'Created achievement should exist');
    console.log('✅ Test 6: Successfully added new achievement to CMS');

    // 7. Authorized delete achievement
    const delAchRes = await fetch(`${BASE}/portfolio/achievements/${createdAch.id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': ADMIN_KEY }
    });
    const delData = await delAchRes.json();
    assert.strictEqual(delData.success, true);
    assert.ok(!delData.data.achievements.some(a => a.id === createdAch.id));
    console.log('✅ Test 7: Successfully deleted test achievement from CMS');

    // 8. Update profile information
    const updateRes = await fetch(`${BASE}/portfolio/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_KEY
      },
      body: JSON.stringify({
        location: 'Dhaka, Bangladesh',
        contact: {
          linkedin: 'https://www.linkedin.com/in/ashaduzzaman-shaun-4aa737374/'
        }
      })
    });
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.success, true);
    assert.strictEqual(updateData.data.profile.location, 'Dhaka, Bangladesh');
    console.log('✅ Test 8: Successfully updated profile information');

    console.log('\n🎉 ALL 8 BACKEND & DATABASE INTEGRATION TESTS PASSED!\n');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
