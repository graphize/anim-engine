import { RegularPolygon, Displayable, Square, Polygon, Triangle, Arc, Ellipse, Circle } from './displayables'
import Camera from './rendering/camera'
import { range } from './util/methods'
import Scene from './rendering/scene'
import { FadeIn, Transform, FadeOut } from './animations/animation'
import Color from './util/color'
import Vector from './util/vector'

export class TestScene1 extends Scene {
  public async define() {
    const s = new Square({ width: 200 })
    const p = new Polygon({ points: getRandomPoints() })
    const p2 = new Polygon({ points: getRandomPoints() })
    const p3 = new Polygon({ points: getRandomPoints() })
    const t = new Triangle({ width: 200 })

    await this.play(new FadeIn({ displayable: s }))

    await this.wait(1)

    await this.play(new Transform({ from: s, to: p }))
    await this.wait(1)
    await this.play(new Transform({ from: p, to: p2 }))
    await this.wait(1)
    await this.play(new Transform({ from: p2, to: p3 }))
    await this.wait(1)
    await this.play(new Transform({ from: p3, to: t }))
    await this.wait(1)

    await this.play(new FadeOut({ displayable: p }))
  }
}

export class TestScene2 extends Scene {
  public async define() {
    let a: Displayable = new RegularPolygon({ radius: 150, pointsCount: 3 })
    await this.wait()

    await this.play(new FadeIn({ displayable: a, duration: 1 }))

    await this.wait()

    for (const i of range(10)) {
      const t = new RegularPolygon({ radius: 150, pointsCount: i + 4 })
      const border = Color.fromHsb(i * 25.5, 100, 255)
      t.setBorder({ color: border, weight: 10 })

      await this.play(new Transform({ from: a, to: t }))
      a = t

      await this.wait()
    }

    await this.play(new FadeOut({ displayable: a, duration: 1 }))

    await this.wait()
  }
}

export class TestScene3 extends Scene {
  public async define() {
    const back = new Polygon({
      points: getRandomPoints(),
      fill: Color.random(),
    })

    await this.play(new FadeIn({ displayable: back }))

    const s = new Square({
      width: 200,
    })

    const t = new Triangle({
      width: 200,
      fill: Color.BLACK().setTransparency(128),
    })

    await this.play(new FadeIn({ displayable: s }))
    await this.wait(2)
    await this.play(new Transform({ from: s, to: t }))
    await this.wait(2)
    await this.play(new FadeOut({ displayable: t }))
  }
}

export class TestScene4 extends Scene {
  public async define() {
    const a = new Circle({ radius: 100 })

    a.translate(Vector.FROM(200, 200))
    // a.scale(Vector.FROM(0.1, 0.1))
    this.play(new FadeIn({ displayable: a }))
    const a2 = new Ellipse({
      radius: Vector.FROM(200, 100),
    })
    await this.wait()

    a2.translate(Vector.FROM(200, 200))
    await this.play(new Transform({ from: a, to: a2 }))

    const s = new Triangle({ width: 200 }).translate(Vector.FROM(200, 200))

    await this.play(new Transform({ from: a2, to: s }))
  }
}

function getRandomPoints() {
  return range(20).map(() => Vector.FROM(Math.random() * 300, Math.random() * 200))
}
