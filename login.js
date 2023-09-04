import puppeteer from "puppeteer";

const email = process.env.EMAIL
const password = process.env.PASSWORD

if (!email || !password) throw new Error('credentials not found')

const browser = await puppeteer.launch({headless: 'new'})
const context = browser.defaultBrowserContext();
await context.overridePermissions('https://apnaklub.keka.com', ['geolocation']);

const page = await browser.newPage()

await loginGoogle()
await kekaLogin()
await sleep(8000)
await toggleClockInOut()
setTimeout(async () => await browser.close(), 2000)

async function loginGoogle() {
  await page.goto('https://www.gmail.com')

  await page.waitForSelector('input[type="email"]')
  await page.type('input[type="email"]', email)
  await page.click('#identifierNext')

  await page.waitForSelector('input[type="password"]', { visible: true })
  await page.type('input[type="password"]', password)

  await page.waitForSelector('#passwordNext', { visible: true })
  await page.click('#passwordNext')
  await page.waitForNavigation()
}

async function kekaLogin() {
  await page.setViewport({width: 1080, height: 2048})
  await page.goto('https://app.keka.com/Account/Login?ReturnUrl=%2F')

  const selector = 'button[name="provider"][value="Google"]';
  await page.waitForSelector(selector, {visible: true})
  await page.click(selector)
  await page.waitForNavigation()
}

async function findAndClickButton(selector) {
  const button = await page.$(selector)

  if (button) {
    // console.log('button found 3')
    await button.click()
    await sleep(1000)
  } else {
    console.log('button not found', selector)
  }
}

async function toggleClockInOut() {
  await page.evaluate(`window.scrollBy(0, 600)`)

  const toggleSelector = 'home-attendance-clockin-widget button'
  await findAndClickButton(toggleSelector)
  await findAndClickButton(toggleSelector)

  const cancelDialogSelector = 'xhr-confirm-dialog button'
  await findAndClickButton(cancelDialogSelector);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
