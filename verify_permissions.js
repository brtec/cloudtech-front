const { chromium } = require('playwright');

// Setup test data
const TEST_COMPANY_ID = 'company-123';
const BASE_URL = 'http://localhost:7000';

const USERS = {
  OWNER: 'user-owner',
  ADMIN: 'user-admin',
  MEMBER: 'user-member',
  OTHER_ADMIN: 'user-other-admin',
  OTHER_MEMBER: 'user-other-member'
};

const MEMBERS_DATA = [
  {
    id: 'm-owner',
    role: 'OWNER',
    userId: USERS.OWNER,
    user: { name: 'Owner User', email: 'owner@test.com' },
    createdAt: new Date().toISOString()
  },
  {
    id: 'm-admin',
    role: 'ADMIN',
    userId: USERS.ADMIN,
    user: { name: 'Admin User', email: 'admin@test.com' },
    createdAt: new Date().toISOString()
  },
  {
    id: 'm-member',
    role: 'MEMBER',
    userId: USERS.MEMBER,
    user: { name: 'Member User', email: 'member@test.com' },
    createdAt: new Date().toISOString()
  },
  {
    id: 'm-other-admin',
    role: 'ADMIN',
    userId: USERS.OTHER_ADMIN,
    user: { name: 'Other Admin', email: 'otheradmin@test.com' },
    createdAt: new Date().toISOString()
  },
  {
    id: 'm-other-member',
    role: 'MEMBER',
    userId: USERS.OTHER_MEMBER,
    user: { name: 'Other Member', email: 'othermember@test.com' },
    createdAt: new Date().toISOString()
  }
];

const COMPANY_DATA = {
  id: TEST_COMPANY_ID,
  name: 'Test Company',
  members: MEMBERS_DATA
};

// Helper to mock API
async function setupMock(page) {
  await page.route(`**/companies/${TEST_COMPANY_ID}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: COMPANY_DATA })
    });
  });
}

async function verifyPermissions() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: BASE_URL,
  });

  console.log(`Starting Permission Verification Tests on ${BASE_URL}...`);

  // Test 1: MEMBER View
  try {
    const page = await context.newPage();

    // Set Auth Cookies
    await context.addCookies([
      { name: 'auth-token', value: 'dummy-token', domain: 'localhost', path: '/' },
      { name: 'user-id', value: USERS.MEMBER, domain: 'localhost', path: '/' }
    ]);

    await setupMock(page);
    await page.goto(`/company/${TEST_COMPANY_ID}`);

    await page.waitForSelector('h1:has-text("Test Company")', { timeout: 10000 });

    console.log('[MEMBER] Checking "You" label...');
    // Should see "You" in the Actions column for the current user
    const youLabel = await page.isVisible('text=You');
    if (!youLabel) throw new Error('[MEMBER] FAIL: "You" label not found for current user');
    console.log('[MEMBER] PASS: "You" label found');

    // Check that "Admin" label is NOT used for current user
    const adminLabelOnSelf = await page.locator('tr', { hasText: 'member@test.com' }).locator('text=Admin').count();
    if (adminLabelOnSelf > 0) throw new Error('[MEMBER] FAIL: "Admin" label found on current user (should be "You")');
    console.log('[MEMBER] PASS: "Admin" label not on current user');

    console.log('[MEMBER] Checking Invite Button...');
    const inviteBtn = await page.isVisible('button:has-text("Invite Member")');
    if (inviteBtn) throw new Error('[MEMBER] FAIL: Invite button is visible');
    console.log('[MEMBER] PASS: Invite button hidden');

    console.log('[MEMBER] Checking Role Editing...');
    const selects = await page.$$('table select');
    if (selects.length > 0) throw new Error('[MEMBER] FAIL: Found select inputs for roles');
    console.log('[MEMBER] PASS: No role selects found');

    await page.close();
  } catch (e) {
    console.error('[MEMBER] Test Failed:', e);
    throw e;
  }

  await browser.close();
  console.log('All Permission Tests Passed!');
}

verifyPermissions().catch(err => {
  console.error(err);
  process.exit(1);
});
