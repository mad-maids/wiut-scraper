import path from "path"
import Instance from "@/timetable/instance"
import sleep from "@/utils/sleep"
import fs, { promises as asyncFs } from "fs"
import { Page } from "playwright"
import Timetable from "@/timetable/timetable"

async function main(page: Page): Promise<void> {
  const COURSE_REGEX = /[3-6]\D+/

  if (!process.env.LOGIN || !process.env.PASSWORD) {
    throw new Error("LOGIN or PASSWORD environment variables are not set.")
  }

  const instance = new Instance()
  await instance.init(page)

  // delete ./data/timetable folder if exists
  fs.rmSync("./data/timetable", { recursive: true, force: true })

  // Get all codes
  const codes = instance.getCodes()

  // Delete null ptr
  codes.delete("")

  // Remove all codes that doesn't start with number
  for (const group of codes.keys()) {
    if (!group.match(COURSE_REGEX)) {
      codes.delete(group)
    }
  }

  for (const group of codes.keys()) {
    const timetable: Timetable = await instance.getTimetable(
      instance.getCode(group)!,
      page,
    )

    const courseMatch = group.match(COURSE_REGEX)
    const course = courseMatch ? courseMatch[0] : "UNKNOWN"

    let location = path.join("./data/timetable", course.toUpperCase())

    if (!fs.existsSync(location)) {
      await asyncFs.mkdir(location, { recursive: true })
    }

    const json = JSON.stringify(timetable, null, 2)
    location = path.join(location, `${group}.json`)

    await asyncFs.writeFile(location, json, { encoding: "utf-8" })

    await sleep(3000)
  }
}

export default main
