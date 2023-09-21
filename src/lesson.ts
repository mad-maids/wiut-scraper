const REMOVE_BRACKETS = new RegExp('s?(s?d+s?)')

class Lesson {
  public name: string
  public type: string
  public start: number
  public tutor: string
  public length: number
  public location: string

  constructor(start: number, data: string[]) {
    let [name, format] = Lesson.processClass(data[1].trim())
    let tutor = data[2].trim()
    let location = data[0].replace(REMOVE_BRACKETS, '').trim()

    this.name = name
    this.type = format
    this.tutor = tutor
    this.start = start
    this.length = start + 1.0
    this.location = location
  }

  static processClass(input: string): [string, string] {
    let klass: string
    let format: string = ''

    if (input.toLowerCase().startsWith('online_')) {
      format = 'online'
      klass = input.split('_', 1)[1]
    } else if (input.toLowerCase().startsWith('online /')) {
      format += 'online '
      klass = input.split('/ ', 1)[1]
    } else {
      klass = input
    }

    const array_cn = klass.split('_', 2)
    let name = array_cn[0].trim()

    if (name.endsWith('Beha')) {
      name += 'viour'
    }

    if (array_cn[1].includes('lec_')) {
      format += 'lecture'
    } else if (array_cn[1].includes('w_')) {
      format += 'workshop'
    } else {
      format += 'seminar'
    }

    return [name, format]
  }

  isContinuation(lesson: Lesson): boolean {
    return (
      this.name === lesson.name &&
      this.type === lesson.type &&
      this.start === lesson.start + 1.0
    )
  }

  prolong() {
    this.length += 1.0
  }
}

export default Lesson
