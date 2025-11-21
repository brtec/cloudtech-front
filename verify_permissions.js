const { chromium } = require('playwright');

// Setup test data
const TEST_COMPANY_ID = 'company-123';
const BASE_URL = 'http://localhost:7000'; // Updated port

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

    console.log('[MEMBER] Checking Invite Button...');
    const inviteBtn = await page.isVisible('button:has-text("Invite Member")');
    if (inviteBtn) throw new Error('[MEMBER] FAIL: Invite button is visible');
    console.log('[MEMBER] PASS: Invite button hidden');

    console.log('[MEMBER] Checking Role Editing...');
    const selects = await page.$$('table select');
    if (selects.length > 0) throw new Error('[MEMBER] FAIL: Found select inputs for roles');
    console.log('[MEMBER] PASS: No role selects found');

    console.log('[MEMBER] Checking Remove Actions...');
    const removeBtns = await page.$$('button:has-text("Remove")');
    if (removeBtns.length > 0) throw new Error('[MEMBER] FAIL: Found Remove buttons');

    const locked = await page.isVisible('text=Locked');
    if (!locked) console.warn('[MEMBER] WARN: "Locked" text not found');

    console.log('[MEMBER] PASS: No remove buttons found');
    await page.close();
  } catch (e) {
    console.error('[MEMBER] Test Failed:', e);
    throw e;
  }

  // Test 2: ADMIN View
  try {
    const page = await context.newPage();

    await context.addCookies([
      { name: 'auth-token', value: 'dummy-token', domain: 'localhost', path: '/' },
      { name: 'user-id', value: USERS.ADMIN, domain: 'localhost', path: '/' }
    ]);

    await setupMock(page);
    await page.goto(`/company/${TEST_COMPANY_ID}`);
    await page.waitForSelector('h1:has-text("Test Company")');

    console.log('[ADMIN] Checking Invite Button...');
    if (!await page.isVisible('button:has-text("Invite Member")'))
        throw new Error('[ADMIN] FAIL: Invite button missing');
    console.log('[ADMIN] PASS: Invite button visible');

    console.log('[ADMIN] Checking permissions for Target: MEMBER...');
    const memberRow = page.locator('tr', { hasText: 'othermember@test.com' });
    await memberRow.waitFor();
    if (!await memberRow.locator('select').isVisible())
        throw new Error('[ADMIN] FAIL: Cannot edit role of MEMBER');
    if (!await memberRow.locator('button:has-text("Remove")').isVisible())
        throw new Error('[ADMIN] FAIL: Cannot remove MEMBER');
    console.log('[ADMIN] PASS: Can manage MEMBER');

    console.log('[ADMIN] Checking permissions for Target: ADMIN...');
    const adminRow = page.locator('tr', { hasText: 'otheradmin@test.com' });
    await adminRow.waitFor();
    if (await adminRow.locator('select').isVisible())
        throw new Error('[ADMIN] FAIL: Can edit role of ADMIN');
    if (await adminRow.locator('button:has-text("Remove")').isVisible())
        throw new Error('[ADMIN] FAIL: Can remove ADMIN');
    console.log('[ADMIN] PASS: Cannot manage ADMIN');

    console.log('[ADMIN] Checking permissions for Target: OWNER...');
    const ownerRow = page.locator('tr', { hasText: 'owner@test.com' });
    await ownerRow.waitFor();
    if (await ownerRow.locator('select').isVisible())
        throw new Error('[ADMIN] FAIL: Can edit role of OWNER');
    console.log('[ADMIN] PASS: Cannot manage OWNER');

    await page.close();
  } catch (e) {
    console.error('[ADMIN] Test Failed:', e);
    throw e;
  }

  // Test 3: OWNER View
  try {
    const page = await context.newPage();

    await context.addCookies([
      { name: 'auth-token', value: 'dummy-token', domain: 'localhost', path: '/' },
      { name: 'user-id', value: USERS.OWNER, domain: 'localhost', path: '/' }
    ]);

    await setupMock(page);
    await page.goto(`/company/${TEST_COMPANY_ID}`);
    await page.waitForSelector('h1:has-text("Test Company")');

    console.log('[OWNER] Checking permissions for Target: ADMIN...');
    const adminRow = page.locator('tr', { hasText: 'otheradmin@test.com' });
    await adminRow.waitFor();
    if (!await adminRow.locator('select').isVisible())
        throw new Error('[OWNER] FAIL: Cannot edit role of ADMIN');
    if (!await adminRow.locator('button:has-text("Remove")').isVisible())
        throw new Error('[OWNER] FAIL: Cannot remove ADMIN');
    console.log('[OWNER] PASS: Can manage ADMIN');

    await page.close();
  } catch (e) {
    console.error('[OWNER] Test Failed:', e);
    throw e;
  }

  await browser.close();
  console.log('All Permission Tests Passed!');
}

verifyPermissions().catch(err => {
  console.error(err);
  process.exit(1);
});
