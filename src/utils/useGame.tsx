import { useState, useCallback } from 'react';
import useLocalStorage from '../utils/useLocalStorage';
import useAppStore from '../Store';
import apiURL from './api_url';
import { Word } from '../type';

const probArr = [
    {
        difNum: 1,
        avgWin: 28.29
    },
    {
        difNum: 2,
        avgWin: 9.41
    },
    {
        difNum: 3,
        avgWin: 3.91
    },
    {
        difNum: 4,
        avgWin: 1.65
    },
    {
        difNum: 5,
        avgWin: 0.9
    },
    {
        difNum: 6,
        avgWin: 0.6
    },
    {
        difNum: 7,
        avgWin: 0.37
    },
    {
        difNum: 8,
        avgWin: 0.28
    },
    {
        difNum: 9,
        avgWin: 0.23
    },
    {
        difNum: 10,
        avgWin: 0.32
    },
    {
        difNum: 11,
        avgWin: 0.29
    },
    {
        difNum: 12,
        avgWin: 0.43
    },
    {
        difNum: 13,
        avgWin: 0.51
    },
    {
        difNum: 14,
        avgWin: 0.8
    },
    {
        difNum: 15,
        avgWin: 1.87
    },
    {
        difNum: 16,
        avgWin: 3.78
    },
    {
        difNum: 17,
        avgWin: 9.6
    },
    {
        difNum: 18,
        avgWin: 28.74
    }
];

export default function useGame() {

    const {
        user,
        won,
        lost,
        help,
        game,
        word,
        darkMode,
        panic,
        paniced,
        setWord,
        setGame,
        setPanic,
        switchPaniced,
        switchWon,
        switchLost,
        setServerError,
        setServerConnectionError
    } = useAppStore();

    const [reported, setReported] = useState(false);
    const [gameOn, setGameOn] = useState(false);

    const { getData } = useLocalStorage();
    const menuOpened = getData("menuOpened");

    const postGuesses = useCallback(
        async (input: { wordId: number, guesses: string[] }) => {
            const token = getData("token");
            const myHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
            const myBody = JSON.stringify({
                "wordId": input.wordId,
                "guesses": input.guesses
            });
            const requestOptions: RequestInit = {
                method: 'POST',
                body: myBody,
                headers: myHeaders,
                redirect: 'follow',
            };
            await fetch(apiURL + "/guesses", requestOptions)
                .then(response => response.json())
                .then((result) => {
                    if (result.error) {
                        throw new Error(
                            result.message ||
                            setServerError(<>Nekaj je šlo narobe, poskusite kasneje.</>)
                        )
                    }
                })
                .catch(error => {
                    console.log(error)
                }
                );
        }, [setServerError, getData]
    )

    const handleWordEnd = useCallback(
        (win: boolean) => {
            if (word && user && !paniced) {
                const input = {
                    "wordId": word.id,
                    "guesses": win ?
                        word.word.split("") :
                        game.tried.split("")
                };
                postGuesses(input);
                setReported(true);
            }
        }, [game.tried, user, paniced, word, postGuesses]
    )

    const eventListener = useCallback((event: KeyboardEvent) => {
        if (menuOpened || lost || won || !word || help) {
            return;
        }
        const life = game.life;
        const tried = game.tried;
        const found = game.found;

        const lowerKey: string = event.key.toLowerCase();
        const regEx1 = /..|[\W]|\d/
        const regEx2 = /[čžš]/
        const regEx3 = /[qwđćyx]/
        const testKey1 = regEx1.test(lowerKey);
        const testKey2 = regEx2.test(lowerKey);
        const testKey3 = regEx3.test(lowerKey);

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

        const arrayWord = word.word.split("");
        const wordHasLetter = word.word.indexOf(lowerKey);
        const checkForRepeats = tried.split("").indexOf(lowerKey);

        if (checkForRepeats === -1 && testsResult) {
            if (wordHasLetter < 0 && life > 0) {
                const updatedGame = {
                    life: panic.state ? life : (life - 1),
                    tried: tried + lowerKey,
                    found: found
                };
                setGame(updatedGame);

                if (life === 1) {
                    switchLost();
                    handleWordEnd(false);
                }
            }

            else if (wordHasLetter >= 0) {
                const newFound: string[] = found;
                for (let i = 0; arrayWord.length > i; i++) {
                    if (arrayWord[i] !== found[i] && arrayWord[i] === lowerKey) {
                        newFound[i] = lowerKey;
                    }
                }
                const updatedGame = {
                    life: life,
                    tried: tried + lowerKey,
                    found: newFound
                }
                setGame(updatedGame);

                const checkForWin = found.join("").indexOf(" ");
                if (checkForWin === -1) {
                    switchWon();
                    handleWordEnd(true);
                }
            }
        }
    }, [word, game, menuOpened, help, lost, won, panic.state, switchLost, switchWon, setGame, handleWordEnd])

    const handlePanicBtn = () => {
        setPanic(
            {
                state: !panic.state, style: {
                    boxShadow: panic.state ?
                        `inset 1px -1px 7px 4px black,
                        0 0 3px 2px rgb(0, 150, 0)` :
                        `inset 0 0 3px 3px black,
                        0 0 7px 3px red`,
                    backgroundColor: panic.state ?
                        "rgb(0, 220, 0)" :
                        "rgb(255, 0, 0)"
                }
            });
        if (!paniced) { switchPaniced() }
    }

    const handleClick = async () => {
        if (!reported) {
            handleWordEnd(false);
        } else {
            setReported(false);
        }
        await fetchNewWord();
        if (won) { switchWon() }
        if (lost) { switchLost() }
        if (paniced && !panic.state) { switchPaniced() }
        !gameOn && setGameOn(true);
    }

    const found = game.found.length > 1 &&
        game.found.map(
            (el, index) => {
                return (
                    <div
                        className="letters"
                        style={
                            darkMode ?
                                { borderBottom: "3px solid #FFFFA9" } :
                                { borderBottom: "3px solid black" }
                        }
                        key={"letter" + index}>
                        {el}
                    </div>
                )
            }
        );

    const used = game.tried.split("").join(" ");

    const napis = {
        action: darkMode ?
            <h3>Reši sonček</h3> :
            <h3>Reši zvezdico</h3>,
        won: darkMode ?
            <h3>! Sonček živi !</h3> :
            <h3>! Zvezdica živi !</h3>,
        lost: darkMode ?
            <h3>... Sonček je umrl ...</h3> :
            <h3>... Zvezdica je umrla ...</h3>
    }

    const probability = () => {
        if (word) {
            const wordLetters: string[] = [];
            const wordArr = word.word.split("");
            wordArr.forEach((el) => {
                if (!wordLetters.includes(el)) {
                    wordLetters.push(el)
                }
            })
            if (wordLetters.length < 19) {
                const prob = probArr.find(
                    (el) => el.difNum === wordLetters.length
                );
                return `${prob!.avgWin}%`;
            } else {
                return "100%";
            }
        }
    }

    const fetchNewWord = async () => {
        const requestOptions: RequestInit = {
            method: 'GET',
            headers: { "ngrok-skip-browser-warning": "true" },
            redirect: 'follow',
        };
        await fetch(apiURL + "/words/random", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message);
                } else {
                    if (result.definition) {
                        const listDef = result.definition;
                        const newDefStart = listDef[0].toUpperCase();
                        let newDef = listDef
                            .replace(listDef[0], newDefStart)
                            .replaceAll(/[1-9]/g, "")
                        if (newDef[newDef.length - 1] === " ") {
                            newDef = newDef.slice(0, newDef.length - 1);
                        }
                        if (newDef[newDef.length - 1] === "," || newDef[newDef.length - 1] === ";" || newDef[newDef.length - 1] === ":") {
                            newDef = newDef.slice(0, newDef.length - 1);
                        }
                        if (newDef[newDef.length - 1] === " ") {
                            newDef = newDef.slice(0, newDef.length - 1);
                        }
                        newDef = newDef + "."
                        const newWord: Word = {
                            id: result.id,
                            word: result.normalizedWord,
                            definition: newDef
                        };
                        setWord(newWord);
                    } else {
                        const newWord: Word = {
                            id: result.id,
                            word: result.normalizedWord,
                            definition: "Definicija ni na voljo."
                        };
                        setWord(newWord);
                    }
                    const newGame = {
                        life: 7,
                        tried: "",
                        found: result.word.split("").map(() => " ")
                    }
                    setServerConnectionError(false);
                    setGame(newGame)
                }
            }
            )
            .catch(error => {
                console.log(error);
            });
    }

    return {
        gameOn,
        found,
        used,
        menuOpened,
        napis,
        handlePanicBtn,
        handleClick,
        eventListener,
        probability,
        fetchNewWord
    };
}