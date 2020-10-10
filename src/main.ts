import { TexDisplayable, TextDisplayable } from './displayables'

async function main() {
  const tex = await TexDisplayable.create({
    value: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
  })

  const text = await TextDisplayable.create({
    value: 'Hello World',
  })

  document.write(tex.path)
  document.write('<br/>')
  document.write('<br/>')
  document.write('<br/>')
  document.write(text.path)
}

main()
