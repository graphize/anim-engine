import express from 'express'
import { getTemplateTexFile, generateTexFile, texToDvi, dviToSvg } from './tex'
import atob from 'atob'
import { readFile } from 'fs-extra'
import { createTempFolder } from './helper'
import cors from 'cors'
;(async () => {
  const port = process.env.PORT || 3000
  const app = express()
  app.use(cors())
  const { templateTexFile, templateTextFile } = await getTemplateTexFile()

  await createTempFolder()

  app.get('/tex/:code', async (req, res) => {
    const expression = atob(req.params.code.toString())

    const texFile = await generateTexFile(expression, templateTexFile)
    const dviFile = await texToDvi(texFile)
    const svgFile = await dviToSvg(dviFile)
    const svg = (await readFile(svgFile)).toString()

    res.send(svg)
  })

  app.get('/text/:code', async (req, res) => {
    const expression = atob(req.params.code.toString())

    const texFile = await generateTexFile(expression, templateTextFile)
    const dviFile = await texToDvi(texFile)
    const svgFile = await dviToSvg(dviFile)
    const svg = (await readFile(svgFile)).toString()

    res.send(svg)
  })

  app.listen(port, () => console.log(`Listenning to port ${port}...`))
})()
