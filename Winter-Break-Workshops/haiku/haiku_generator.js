var {createHaiku} = require('./haiku.js');

var fs = require("fs");
var cmudictFile = readCmudictFile('./cmudict.txt');

function readCmudictFile(file){
  return fs.readFileSync(file).toString();
}

let syllablesArr = [];

function formatData(data){
   var lines = data.toString().split("\n"),
       lineSplit
   lines.forEach(function(line){
    lineSplit = line.split("  ");
    //console.log(lineSplit)
    // console.log("The word " + lineSplit[0] + " has this phoneme    layout: " + lineSplit[1]);
    let i = lineSplit[1] ? lineSplit[1].replace(/\D/g, '').length : 0;
    syllablesArr[i] =  syllablesArr[i] ? syllablesArr[i] : [];
    syllablesArr[i].push(lineSplit[0]);
  });
}

formatData(cmudictFile);

console.log(createHaiku([
  [2,3],
  [1,3,3],
  [3,2]
], syllablesArr));
