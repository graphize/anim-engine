import Camera from './rendering/camera'
import { TestScene2 } from './examples'

async function main() {
  const w = 1000

  const camera = new Camera({})

  document.body.appendChild(camera.domElement)

  const svg = camera.domElement

  svg.classList.add('anim')
  svg.setAttribute('width', innerWidth.toString())
  svg.setAttribute('height', innerHeight.toString())
  svg.setAttribute('viewBox', `0 0 ${w} ${(w * innerHeight) / innerWidth}`)

  const scene = new TestScene2({})

  await camera.renderScene(scene)
}

main()
