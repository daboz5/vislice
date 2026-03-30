import { useQuery } from "@tanstack/react-query";
import { Word } from "../type";
import apiURL from "../utils/api_url";
import useAppStore from "../Store";
import Signal from "../assets/Signal";
import useRoot from "../utils/useRoot";
import useGame from "../utils/useGame";

export default function NewWordBtn() {

    const {
        lost,
        won,
        panic,
        paniced,
        setWord,
        setGame,
        switchWon,
        switchLost,
        switchPaniced
    } = useAppStore();

    const {
        boxShadowStyleBtn,
        handleBtnClickStyle
    } = useRoot();

    const { reported, gameOn, setReported, handleWordEnd, setGameOn } = useGame();

    const handleClick = async () => {
        if (!reported) {
            handleWordEnd(false);
        } else {
            setReported(false);
        }
        if (won) { switchWon() }
        if (lost) { switchLost() }
        if (paniced && !panic.state) { switchPaniced() }
        refetch();
        !gameOn && setGameOn(true);
    }

    const fetchFn = async () => {
        const requestOptions: RequestInit = {
            method: 'GET',
            headers: { "ngrok-skip-browser-warning": "true" },
            redirect: 'follow',
        };
        await fetch(apiURL + "/words/random", requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
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
                    setGame(newGame)
                }
            }
            )
        return {}
    }

    const { isInitialLoading, refetch, isError, error } = useQuery({
        queryKey: ["word"],
        queryFn: fetchFn,
        enabled: false
    })

    if (isError) { console.log(error) }

    return (
        <button
            className="button"
            disabled={isInitialLoading}
            onClick={() => handleClick()}
            onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
            onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false)}
            onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false)}
            style={{ boxShadow: boxShadowStyleBtn }}>
            {isInitialLoading ?
                <>
                    Iščem
                    <Signal />
                </> :
                "Nova beseda"
            }
        </button>
    )
}