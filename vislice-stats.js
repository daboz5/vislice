var fs = require("fs")
var stateOfMind = {
    obsession: true
}

let differentLettersInWord = "abcčdefghijklmnoprsštuvzž";
let abc = differentLettersInWord.split("");
let wins = 0;
let apocalypse = 0;
let numberOfLetters = 0;
let results = [];

while (stateOfMind.obsession) {
    for (let i = 1; i <= 25; i++) {
        let wordMax = [...differentLettersInWord];
        let wordInUse = wordMax.splice(0, i).join("");

        for (let j = 0; j < 10000; j++) {
            let usedLetters = [];
            let guessedLetters = [];
            let fails = 0;
            let win = 0;
            
            while (fails < 7 && win < 1) {
                let randomMath = Math.floor(Math.random() * 25);
                let chosenLetter = abc[randomMath];
                let checkForRepeats = usedLetters.indexOf(chosenLetter);
                
                if (checkForRepeats === -1) {
                    usedLetters.push(chosenLetter);
                    let checkIfCorrect = wordInUse.indexOf(chosenLetter);

                    if (checkIfCorrect === -1) {
                        fails++;
                        if (fails === 7) {
                            apocalypse++;
                        }
                    }
                    else {
                        guessedLetters.push(chosenLetter);
                        if (guessedLetters.length === wordInUse.length) {
                            win++;
                            wins++;
                        }
                    }
                }
            }
        }
        numberOfLetters++;
        let ratio = `I counted ${wins} WINS and ${apocalypse} DEATHS at ${numberOfLetters} different letters. This is ${(wins/10000)*100}% WIN ratio.\r\n`;
        results.push(ratio);
        wins = 0;
        apocalypse = 0;
    }
    stateOfMind.obsession = false;
}

fs.writeFile("results3.txt", JSON.stringify(results), (error) => {});