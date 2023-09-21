import Instance from '@/instance'
import { Browser, BrowserContext, chromium, Page } from 'playwright'
import { promises as fs } from 'fs'

const COURSE_REGEX = new RegExp('[3-6]D+')

;(async () => {
  const browser: Browser = await chromium.launch({ headless: false })
  const context: BrowserContext = await browser.newContext()
  const page: Page = await context.newPage()

  const instance = new Instance()
  await instance.auth(page)
  await instance.collect(page)

  // delete ./data folder if exists
  await fs.rm('./data', { recursive: true, force: true })

  console.log(instance.getCodes())

  // for (const group of instance.getCodes().keys()) {
  //   console.log(group)
  // }

  await browser.close()
})()
