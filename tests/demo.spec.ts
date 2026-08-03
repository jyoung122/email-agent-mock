import { expect, test, type Page } from '@playwright/test'

const dismissWelcome = async (page: Page) => {
  const welcome = page.getByRole('dialog', { name: 'Welcome to ORA Correspondence' })
  if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'Explore current screen' }).click()
}

test('guided demo explains the cross-screen workflow and can restart', async ({ page }) => {
  await page.goto('/')
  const welcome = page.getByRole('dialog', { name: 'Welcome to ORA Correspondence' })
  await welcome.getByRole('button', { name: 'Start guided demo' }).click()

  const tour = page.locator('.guided-tour__card')
  await expect(tour).toBeVisible()
  await expect(tour).toContainText('Step 1 of 8')
  await expect(tour).toContainText('See the whole correspondence operation')
  await expect(page.locator('.guided-tour__spotlight')).toBeVisible()

  await tour.getByRole('button', { name: 'Next' }).click()
  await expect(page.getByRole('heading', { name: 'Work Queue', exact: true })).toBeVisible()
  await expect(tour).toContainText('Bring every request into one work queue')

  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('heading', { name: 'Proposed response' })).toBeVisible()
  await expect(tour).toContainText('Review the proposed response in context')

  await page.keyboard.press('ArrowRight')
  await expect(tour).toContainText('Classify documents against configured forms')
  await page.keyboard.press('ArrowLeft')
  await expect(tour).toContainText('Review the proposed response in context')

  for (const expectedTitle of [
    'Classify documents against configured forms',
    'Deliver only after safeguards are satisfied',
    'Make approved guidance traceable',
    'Tune automation to institutional risk',
    'Turn QA feedback into accountable improvements',
  ]) {
    await tour.getByRole('button', { name: 'Next' }).click()
    await expect(tour).toContainText(expectedTitle)
  }
  await expect(tour).toContainText('Step 8 of 8')
  await tour.getByRole('button', { name: 'Finish' }).click()
  await expect(tour).toBeHidden()

  await page.getByRole('button', { name: 'Start guided demo' }).click()
  await expect(tour).toContainText('Step 1 of 8')
  await page.evaluate(() => {
    document.querySelector('[data-tour="dashboard-overview"]')?.remove()
    window.dispatchEvent(new Event('resize'))
  })
  await expect(tour).toContainText('This screen loaded without the expected highlight', { timeout: 2_000 })
  await tour.getByRole('button', { name: 'Continue' }).click()
  await expect(tour).toContainText('Step 2 of 8')
  await page.keyboard.press('Escape')
  await expect(tour).toBeHidden()
  await expect(page.getByRole('button', { name: 'Start guided demo' })).toBeFocused()
})

test('all primary routes render without browser errors', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()) })
  page.on('pageerror', (error) => browserErrors.push(error.message))
  const routes: Array<[string, string, string]> = [
    ['/', 'Program dashboard', 'Program Dashboard'],
    ['/work-queue', 'Work Queue', 'Work Queue'],
    ['/release-queue', 'Delivery Queue', 'Delivery Queue'],
    ['/agent-controls', 'Agent Controls', 'Agent Controls'],
    ['/improvement-queue', 'Improvement Queue', 'Improvement Queue'],
    ['/knowledge', 'Knowledge', 'Knowledge'],
    ['/reporting', 'Program reporting', 'Reporting'],
    ['/administration', 'Administration', 'Administration'],
  ]
  for (const [index, [route, heading, guideName]] of routes.entries()) {
    await page.goto(route)
    if (index === 0) {
      const welcome = page.getByRole('dialog', { name: 'Welcome to ORA Correspondence' })
      await expect(welcome.getByRole('heading', { name: 'The business problem' })).toBeVisible()
      await expect(welcome).toContainText('Everything is fictional and browser-local')
      await expect(welcome).toContainText('About this screen')
      await welcome.getByRole('button', { name: 'Explore current screen' }).click()
    }
    await expect(page.getByRole('dialog', { name: 'Welcome to ORA Correspondence' })).toBeHidden()
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
    await expect(page.getByText('Demonstration Environment — Fictional Data')).toBeVisible()
    await page.getByRole('button', { name: 'About this screen' }).click()
    const guide = page.getByRole('dialog', { name: `About ${guideName}` })
    await expect(guide.getByRole('heading', { name: 'What is on this screen' })).toBeVisible()
    await expect(guide.getByRole('heading', { name: 'Business case' })).toBeVisible()
    await expect(guide.getByRole('heading', { name: 'Problem and pain solved' })).toBeVisible()
    await expect(guide.getByRole('heading', { name: 'What could be added' })).toBeVisible()
    await guide.getByRole('button', { name: 'Got it' }).click()
  }
  expect(browserErrors).toEqual([])
})

test('leadership transcript workflow completes and resets', async ({ page }) => {
  await page.goto('/work-queue')
  await dismissWelcome(page)
  await page.getByRole('row', { name: 'Open Transcript request for graduate application from Alex Harper' }).click()
  await expect(page.getByText('Selected for review through random QA sampling')).toBeVisible()
  await expect(page.getByText('Authorization form is missing a signature')).toBeVisible()
  await page.getByRole('button', { name: 'About this screen' }).click()
  await expect(page.getByRole('dialog', { name: 'About Response Workbench' })).toContainText('Attachment cards that open classification and extraction in a modal')
  await page.getByRole('dialog', { name: 'About Response Workbench' }).getByRole('button', { name: 'Got it' }).click()

  await page.getByRole('button', { name: 'Make warmer' }).click()
  await expect(page.getByLabel('Response body')).toContainText('glad to help')
  await page.getByRole('button', { name: /Transcript_Authorization_Alex_Harper/ }).click()
  const reviewDialog = page.getByRole('dialog', { name: 'Attachment review' })
  await expect(reviewDialog).toBeVisible()
  await expect(reviewDialog.getByRole('heading', { name: 'Attachment review' })).toBeVisible()

  const signatureRow = page.locator('article.field-row').filter({ hasText: 'Signature present' })
  await signatureRow.getByRole('button', { name: 'Edit' }).click()
  await signatureRow.getByRole('textbox').fill('Alex Harper — simulated signature')
  await signatureRow.getByRole('button', { name: 'Save' }).click()
  await expect(signatureRow.getByText('Valid', { exact: true })).toBeVisible()

  await reviewDialog.getByRole('button', { name: /graduate_application_portal_capture\.png/ }).click()
  await expect(page.getByText('No configured form match', { exact: true }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Keep as supporting' }).click()
  await expect(page.getByRole('heading', { name: 'No extraction required' })).toBeVisible()
  await reviewDialog.getByRole('button', { name: /Transcript_Authorization_Alex_Harper\.pdf/ }).click()
  await reviewDialog.getByRole('button', { name: 'Close review' }).click()
  await expect(page.getByRole('dialog', { name: 'Attachment review' })).toBeHidden()

  await page.getByRole('button', { name: 'Approve for delivery' }).click()
  await expect(page.getByText('Approved for delivery. The QA outcome was captured in Improvement Queue.')).toBeVisible()
  await page.getByRole('link', { name: /Delivery Queue/ }).click()
  const registrarBatch = page.getByRole('row', { name: /Registrar · Aug 2 afternoon delivery/ })
  await expect(registrarBatch).toContainText('1')

  await page.getByRole('link', { name: 'Knowledge' }).click()
  await page.getByRole('button', { name: 'Mark policy changed' }).click()
  await page.getByRole('button', { name: /Increase QA to 100%/ }).click()
  await page.getByRole('button', { name: 'Apply selected action' }).click()
  await expect(page.getByText('Transcript policy change is active')).toBeVisible()

  await page.getByRole('link', { name: /Agent Controls/ }).click()
  await expect(page.getByText('Current mode: Knowledge Change')).toBeVisible()
  await page.getByRole('link', { name: /Delivery Queue/ }).click()
  await expect(page.getByRole('row', { name: /Registrar · Aug 2 afternoon delivery/ })).toContainText('100%')
  await expect(page.getByRole('row', { name: /Registrar · Aug 2 afternoon delivery/ })).toContainText('Held')

  await page.getByRole('button', { name: 'Reset Demo' }).click()
  const resetDialog = page.getByRole('dialog', { name: 'Reset demonstration?' })
  await resetDialog.getByRole('button', { name: 'Reset Demo' }).click()
  await expect(page.getByRole('row', { name: /Registrar · Aug 2 afternoon delivery/ })).toContainText('20%')
  await expect(page.getByRole('row', { name: /Registrar · Aug 2 afternoon delivery/ })).toContainText('Scheduled')
})

test('qa feedback drives an evaluated, human-approved, reversible improvement', async ({ page }) => {
  await page.goto('/work-queue/email-transcript-001')
  await dismissWelcome(page)
  await page.getByRole('button', { name: 'Make warmer' }).click()
  await page.getByRole('button', { name: 'Approve for delivery' }).click()
  await expect(page.getByText('Approved for delivery. The QA outcome was captured in Improvement Queue.')).toBeVisible()

  await page.getByRole('link', { name: /Improvement Queue/ }).click()
  await expect(page.getByRole('heading', { name: 'Improvement Queue', exact: true })).toBeVisible()
  await expect(page.getByText('No silent self-training', { exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'QA feedback captured: 6' })).toBeVisible()

  const detail = page.locator('.detail-panel')
  await expect(detail.getByRole('heading', { name: 'Student-facing response tone' })).toBeVisible()
  await expect(page.locator('.proposal-panel')).toContainText('15 supporting observations')
  await detail.getByRole('button', { name: 'Run simulated evaluation' }).click()
  await expect(detail.getByText('Evaluated', { exact: true })).toBeVisible()
  await expect(detail).toContainText('15 governed observations')
  await expect(detail).toContainText('Projected outcome')

  await detail.getByRole('button', { name: 'Approve and activate' }).click()
  const activateDialog = page.getByRole('dialog', { name: 'Approve and activate this improvement?' })
  await activateDialog.getByRole('button', { name: 'Approve and activate' }).click()
  await expect(page.locator('.active-version')).toContainText('agent-v1.5-tone')
  await expect(detail.getByText('Active', { exact: true })).toBeVisible()

  await detail.getByRole('button', { name: 'Roll back version' }).click()
  const rollbackDialog = page.getByRole('dialog', { name: 'Roll back this improvement?' })
  await rollbackDialog.getByRole('button', { name: 'Roll back version' }).click()
  await expect(page.locator('.active-version')).toContainText('agent-v1.4')
  await expect(detail.getByText('Rolled back', { exact: true })).toBeVisible()
  await expect(page.getByText('agent-v1.5-tone was rolled back to agent-v1.4.')).toBeVisible()
})

test('queue filtering and simulated batch delivery work', async ({ page }) => {
  await page.goto('/work-queue')
  await dismissWelcome(page)
  await page.getByPlaceholder('Search sender, subject, mailbox…').fill('Quinn Brooks')
  await expect(page.getByText('Showing 1 of 22 messages')).toBeVisible()
  await expect(page.getByRole('row', { name: /Quinn Brooks/ })).toBeVisible()
  await page.getByPlaceholder('Search sender, subject, mailbox…').fill('')

  await page.getByRole('row', { name: 'Open Transcript request for graduate application from Alex Harper' }).click()
  await page.getByRole('button', { name: 'Approve for delivery' }).click()
  await page.getByRole('link', { name: /Delivery Queue/ }).click()
  await page.getByRole('button', { name: 'Send approved' }).click()
  await page.getByRole('dialog', { name: 'Send approved responses?' }).getByRole('button', { name: 'Send 1 response' }).click()
  await expect(page.getByRole('row', { name: /Registrar · Aug 2 afternoon delivery/ })).toContainText('Delivered')

  await page.getByRole('button', { name: 'Reset Demo' }).click()
  await page.getByRole('dialog', { name: 'Reset demonstration?' }).getByRole('button', { name: 'Reset Demo' }).click()
})

test('configured form catalog drives attachment remapping', async ({ page }) => {
  await page.goto('/work-queue/email-transcript-001')
  await dismissWelcome(page)
  await page.getByRole('button', { name: /graduate_application_portal_capture\.png/ }).click()
  await expect(page.getByRole('dialog', { name: 'Attachment review' })).toBeVisible()
  await page.getByLabel('Configured form definition').selectOption('form-definition-transcript-auth')
  await page.getByRole('button', { name: 'Confirm classification' }).click()
  await expect(page.getByRole('heading', { name: 'Official Transcript Authorization' })).toBeVisible()
  await expect(page.locator('article.field-row')).toHaveCount(8)
  await expect(page.getByText('Classification confirmed against Official Transcript Authorization.')).toBeVisible()

  await page.goto('/administration')
  await page.getByRole('button', { name: /^Form types/ }).click()
  await expect(page.getByRole('row', { name: /Official Transcript Authorization/ })).toContainText('v2026.1')
  await expect(page.getByRole('row', { name: /Financial Aid Verification/ })).toContainText('Extract ≥ 84%')
  await page.getByRole('button', { name: /^Canonical fields/ }).click()
  await expect(page.getByRole('row', { name: /copy_count/ })).toContainText('Transcript')
})
