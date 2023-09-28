import path from 'path'
import Instance from '@/instance'
import sleep from '@/utils/sleep'
import fs, { promises as asyncFs } from 'fs'
import { Browser, BrowserContext, chromium, Page } from 'playwright'
import Timetable from "@/timetable";
import * as util from "util";

import('dotenv').then((dot) => {
  dot.config()
})

const LOGIN = process.env.LOGIN
const PASSWORD = process.env.PASSWORD
const COURSE_REGEX = /[3-6]\D+/

if (!LOGIN || !PASSWORD) {
  throw new Error('LOGIN or PASSWORD environment variables are not set.')
}

(async () => {
  const browser: Browser = await chromium.launch({ headless: false })
  const context: BrowserContext = await browser.newContext()
  const page: Page = await context.newPage()

  const instance = new Instance()
  await instance.auth(page, LOGIN, PASSWORD)
  await instance.collect(page)
  await instance.display(page)

  // delete ./data folder if exists
  fs.rmSync('./data', { recursive: true, force: true })

  // Get all codes
  const codes = instance.getCodes()

  // Delete null ptr
  codes.delete('')

  for (const group of codes.keys()) {
    const timetable: Timetable = await instance.getTimetable(instance.getCode(group)!, page)

    const courseMatch = group.match(COURSE_REGEX)
    const course = courseMatch ? courseMatch[0] : 'UNKNOWN'

    let location = path.join('./data', course.toUpperCase())

    if (!fs.existsSync(location)) {
      await asyncFs.mkdir(location, { recursive: true })
    }

    const json = JSON.stringify(timetable, null, 2)
    location = path.join(location, `${group}.json`)

    await asyncFs.writeFile(location, json, { encoding: 'utf-8' })

    await sleep(3000)
  }

  await browser.close()
})()
