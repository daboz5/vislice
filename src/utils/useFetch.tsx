import useAppStore from "../Store";
import apiURL from "./api_url";
import useLocalStorage from "./useLocalStorage";
import { Guess, Word } from "../type";

export default function useFetch () {

    const {
        id,
        cngId,
        cngUsername,
        cngProfPic,
        cngGuesses,
        cngOnline,
        cngServerError,
        confAccCreation,
    } = useAppStore();

    const { storeData, getData } = useLocalStorage();

    const getFetch = async (path: string, extra?:any) => {
        const token = getData("token");
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: {Authorization: `Bearer ${token}`}
        };

        await fetch(apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message)
                } else if (path === "/auth/whoami" && result.message === "Unauthorized") {
                    cngUsername("");
                    cngProfPic("");
                    cngOnline(false);
                } else if (path === "/auth/whoami" && result.message !== "Unauthorized") {
                    cngId(result.id)
                    cngUsername(result.username);
                    cngProfPic(result.avatar);
                    cngOnline(true);
                } else if (path === "/guesses/me") {
                    const newResult: Guess[] = result.map(guess => {
                        return {
                            guessId: guess.id,
                            word: guess.word,
                            guesses: guess.guesses,
                            success: guess.success
                        }
                    })
                    cngGuesses(newResult);
                } else if (path === "/words/random") {
                    let listDef = result.definition;
                    let newDefStart = listDef[0].toUpperCase();
                    let newDef = listDef.replace(listDef[0], newDefStart);
                    let newWord: Word = {
                        id: result.id,
                        word: result.normalizedWord,
                        definition: newDef
                    };
                    storeData("word", newWord);
                    let newGame = {
                        life: 7,
                        tried: "",
                        found: result.word.split("").map(() => " ")
                    }
                    extra(newGame)
                }
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
    
    const patchFetch = async (path: string, input:string) => {
        const token = getData("token");
        const myBody = JSON.stringify({
            username: input
        })
        let requestOptions: RequestInit = {
            method: 'PATCH',
            redirect: 'follow',
            body: myBody,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
        };

        await fetch(apiURL + path + id, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message)
                } else if (result.username) {
                    cngUsername(result.username);
                }
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    const postFetch = async (path: string, input: any) => {

        let myBody:any;
        switch (path) {
            case "/guesses":
                myBody = JSON.stringify({
                    "wordId": input.wordId,
                    "guesses": input.guesses
                });
                break;
            case "/users/change-avatar":
                myBody = new FormData();
                myBody.append("file", input);
                break;
            case "/auth/signin":
                myBody = JSON.stringify({
                    "email": input.email,
                    "password": input.password
                });
                break;
            case "/auth/signup":
                myBody = JSON.stringify({
                    "email": input.email,
                    "password": input.password
                });
                break;
            default:
                console.log("Unknown POST path.")
        }

        const token = getData("token");
        let myHeaders;
        switch (path) {
            case "/guesses":
                myHeaders = {"Authorization": `Bearer ${token}`};
                break;
            case "/users/change-avatar":
                myHeaders = {"Authorization": `Bearer ${token}`};
                break;
            case "/auth/signin":
                myHeaders = {"Content-Type": "application/json"};
                break;
            case "/auth/signup":
                myHeaders = {"Content-Type": "application/json"};
                break;
            default:
                console.log("Unknown POST path.")
        }

        let requestOptions: RequestInit = {
            method: 'POST',
            body: myBody,
            headers: myHeaders,
            redirect: 'follow',
        };

        await fetch (apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(
                        result.message ||
                        cngServerError(
                          <>Nekaj je šlo narobe, poskusite kasneje.</>
                        )
                      )
                } else if (path === "/auth/signin") {
                    const newToken = result.access_token;
                    storeData("token", newToken);
                    getFetch("/auth/whoami");
                    cngOnline(true);
                } else if (path === "/auth/signup") {
                    confAccCreation(<>Račun je bil uspešno ustvarjen.<br/>Sedaj se lahko prijaviš.</>);
                } else if (path === "/users/change-avatar") {
                    cngProfPic(URL.createObjectURL(input));
                }
            })
            .catch(error => {
                let sloError = <></>;
                switch(error.message) {
                    case ("Invalid email or password"):
                        sloError = <>Email ali geslo sta napačna.</>
                        break
                    case ("User not found"):
                        sloError = <>Email ali geslo sta napačna.</>
                        break
                    case ("Email in use"):
                        sloError = <>Email je že v uporabi.</>
                        break
                    default:
                        sloError = <>Nekaj je šlo narobe.<br />Poskusite kasneje ali nas opozorite o napaki.</>
                }
                cngServerError(sloError);
            }
        );
    }
    

    return { getFetch, postFetch, patchFetch }
}