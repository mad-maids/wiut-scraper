import fs from "fs"
import { Browser, BrowserContext, chromium, Page } from "playwright"

async function init(): Promise<[Browser, BrowserContext, Page]> {
  // Check if data folder exists
  if (!fs.existsSync("./data")) {
    console.log("Data folder not found. Creating...")
    fs.mkdirSync("./data")
  }

  const browser: Browser = await chromium.launch({ headless: false })
  const context: BrowserContext = await browser.newContext()
  const page: Page = await context.newPage()

  return [ browser, context, page ]
}

export default init
