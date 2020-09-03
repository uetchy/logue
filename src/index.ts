import spawn from "cross-spawn";
import EventEmitter from "eventemitter3";
import { ChildProcess } from "child_process";
import initDebug from "debug";

interface LogueResult {
  status: string;
  stdout: string;
  line: string;
}

const log = initDebug("logue");

export default function logue(command: string, args: string[] = []) {
  return new Logue(command, args);
}

export class Logue {
  status: string;
  stdout: string;
  line: string;

  private stack: ((...args: any) => Promise<any>)[];
  private event: EventEmitter;
  private proc: ChildProcess;

  constructor(command: string, args: string[] = []) {
    this.status = "running";
    this.stdout = "";
    this.line = "";

    this.stack = [];
    this.event = new EventEmitter();
    this.proc = spawn(command, args);

    this.proc.stdout?.on("data", (data: Buffer) => {
      this.stdout += String(data);
      this.line = String(data);
      this.event.emit("data", data);
      log("line", this.line);
    });

    this.proc.on("exit", () => {
      this.status = "settled";
      this.event.emit("exit");
    });
  }

  then<T, C>(
    onFulfilled?: (result: LogueResult) => T,
    onRejected?: (err: Error) => C
  ): Promise<T> {
    return new Promise(async (resolve, _) => {
      log("then", "stack:", this.stack, "stdout:", this.stdout);
      if (this.status === "settled") {
        if (onFulfilled) resolve(onFulfilled(this.composeResult()));
        return;
      }

      if (this.stack.length === 0) {
        this.end();
      }

      try {
        // run all call stack and flush
        for (const func of this.stack) {
          log("START func:", func);
          await func();
          log("END func");
        }
        this.stack = [];

        if (onFulfilled) resolve(onFulfilled(this.composeResult()));
        return;
      } catch (err) {
        if (onRejected) return onRejected(err);
      }
    });
  }

  /**
   * Wait until the end of entire process
   */
  end() {
    // push wait event to stack
    this.pushStack("end", () => {
      return new Promise((resolve, _) => {
        const handler = () => {
          resolve();
        };
        this.event.once("exit", handler);
      });
    });
    return this;
  }

  // TODO: support RegExp
  /**
   * Wait until console stdout matches given string
   */
  waitFor(matcher: string) {
    // push wait event to stack
    this.pushStack("waitFor", () => {
      return new Promise((resolve, _) => {
        const handler = (data: Buffer) => {
          if (data.includes(matcher)) {
            this.event.removeListener("data", handler);
            resolve(data);
          }
        };
        this.event.on("data", handler);
      });
    });
    return this;
  }

  input(input: string) {
    // push input event to stack
    this.pushStack("input", async () => {
      this.proc.stdin?.setDefaultEncoding("utf-8");
      this.proc.stdin?.write(input + "\n");
      this.proc.stdin?.end();
    });
    return this;
  }

  private composeResult(): LogueResult {
    return {
      status: this.status,
      stdout: this.stdout,
      line: this.line,
    };
  }

  private pushStack(name: string, fn: any) {
    Object.defineProperty(fn, "name", {
      value: name,
      configurable: true,
    });
    this.stack.push(fn);
  }
}
