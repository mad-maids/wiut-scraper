import path from "path"
import Instance from "@/timetable/instance"
import sleep from "@/utils/sleep"
import fs, { promises as asyncFs } from "fs"
import { Page } from "playwright"

async function main(page: Page): Promise<void> {
  const COURSE_REGEX = /[3-6]\D+/
  const location = path.join("./data", "groups")

  let json: string = ""

  if (!process.env.LOGIN || !process.env.PASSWORD) {
    throw new Error("LOGIN or PASSWORD environment variables are not set.")
  }

  // delete ./data/timetable folder if exists
  fs.rmSync(location, { recursive: true, force: true })

  if (!fs.existsSync(location)) {
    await asyncFs.mkdir(location, { recursive: true })
  }

  const instance = new Instance()
  await instance.init(page)

  // Get all codes
  const codes = instance.getCodes()

  // Delete null ptr
  codes.delete("")

  // Write codes to ./data/groups.json
  json = JSON.stringify(Array.from(codes.keys()), null, 2)
  await asyncFs.writeFile(path.join(location, "groups.json"), json, {
    encoding: "utf-8",
  })

  // Groups with codes
  const groupsWithCodes: Record<string, string> = {}

  for (const code of codes.keys()) {
    groupsWithCodes[code] = <string>codes.get(code)
  }

  json = JSON.stringify(groupsWithCodes, null, 2)
  await asyncFs.writeFile(path.join(location, "groups-with-codes.json"), json, {
    encoding: "utf-8",
  })
}

export default main
