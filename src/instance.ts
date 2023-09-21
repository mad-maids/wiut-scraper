import { Page } from 'playwright'
import Timetable from '@/timetable'

type Codes = {
  [key: string]: string
}

class Instance {
  private readonly codes: Codes

  constructor() {
    this.codes = {}
  }

  public async auth(page: Page): Promise<void> {
    await page.goto('https://intranet.wiut.uz/Account/Login?ReturnUrl=%2f')
    await page.fill('#user', <string>process.env.LOGIN)
    await page.fill('#pass', <string>process.env.PASSWORD)
    await page.click('xpath=/html/body/div[1]/div/div/div/div/form/button')

    // Those bitches limited the request time to 5 seconds
    await page.waitForTimeout(5000)
    await page.goto('https://intranet.wiut.uz/')
  }

  public async collect(page: Page): Promise<void> {
    await page.goto('https://intranet.wiut.uz/TimeTableNew/GetLessons')

    const codes: string[] = await page.$$eval(
      'select#ddlclass > option.dropdown-item',
      (options) => {
        return options.map((option) => <string>option.getAttribute('value'))
      },
    )

    const courses: string[] = await page.$$eval(
      'select#ddlclass > option.dropdown-item',
      (options) => {
        return options.map((option) => <string>option.textContent)
      },
    )

    for (let i = 0; i < 179; i++) {
      this.codes[courses[i]] = codes[i]
    }
  }

  public async display(page: Page): Promise<void> {
    // show page content where page is located
    await page.screenshot({ path: `./screenshots/${Date.now()}.png` })
  }

  public getCodes(): Codes {
    return this.codes
  }

  public async getTimetable(group: string, page: Page): Promise<Timetable> {
    await page.goto(
      `https://intranet.wiut.uz/TimeTableNew/GetLessons?classid=${group}`,
    )

    return await Timetable.fromHTML(page)
  }
}

export default Instance
