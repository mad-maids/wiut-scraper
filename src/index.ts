import Instance from "@/instance";
import {Browser, BrowserContext, chromium, Page} from "playwright";

(async () => {
  const browser: Browser = await chromium.launch({ headless: false })
  const context: BrowserContext = await browser.newContext()
  const page: Page = await context.newPage()

  const instance = new Instance();
  await instance.auth(page);
  await instance.collect(page);

  console.log(instance.getCodes());

  await browser.close()
})()

