import { Page } from "playwright"

type Codes = Map<string, string>

class Instance {
  private readonly codes: Codes

  constructor() {
    this.codes = new Map<string, string>()
  }

  /**
   * Try to authenticate to the intranet as humanly as possible
   * @param page Page object
   * @param login Login
   * @param password Password
   */
  public async auth(
    page: Page,
    login: string,
    password: string,
  ): Promise<void> {
    // Go to the login page
    await page.goto("https://intranet.wiut.uz/Account/Login?ReturnUrl=%2f")

    // Hold on for a second
    await page.waitForTimeout(1000)

    // Fill in the login and password fields
    await page.fill("#user", login)
    await page.fill("#pass", password)

    // Hold on for a second again
    await page.waitForTimeout(1000)

    // Click the login button
    await page.click("xpath=/html/body/div[1]/div/div/div/div/form/button")

    // Those bitches limited the request time to 2 seconds
    await page.waitForTimeout(2000)

    // Go to home page
    await page.goto("https://intranet.wiut.uz/")

    // Hold on for a second again again
    await page.waitForTimeout(1000)
  }

  public async collect(page: Page): Promise<void> {
    await page.goto("https://intranet.wiut.uz/TimeTableNew/GetLessons")

    const codes: string[] = await page.$$eval(
      "select#ddlclass > option.dropdown-item",
      (options) => {
        return options.map((option) => <string>option.getAttribute("value"))
      },
    )

    const courses: string[] = await page.$$eval(
      "select#ddlclass > option.dropdown-item",
      (options) => {
        return options.map((option) => <string>option.textContent)
      },
    )

    for (let i = 0; i < 179; i++) {
      this.codes.set(courses[i], codes[i])
    }
  }

  public async display(page: Page): Promise<void> {
    // show page content where page is located
    await page.screenshot({ path: `./screenshots/${Date.now()}.png` })
  }

  public async init(page: Page) {
    await this.auth(page, process.env.LOGIN!, process.env.PASSWORD!)
    await this.collect(page)
    await this.display(page)
  }

  public getCodes(): Codes {
    return this.codes
  }

  public getCode(group: string): string | undefined {
    return this.codes.get(group)
  }

  protected async goToPage(page: Page, url: string, attempt = 5): Promise<void> {
    for (let i = 0; i < attempt; i++) {
      try {
        await page.goto(url)
        return
      } catch (error: any) {
        console.error(`Attempt ${i + 1} failed with error: ${error.message}`)
        await page.waitForTimeout(2000)
      }
    }
    throw new Error(`Failed to navigate to ${url} after ${attempt} retries`)
  }
}

export default Instance
