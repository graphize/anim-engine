import { exists as _exists, mkdir } from 'fs-extra'
import { exec as _exec } from 'child_process'
import { tempFolder } from './constants'

export function exists(path: string): Promise<boolean> {
  return new Promise((res, rej) => {
    _exists(path, exists => {
      res(exists)
    })
  })
}

export interface IExecutionOutput {
  code: number
  data: string
}

export function exec(command: string): Promise<IExecutionOutput> {
  return new Promise((res, rej) => {
    let logs = ''
    const execution = _exec(command, {
      maxBuffer: 10485760,
    })

    execution.stdout?.on('data', data => (logs += data))
    execution.stderr?.on('data', data => (logs += data))

    execution.on('exit', code =>
      res({
        code: code || 0,
        data: logs,
      })
    )
  })
}

export async function createTempFolder() {
  if (!(await exists(tempFolder))) {
    await mkdir(tempFolder)
  }
}
