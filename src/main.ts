import { Square, Diamond, Triangle, RegularPolygon, Rectangle } from './displayables'
import { interpolateDisplayable } from './interpolation/displayableInterpolation'
import Vector from './util/vector'
import { PI, TAU } from './constants'
import Color from './util/color'

async function main() {
  const a = new RegularPolygon({ radius: 200, pointsCount: 3 })
  const b = new RegularPolygon({ radius: 200, pointsCount: 10 })
  a.translate(Vector.FROM(500, 300))
  a.fill = Color.random()
  b.translate(Vector.FROM(500, 300))
  b.fill = Color.random()
  const w = 1000

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  let t = 0
  let inc = 1
  const animators = interpolateDisplayable(a, b)
  function draw() {
    const p = animators[0].animator(t)
    path.setAttribute('d', p.path)
    path.style.transform = p.mat.toString()
    path.style.fill = p.fill.toHex()
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
