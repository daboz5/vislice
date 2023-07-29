import { Guess } from "../type";
import useAppStore from "../Store";
import apiURL from "./api_url";
import useLocalStorage from "./useLocalStorage";

export default function useRoot () {

    const {
        cngId,
        cngUsername,
        cngProfPic,
        cngGuesses,
        cngOnline,
        cngServerConnectionError
    } = useAppStore();

    const { getData } = useLocalStorage();

    const fetchMyData = async () => {
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
                    cngUsername("");
                    cngProfPic("");
                    cngOnline(false);
                } else if (result.message !== "Unauthorized") {
                    cngId(result.id)
                    cngUsername(result.username);
                    cngProfPic(result.avatar);
                    cngOnline(true);
                }
            }
        )
        .catch(error => {
            console.log(error);
        });
    }

    const fetchMyResults = async () => {
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
                    cngGuesses(newResult);
                }
            }
        )
        .catch(error => {
            cngServerConnectionError(true);
            console.log(error);
        });
    }

    return { fetchMyData, fetchMyResults }
}