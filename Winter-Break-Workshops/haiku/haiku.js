console.log('Node starting ...')

function createHaiku(structure, syllablesArr) {
  var str = '';
  structure.forEach(line => {
    line.forEach(syllablesInWord => {
      str += syllablesArr[syllablesInWord][Math.floor(Math.random() * syllablesArr[syllablesInWord].length)] + ' ';
    })
    str += '\n';
  })
  return str;
}

module.exports = {
  createHaiku: createHaiku
}
