import { Page } from "playwright"
import Timetable from "@/timetable/timetable"
import Instance from "@/provider/instance"

class TimetableInstance extends Instance {
  constructor() {
    super()
  }

  public async getTimetable(group: string, page: Page): Promise<Timetable> {
    // await page.goto(
    //   `https://intranet.wiut.uz/TimeTableNew/GetLessons?classid=${group}`,
    //   { timeout: 60000 }
    // )
    await this.goToPage(
      page,
      `https://intranet.wiut.uz/TimeTableNew/GetLessons?classid=${group}`,
    )

    return await Timetable.fromHTML(page)
  }
}

export default TimetableInstance
