import { Square, Diamond, Triangle, RegularPolygon, Rectangle } from './displayables'
import Vector from './util/vector'
//@ts-ignore
import { interpolate } from 'flubber'

async function main() {
  const a = new Diamond({ width: 100 })
  const b = new Square({ width: 100 })
  const w = 1000

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  // path.style.transform = s.mat.toString()

  let t = 0
  let inc = 1
  const animator = interpolate(a.path, b.path)
  function draw() {
    const p = animator(t)
    path.setAttribute('d', p)
    t += 0.01 * inc
    if (t > 1 || t < 0) inc *= -1
    requestAnimationFrame(draw)
  }

  requestAnimationFrame(draw)

  svg.classList.add('anim')
  svg.setAttribute('width', innerWidth.toString())
  svg.setAttribute('height', innerHeight.toString())
  svg.setAttribute('viewBox', `0 0 ${w} ${(w * innerHeight) / innerWidth}`)
  svg.appendChild(path)
  document.body.appendChild(svg)
}

main()
