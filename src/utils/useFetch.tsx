import { Guess, Word } from "../type";
import useAppStore from "../Store";
import apiURL from "./api_url";
import useLocalStorage from "./useLocalStorage";

export default function useFetch () {

    const {
        id,
        cngId,
        cngUsername,
        cngProfPic,
        cngWord,
        cngGuesses,
        cngOnline,
        cngServerError,
        confAccCreation,
        cngServerConnectionError
    } = useAppStore();

    const { storeData, getData } = useLocalStorage();

    const getFetch = async (path: string, extra?:any) => {
        const token = getData("token");
        if (!token && path !== "/words/random") {return};
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: {Authorization: `Bearer ${token}`}
        };

        await fetch(apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message);
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
                    let newDef = listDef
                        .replace(listDef[0], newDefStart)
                        .replace(listDef[listDef.length-1], ".");
                    let newWord: Word = {
                        id: result.id,
                        word: result.normalizedWord,
                        definition: newDef
                    };
                    cngWord(newWord);
                    let newGame = {
                        life: 7,
                        tried: "",
                        found: result.word.split("").map(() => " ")
                    }
                    cngServerConnectionError(false);
                    extra(newGame)
                }
            }
        )
        .catch(error => {
            if (path === "/guesses/me") {
                cngServerConnectionError(true);
            }
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

        const token = getData("token");
        let myHeaders;
        switch (path) {
            case "/guesses":
                if (!token) {return};
                myHeaders = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`};
                break;
            case "/users/change-avatar":
                if (!token) {return};
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

        let requestOptions: RequestInit = {
            method: 'POST',
            body: myBody,
            headers: myHeaders,
            redirect: 'follow',
        };

        await fetch (apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
                if (result.message === "Email in use") {
                    cngServerError(<>Email je že v uporabi, izberite drugega.</>)
                } else if (result.error) {
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