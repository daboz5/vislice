import { useState, useCallback } from 'react';
import useFetch from '../utils/useFetch';
import useLocalStorage from '../utils/useLocalStorage';
import { Word } from '../type';

export default function useGame() {
    
    const [game, setGame] = useState({
        life: 7,
        tried: "",
        found: [""]
    });
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);

    const { getFetch, postFetch } = useFetch();
    const { getData } = useLocalStorage();
    const menuOpened = getData("menuOpened");
    const word: Word = getData("word");
    
    const eventListener = useCallback((event:any) => {
        if (menuOpened || lost || won || game.found.length === 1) {
            return;
        }

        const life = game.life;
        const tried = game.tried;
        const found = game.found;

        let lowerKey: string = event.key.toLowerCase();
        let regEx1 = /..|[\W]|\d/
        let regEx2 = /[čžš]/
        let regEx3 = /[qwđćyx]/
        let testKey1 = regEx1.test(lowerKey);
        let testKey2 = regEx2.test(lowerKey);
        let testKey3 = regEx3.test(lowerKey);

        let testsResult = true;
        if (testKey1 === true) {
            testsResult = false;
        }
        if (testKey1 === true && testKey2 === true) {
            testsResult = true;
        }
        if (testKey1 === false && testKey3 === true) {
            testsResult = false;
        }

        let arrayWord = word.word.split("");
        let wordHasLetter = word.word.indexOf(lowerKey);
        let checkForRepeats = tried.split("").indexOf(lowerKey);

        if (checkForRepeats === -1 && testsResult) {

            if (wordHasLetter < 0 && life > 0) {
                if (tried.length === 0) {
                    let newGame = {
                        life: life-1,
                        tried: lowerKey,
                        found: found
                    };
                    setGame(newGame);
                } else {
                    let newGame = {
                        life: life-1,
                        tried: tried + " " + lowerKey,
                        found: found
                    };
                    setGame(newGame);
                }

                if (life === 0) {
                    setLost(true);
                }
            }

            else if (wordHasLetter >= 0) {
                let newFound: string[] = found;
                for (let i = 0; arrayWord.length > i; i++) {
                    if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
                        newFound[i] = lowerKey;
                    }
                }
                if (tried.length === 0) {
                    let newGame = {
                        life: life,
                        tried: lowerKey,
                        found: newFound
                    }
                    setGame(newGame);
                } else {
                    let newGame = {
                        life: life,
                        tried: tried + " " + lowerKey,
                        found: newFound
                    }
                    setGame(newGame);
                    let checkForWin = found.join("").indexOf(" ");
                    if (checkForWin === -1) {
                        setWon(true);
                        handleWin();
                    }
                }
            }
        }
    }, [word.word, game.tried, menuOpened])

    const handleClick = async () => {
        await getFetch("/words/random", setGame);
        setWon(false);
        setLost(false);
    }

    const handleWin = () => {
        const input = {
            "wordId": word.id,
            "guesses": game.tried.split(" ")
        }
        postFetch("/guesses", input);
    }

    let checkForWin = game.found.join("").indexOf(" ");

    let letters = game.found.length > 1 &&
        game.found.map(
            (el, index) => {
                return (
                    <div
                        className="letters"
                        key={"letter"+index}>
                        {el}
                    </div>
                )
            }
        );

    return {
        won,
        lost,
        game,
        menuOpened,
        checkForWin,
        letters,
        handleClick,
        eventListener,
        setWon,
        setLost,
        setGame
    };
}