import timetable from "@/timetable"
import init from "@/init"
import groups from "@/groups"

import("dotenv").then((dot) => {
  dot.config()
})
;(async () => {
  // Initialize the app instances
  const [browser, context, page] = await init()

  // Scrape groups data
  await groups(page)

  // Scrape all timetable data
  await timetable(page)

  // Close the browser
  await browser.close()
})()
