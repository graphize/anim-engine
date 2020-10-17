import { PI } from '../constants'

export function wait(s: number) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, s * 1000)
  })
}

export function map(value: number, start1: number, stop1: number, start2: number, stop2: number) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

export function range(len: number) {
  return new Array(len).fill(0).map((_, i) => i)
}

export function radians(v: number) {
  return (v * PI) / 180
}
