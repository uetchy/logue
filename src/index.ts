import spawn from 'cross-spawn'
import EventEmitter from 'eventemitter3'
import { ChildProcess } from 'child_process'
import initDebug from 'debug'

const log = initDebug('logue')

export default function logue(command: string, args: string[] = []) {
  return new Logue(command, args)
}

// @ts-ignore
export class Logue extends Promise {
  private proc: ChildProcess
  private event: EventEmitter
  private stack: ((...args: any) => Promise<any>)[]
  stdout: string
  currentLine: string
  status: string = 'pending'
  done: boolean = false

  constructor(command: string, args: string[] = []) {
    super(() => {})
    this.proc = spawn(command, args)
    this.event = new EventEmitter()
    this.stack = []
    this.stdout = ''
    this.currentLine = ''

    this.proc.stdout?.on('data', (data: Buffer) => {
      this.stdout += String(data)
      this.currentLine = String(data)
      this.event.emit('data', data)
    })
    this.proc.on('exit', () => this.event.emit('exit'))
  }

  then<T, C>(
    onFulfilled?: (result: any) => T,
    onRejected?: (err: Error) => C
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      log('then')

      if (this.stack.length === 0) {
        if (onFulfilled) return resolve(onFulfilled(this.stdout))
      }

      try {
        // run all call stack and flush
        for (const func of this.stack) {
          await func()
        }
        this.stack = []

        if (onFulfilled) return resolve(onFulfilled(this))
      } catch (err) {
        if (onRejected) return onRejected(err)
      }
    })
  }

  catch(callback: Function) {
    log('catch')
  }

  finally(callback: Function) {
    log('finally')
  }

  resolve(arg: any) {
    log('resolve', arg)
  }

  input(input: string) {
    // push input event to stack
    this.stack.push(async () => {
      this.proc.stdin?.setDefaultEncoding('utf-8')
      this.proc.stdin?.write(input + '\n')
      this.proc.stdin?.end()
    })

    // return this for further stack
    return this
  }

  // TODO: support RegExp
  /**
   * Wait until console stdout matches given string
   */
  waitFor(matcher: string) {
    // push wait event to stack
    this.stack.push(() => {
      return new Promise((resolve, _) => {
        const handler = (data: Buffer) => {
          if (data.includes(matcher)) {
            this.event.removeListener('data', handler)
            resolve(data)
          }
        }
        this.event.on('data', handler)
      })
    })

    // return this for further stack
    return this
  }

  /**
   * Wait until the end of entire process
   */
  end() {
    // push wait event to stack
    this.stack.push(() => {
      return new Promise((resolve, _) => {
        const handler = () => {
          resolve()
        }
        this.event.once('exit', handler)
      })
    })

    // return this for further stack
    return this
  }
}
