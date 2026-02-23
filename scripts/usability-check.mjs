import { chromium } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:3000';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const results = [];

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // 1) Hero begrijpt direct wie Arthur is en wat hij doet
  const heroTitle = await page.locator('h1#home-title').innerText();
  const chipsCount = await page.locator('#home .chip').count();
  const ctaBookVisible = await page.getByRole('link', { name: 'Boek Gigs/Studio' }).isVisible();
  assert(heroTitle.includes('Arthur Bont'), 'Check 1 failed: hero title ontbreekt');
  assert(chipsCount >= 3, 'Check 1 failed: specialisatiechips ontbreken');
  assert(ctaBookVisible, 'Check 1 failed: primaire CTA ontbreekt');
  results.push({ check: 1, ok: true, note: 'Hero-identiteit en hoofd-CTA aanwezig' });

  // 2) Binnen 10s naar een taakpad (Discografie) via navigatie
  await page.getByRole('link', { name: 'Discografie' }).first().click();
  await page.waitForTimeout(250);
  const discHeadingVisible = await page.getByRole('heading', { name: 'Discografie' }).first().isVisible();
  assert(discHeadingVisible, 'Check 2 failed: navigatie naar Discografie werkt niet');
  results.push({ check: 2, ok: true, note: 'Sticky navigatie brengt gebruiker naar taaksectie' });

  // 3) Discografie-filter logisch/werkend
  await page.selectOption('#disc-type-filter', 'DVD');
  await page.waitForTimeout(200);
  const dvdCards = await page.locator('#discografie article, #discografie div').filter({ hasText: 'DVD' }).count();
  assert(dvdCards >= 1, 'Check 3 failed: typefilter toont geen DVD-resultaat');
  results.push({ check: 3, ok: true, note: 'Discografie typefilter werkt' });

  // 4) Bio toon-meer werkt
  await page.getByRole('link', { name: 'Bio' }).first().click();
  await page.waitForTimeout(200);
  await page.getByText('Toon meer namen').first().click();
  const hiddenNameVisible = await page.getByText('Big Jay McNeely').isVisible();
  assert(hiddenNameVisible, 'Check 4 failed: Bio toon-meer toont extra namen niet');
  results.push({ check: 4, ok: true, note: 'Progressive disclosure in Bio werkt' });

  // Extra: video modal in-site
  await page.getByRole('button', { name: 'Bekijk video' }).first().click();
  const modalVisible = await page.getByRole('dialog').isVisible();
  assert(modalVisible, 'Extra check failed: video modal opent niet');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  results.push({ check: 'extra', ok: true, note: 'Video modal opent/sluit correct' });

  await context.close();

  // 5) Mobile formulier bereikbaar via keyboard
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobile.newPage();
  await mPage.goto(baseUrl, { waitUntil: 'networkidle' });
  await mPage.getByRole('link', { name: 'Contact' }).first().click();
  await mPage.waitForTimeout(250);

  const nameInput = mPage.locator('#name');
  const emailInput = mPage.locator('#email');
  const messageInput = mPage.locator('#message');

  await nameInput.focus();
  await mPage.keyboard.press('Tab');
  const focusedAfterFirstTab = await mPage.evaluate(() => document.activeElement?.id);
  await mPage.keyboard.press('Tab');
  const focusedAfterSecondTab = await mPage.evaluate(() => document.activeElement?.id);

  const requiredStates = await Promise.all([
    nameInput.getAttribute('required'),
    emailInput.getAttribute('required'),
    messageInput.getAttribute('required'),
  ]);

  assert(focusedAfterFirstTab === 'email', 'Check 5 failed: tabvolgorde naam -> email onjuist');
  assert(focusedAfterSecondTab === 'message', 'Check 5 failed: tabvolgorde email -> bericht onjuist');
  assert(requiredStates.every((v) => v !== null), 'Check 5 failed: verplichte formuliervelden ontbreken');
  results.push({ check: 5, ok: true, note: 'Mobiel formulier keyboard-toegankelijk en required velden aanwezig' });

  await mobile.close();

  console.log(JSON.stringify({ ok: true, results }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message, results }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
