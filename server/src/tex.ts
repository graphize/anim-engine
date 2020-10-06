import * as fs from 'fs-extra'
import { sha1 } from 'object-hash'
import { exists, exec } from './helper'
import { texTextToReplace, tempFolder } from './constants'

export async function getTemplateTexFile() {
  const templateTextFile = (
    await fs.readFile('./data/tex_template.tex')
  ).toString()

  const templateTexFile = templateTextFile.replace(
    texTextToReplace,
    '\\begin{align*}\n' + texTextToReplace + '\n\\end{align*}'
  )

  return { templateTextFile, templateTexFile }
}

function texHash(expression: string, template: string) {
  return sha1({ expression, template })
}

export async function generateTexFile(expression: string, template: string) {
  const hash = texHash(expression, template)
  const fileName = `${tempFolder}/${hash}.tex`

  if (!(await exists(fileName))) {
    const newBody = template.replace(texTextToReplace, expression)
    await fs.writeFile(fileName, newBody)
  }

  return fileName
}

export async function texToDvi(texFile: string) {
  const fileName = texFile.replace('.tex', '.dvi')

  if (!(await exists(fileName))) {
    const commands = [
      'latex',
      '-interaction=batchmode',
      '-halt-on-error',
      `-output-directory="${tempFolder}"`,
      `"${texFile}"`,
    ]
    const { code } = await exec(commands.join(' '))

    if (code !== 0) {
      const logFile = texFile.replace('.tex', '.log')
      throw `Latex error converting to dvi. 
      See log output above or the log file: ${logFile}`
    }
  }

  return fileName
}

export async function dviToSvg(dviFile: string) {
  const fileName = dviFile.replace('.dvi', '.svg')

  if (!(await exists(fileName))) {
    const commands = [
      'dvisvgm',
      `"${dviFile}"`,
      '-n',
      '-v',
      '0',
      '-o',
      `"${fileName}"`,
    ]
    await exec(commands.join(' '))
  }

  return fileName
}
