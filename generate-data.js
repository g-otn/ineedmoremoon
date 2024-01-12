// const Fuse = require('fuse.js')
const fs = require('fs');

const generateSideMetadata = (rawNamesFilePath) => {
  const text = fs.readFileSync(rawNamesFilePath, 'utf-8');
  const lines = text.split('\n');
  const metadata = {
    lineCount: lines.length,
    lineLengths: lines.map((l) => l.length),
  };
  return metadata;
};

const generateNameList = (rawNamesFilePath) => {
  const text = fs.readFileSync(rawNamesFilePath, 'utf-8');
  const lines = text.split('\n');
  const list = [];
  lines.forEach((line, i) => {
    const lineNames = line.split(' ');
    for (let j = 0, charAcc = 0; j < lineNames.length; charAcc += lineNames[j].length + 1, j++) {
      list.push({
        n: lineNames[j], // Name
        i: j, // Name index
        l: i, // Line index
        c: charAcc, // Line character offset
      });
    }
  });

  return list.sort((a, b) => a.n.toLowerCase().localeCompare(b.n.toLowerCase()));
};

// const generateFuseIndex = (list) => {
//   return Fuse.createIndex(['name'], list)
// }

const generateSide = (rawNamesFilePath) => {
  const metadata = generateSideMetadata(rawNamesFilePath);
  const list = generateNameList(rawNamesFilePath);

  return {
    list,
    metadata,
  };
};

// *************************************************************************

const rawNamesFilePaths = ['data/names/raw/side1.txt', 'data/names/raw/side2.txt'];
const outputFolderPath = 'public/data';
const outputFileName = 'sides.json';
const outputFilePath = `${outputFolderPath}/${outputFileName}`;

fs.mkdirSync(outputFolderPath, { recursive: true });

fs.writeFileSync(outputFilePath, JSON.stringify(rawNamesFilePaths.map(generateSide)));
