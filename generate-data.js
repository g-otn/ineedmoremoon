// const Fuse = require('fuse.js')
const fs = require('fs')

const generateSideMetadata = (rawNamesFilePath) => {
  const text = fs.readFileSync(rawNamesFilePath, 'utf-8')
  const lines = text.split('\n')
  const metadata = {
    lineCount: lines.length,
    lineLengths: lines.map(l => l.length)
  }
  return metadata;
}

const generateNameList = (rawNamesFilePath) => {
  const text = fs.readFileSync(rawNamesFilePath, 'utf-8')
  const lines = text.split('\n')
  const names = []
  lines.forEach((line, i) => {
    const lineNames = line.split(' ')
    for (let j = 0, charAcc = 0; j < lineNames.length; charAcc += lineNames[j].length + 1, j++) {
      names.push({
        name: lineNames[j],
        nameIndex: j,
        lineIndex: i,
        startChar: charAcc
      })
    }
  })

  return names;
}

// const generateFuseIndex = (list) => {
//   return Fuse.createIndex(['name'], list)
// }

// *************************************************************************

const rawNamesFilePaths = ['data/names/raw/side1.txt', 'data/names/raw/side2.txt']
const outputFolderPath = 'public/data'
const outputFileNames = ['side1.json', 'side2.json']

const generate = (sideIndex) => {
  const rawNameFilePath = rawNamesFilePaths[sideIndex]
  const outputFilePath = `${outputFolderPath}/${outputFileNames[sideIndex]}`

  const metadata = generateSideMetadata(rawNameFilePath)
  const list = generateNameList(rawNameFilePath)
  // const fuseIndex = generateFuseIndex(list)

  fs.mkdirSync(outputFolderPath, { recursive: true })

  fs.writeFileSync(outputFilePath, JSON.stringify({
    list,
    metadata,
    // fuseIndex: fuseIndex.toJSON(),
  }))
}

generate(0)
generate(1)