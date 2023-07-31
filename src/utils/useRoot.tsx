import { Guess } from "../type";
import { useCallback } from 'react';
import useAppStore from "../Store";
import apiURL from "./api_url";
import useLocalStorage from "./useLocalStorage";

export default function useRoot () {

    const {
        setUser,
        setGuesses,
        setServerConnectionError
    } = useAppStore();

    const { getData } = useLocalStorage();

    const fetchMyData = useCallback(async () => {
        const token = getData("token");
        if (!token) {return}

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`},
            redirect: 'follow'
        };

        await fetch(apiURL + "/auth/whoami", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message);
                } else if (result.message === "Unauthorized") {
                    setUser(null)
                } else if (result.message !== "Unauthorized") {
                    setUser({
                        id: result.id,
                        username: result.username,
                        profPic: result.avatar
                    })
                }
            }
        )
        .catch(error => {
            console.log(error);
        });
    }, [setUser, getData])

    const fetchMyResults = useCallback(async () => {
        const token = getData("token");
        if (!token) {return}

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`},
            redirect: 'follow'
        };
        await fetch(apiURL + "/guesses/me", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message);
                } else {
                    const newResult = result.map((guess: Guess) => {
                        return {
                            guessId: guess.id,
                            word: guess.word,
                            guesses: guess.guesses,
                            success: guess.success
                        }
                    })
                    setGuesses(newResult);
                }
            }
        )
        .catch(error => {
            setServerConnectionError(true);
            console.log(error);
        });
    }, [setGuesses, setServerConnectionError, getData])

    return { fetchMyData, fetchMyResults }
}