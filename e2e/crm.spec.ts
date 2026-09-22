import { test, expect } from "@playwright/test";

// Synthetic prefix required by the workflow: DEMO-<requirement-id>-<run-id>.
// A per-process suffix keeps a row unambiguous across reruns against a shared
// database.
const requirementId = "REQ-A8-127";
const runId = process.env.BUSINESS_DIRECT_E2E_RUN_ID ?? "local";
const suffix = Math.random().toString(36).slice(2, 8);
const brand = `DEMO-${requirementId}-${runId}-${suffix}`;

const approval = process.env.BUSINESS_DIRECT_E2E_TARGET_APPROVAL;
if (approval && !brand.startsWith(approval)) {
  throw new Error(`E2E synthetic prefix "${brand}" does not match approval prefix "${approval}"`);
}

const companyName = `${brand}-acme`;
const companyContact = `${brand}-contact`;
const buyerName = `${brand}-buyer`;
const bdEmail = `${brand}-bd@example.com`;

test("key path: create draft -> edit -> submit -> list -> read-only", async ({ page }) => {
  // 1. Create a draft via the new-customer form.
  await page.goto("/customers/new");
  await page.getByLabel("Company name").fill(companyName);
  await page.getByLabel("Company contact").fill(companyContact);
  await page.getByLabel("Cooperating buyer").fill(buyerName);
  await page.getByLabel("BD email").fill(bdEmail);
  await page.getByRole("button", { name: "Save draft" }).click();

  // Redirected to the list; the new record is visible in draft status.
  await expect(page).toHaveURL(/\/$/);
  const row = page.getByRole("row", { name: new RegExp(companyName) });
  await expect(row).toBeVisible();
  await expect(row.getByText("draft")).toBeVisible();

  // 2. Open the record and edit it.
  await row.getByRole("link", { name: companyName }).click();
  await page.getByRole("link", { name: "Edit" }).click();
  await page.getByLabel("Company name").fill(`${companyName}-edited`);
  await page.getByRole("button", { name: "Save changes" }).click();

  // Back on the detail page, edited company name is shown.
  await expect(page).toHaveURL(/\/customers\//);
  await expect(page.getByRole("heading", { name: `${companyName}-edited` })).toBeVisible();

  // 3. Submit the draft.
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("submitted")).toBeVisible();
  await expect(page.getByText(/read-only/)).toBeVisible();

  // 4. List shows the submitted record.
  await page.goto("/");
  const submittedRow = page.getByRole("row", { name: new RegExp(`${companyName}-edited`) });
  await expect(submittedRow).toBeVisible();
  await expect(submittedRow.getByText("submitted")).toBeVisible();

  // 5. Reopen the record: no Edit / Submit controls remain (read-only).
  await submittedRow.getByRole("link", { name: `${companyName}-edited` }).click();
  await expect(page.getByText(/read-only/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Submit" })).toHaveCount(0);
});
