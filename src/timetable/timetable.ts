import Lesson from "./lesson"
import saturatingSub from "@/utils/saturating"
import { Page } from "playwright"

type Day = Lesson[]
const GROUP_RE =
  /\d(CIFS|BABM|BALaw|BSc(Finance|BIS|EC with Finance)|BIS|CL|ECwF|Fin|BM(Fin|Mar)|BABM with (Finance|Marketing))\d+/

class Timetable {
  public monday: Day
  public tuesday: Day
  public wednesday: Day
  public thursday: Day
  public friday: Day
  public saturday: Day
  public sunday: Day

  constructor() {
    this.monday = []
    this.tuesday = []
    this.wednesday = []
    this.thursday = []
    this.friday = []
    this.saturday = []
    this.sunday = []
  }

  static async fromHTML(page: Page): Promise<Timetable> {
    const timetable = new Timetable()

    const rows = await page.$$("div.row.cf:not(:first-child)")

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]

      // Fetch all slots except the first one which has weekday info
      const slotsElements = await row.$$("div.col:not(:first-child) .innerbox")

      const slots = []
      for (const slotElement of slotsElements) {
        const texts = await slotElement.$$eval("div", (elements) =>
          elements.map((e) => e.textContent),
        )

        slots.push(texts)
      }

      const day = timetable.getDayLessons(<string[][]>slots!)

      switch (index) {
        case 0:
          timetable.monday = day
          break
        case 1:
          timetable.tuesday = day
          break
        case 2:
          timetable.wednesday = day
          break
        case 3:
          timetable.thursday = day
          break
        case 4:
          timetable.friday = day
          break
        case 5:
          timetable.saturday = day
          break
        default:
          throw new Error(
            "More than 6 rows found, is WIUT having lessons on Sunday now?",
          )
      }
    }

    return timetable
  }

  private getDayLessons(slots: Array<Array<string>>): Day {
    const day: Lesson[] = []

    let lastSlotLessons = 0
    slots.forEach((slot, offset) => {
      const lessons = this.processSlot(slot, offset)
      const numberOfLessons = lessons.length

      lessons.forEach((lesson) => {
        let lessonProlonged = false

        // to check if one of the previous lessons should be prolonged
        const invalid = saturatingSub(
          day.length,
          numberOfLessons + lastSlotLessons - 1,
        )
        const start = Math.max(0, invalid)

        for (let index = start; index < day.length; index++) {
          const previousLesson = day[index]

          if (lesson.isContinuation(previousLesson)) {
            previousLesson.prolong()
            lessonProlonged = true
            break
          }
        }

        if (!lessonProlonged) {
          day.push(lesson)
        }
      })

      lastSlotLessons = numberOfLessons
    })

    return day
  }

  private processSlot(slot: string[], offset: number): Array<Lesson> {
    const data = slot.filter(
      (text) => !(text.trim() === "" || GROUP_RE.test(text)),
    )

    if (data.length === 2) {
      data.push("John Cena")
    }

    const lessons: Lesson[] = []

    for (let i = 0; i < data.length; i += 3) {
      lessons.push(new Lesson(9.0 + offset, data.slice(i, i + 3)))
    }

    return lessons
  }
}

export default Timetable
