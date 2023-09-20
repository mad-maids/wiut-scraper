import Lesson from "./lesson";

type Day = Lesson[];

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
}

export default Timetable;
