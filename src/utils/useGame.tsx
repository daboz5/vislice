import { useState, useCallback } from 'react';
import useFetch from '../utils/useFetch';
import useLocalStorage from '../utils/useLocalStorage';
import useAppStore from '../Store';

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
        won,
        lost,
        help,
        game,
        word,
        online,
        darkMode,
        panic,
        paniced,
        cngGame,
        cngPanic,
        switchPaniced,
        switchWon,
        switchLost
    } = useAppStore();

    const [ reported, setReported ] = useState(false);
    const [ gameOn, setGameOn ] = useState(false);

    const { getFetch, postFetch } = useFetch();
    const { getData } = useLocalStorage();
    const menuOpened = getData("menuOpened");
    
    const eventListener = useCallback((event:any) => {
        if (menuOpened || lost || won || !word || help) {
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
                    life: panic.state ? life : (life-1),
                    tried: tried + lowerKey,
                    found: found
                };
                cngGame(updatedGame);

                if (life === 1) {
                    switchLost();
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
                cngGame(updatedGame);

                let checkForWin = found.join("").indexOf(" ");
                if (checkForWin === -1) {
                    switchWon();
                    handleWordEnd(true);
                }
            }
        }
    }, [word, game, menuOpened, help, lost, won, panic])

    const handlePanicBtn = () => {
        cngPanic(
            {state: !panic.state, style: {
                boxShadow: panic.state ?
                    `inset 1px -1px 7px 4px black` :
                    `inset 0 0 3px 3px black,
                    0 0 7px 3px red`,
                backgroundColor: panic.state ?
                    "rgb(0, 220, 0)" :
                    "rgb(255, 0, 0)"
            }
        });
        if (!paniced) {switchPaniced()};
    }

    const handleClick = async () => {
        if (!reported) {
            handleWordEnd(false);
        } else {
            setReported(false);
        }
        await getFetch("/words/random", cngGame);
        if (won) {switchWon()};
        if (lost) {switchLost()};
        if (paniced && !panic.state) {switchPaniced()};
        !gameOn && setGameOn(true);
    }

    const handleWordEnd = (win:boolean) => {
        if (word && online && !paniced) {
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
            let wordLetters: string[] = [];
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

    return {
        gameOn,
        found,
        used,
        menuOpened,
        napis,
        handlePanicBtn,
        handleClick,
        eventListener,
        probability
    };
}