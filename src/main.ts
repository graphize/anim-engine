import TexDisplayable from './displayables/texdisplayable'

async function main() {
  const tex = await TexDisplayable.create({
    value: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
  })

  console.log(tex, tex.path)
  document.body.innerHTML += tex.path
}

main()
