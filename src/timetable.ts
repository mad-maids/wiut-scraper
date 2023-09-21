import Lesson from "./lesson";
import lesson from "./lesson";

type Day = Lesson[];
const GROUP_RE = new RegExp("\d(CIFS|BABM|BIS|CL|ECwF|Fin|BM(Fin|Mar))\d+");

type ArrStrArr = (string[])[]

class Timetable {
  public monday: Day;
  public tuesday: Day;
  public wednesday: Day;
  public thursday: Day;
  public friday: Day;
  public saturday: Day;
  public sunday: Day;

  constructor() {
    this.monday = [];
    this.tuesday = [];
    this.wednesday = [];
    this.thursday = [];
    this.friday = [];
    this.saturday = [];
    this.sunday = [];
  }

  private getDayLessons(slots: (string[])[]) {

  }

  private processSlot(slot: string[], offset: number) {
    const data = slot.filter((text) => !(text.trim() === "" || GROUP_RE.test(text)))

    if (data.length === 2) {
      data.push("John Cena");
    }

    const lessons: Lesson[] = [];

    for (let i = 0; i < data.length; i += 3) {
      lessons.push(new Lesson(9.0 + offset, data.slice(i, i + 3)))
    }
    return lessons;
  }
}

export default Timetable;
