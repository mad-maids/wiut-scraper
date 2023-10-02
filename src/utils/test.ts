import test from "node:test"
import * as assert from "assert"

import reverse from "@/utils/reverse"
import saturatingSub from "@/utils/saturating"
import splitN from "@/utils/split-n"
import sleep from "@/utils/sleep"

test("Utils Test", async (t) => {
  await t.test("reverse", (t) => {
    assert.strictEqual(reverse("abc"), "cba")
  })

  await t.test("saturating", (t) => {
    assert.strictEqual(saturatingSub(5, 2), 3)
    assert.strictEqual(saturatingSub(2, 1), 1)
    assert.strictEqual(saturatingSub(1, 1), 0)
  })

  await t.test("splitN", (t) => {
    assert.deepStrictEqual(splitN("a,b,c,d", ",", 2), ["a", "b", "c,d"])
    assert.deepStrictEqual(splitN("a,b,c,d", ",", 3), ["a", "b", "c", "d"])
  })

  await t.test("sleep", async (t) => {
    const start = Date.now()
    await sleep(1000)
    const end = Date.now()
    assert.strictEqual(end - start >= 1000, true)
  })
})
