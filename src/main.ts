import { SERVER_URL } from './constants'

import { SVGParser } from './util/svg2'

async function main() {
  const svg = await fetch(
    `${SERVER_URL}/tex/${btoa(
      '\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}'
    )}`
  ).then((r) => r.text())

  const parser = new SVGParser(svg)
}

main()
