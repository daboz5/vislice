import { useState, useCallback } from 'react';
import useFetch from '../utils/useFetch';
import useLocalStorage from '../utils/useLocalStorage';
import useAppStore from '../Store';

export default function useGame() {
    
    const { word, darkMode } = useAppStore();
    const [ game, setGame ] = useState({
        life: 7,
        tried: "",
        found: [""]
    });
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);
    const [ reported, setReported] = useState(false);

    const { getFetch, postFetch } = useFetch();
    const { getData } = useLocalStorage();
    const menuOpened = getData("menuOpened");
    
    const eventListener = useCallback((event:any) => {
        if (menuOpened || lost || won || !word) {
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
                let updatedGame = {
                    life: life-1,
                    tried: tried + lowerKey,
                    found: found
                };
                setGame(updatedGame);

                if (life === 1) {
                    setLost(true);
                    handleWordEnd(false);
                }
            }

            else if (wordHasLetter >= 0) {
                let newFound: string[] = found;
                for (let i = 0; arrayWord.length > i; i++) {
                    if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
                        newFound[i] = lowerKey;
                    }
                }
                let updatedGame = {
                    life: life,
                    tried: tried + lowerKey,
                    found: newFound
                }
                setGame(updatedGame);

                let checkForWin = found.join("").indexOf(" ");
                if (checkForWin === -1) {
                    setWon(true);
                    handleWordEnd(true);
                }
            }
        }
    }, [word, game, menuOpened])

    const handleClick = async () => {
        if (!reported) {
            handleWordEnd(false);
        } else {
            setReported(false);
        }
        await getFetch("/words/random", setGame);
        setWon(false);
        setLost(false);
    }

    const handleWordEnd = (win:boolean) => {
        if (word) {
            const input = {
                "wordId": word.id,
                "guesses": win ?
                    word.word.split("") :
                    game.tried.split("")
            };
            postFetch("/guesses", input);
            setReported(true);
            getFetch("/guesses/me");
        }
    }

    const found = game.found.length > 1 &&
        game.found.map(
            (el, index) => {
                return (
                    <div
                        className="letters"
                        style={
                            darkMode ?
                            {borderBottom: "3px solid #FFFFA9"} :
                            {borderBottom: "3px solid black"}
                        }
                        key={"letter"+index}>
                        {el}
                    </div>
                )
            }
        );

    const used = game.tried.split("").join(" ");

    return {
        won,
        lost,
        game,
        found,
        used,
        menuOpened,
        handleClick,
        eventListener,
        setWon,
        setLost,
        setGame
    };
}