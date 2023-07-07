import useAppStore from "../Store";
import apiURL from "./api_url";
import useLocalStorage from "./useLocalStorage";

export default function useFetch () {

    let log = console.log

    const {
        cngId,
        cngUsername,
        cngProfPic,
        cngOnline,
        cngServerError,
        confirmAccCreation
    } = useAppStore();

    const { storeData, getData } = useLocalStorage();

    const getFetch = async (path: string) => {
        const tokenData = getData("token");
        const token = `Bearer ${tokenData}`;
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: {
              Accept: "application/json",
              Authorization: token
            }
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
                }
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
    
    const patchFetch = async (path: string, id:number, input:string) => {
        const tokenData = getData("token");
        const token = `Bearer ${tokenData}`;
        let requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: {
              Accept: "application/json",
              Authorization: token
            }
        };

        await fetch(apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message)
                } else if (path === "/users/{id}") {
                    console.log("should work")
                }
            })
            .catch(error => {
                console.log(error);
            }
        );
    }

    const postFetch = async (path: string, input: any) => {

        let myBody;
        switch (path) {
            case "/guesses":
                myBody = JSON.stringify({
                    "wordId": input.wordId,
                    "guesses": input.guesses
                });
                break;
            case "/users/change-avatar":
                myBody = JSON.stringify({
                    "file": input
                });
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
        
        const tokenData = getData("token");
        const token = `Bearer ${tokenData}`;
        let myHeaders;
        switch (path) {
            case "/guesses":
                myHeaders = {"Authorization": token};
                break;
            case "/users/change-avatar":
                myHeaders = {"Authorization": token};
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

        console.log(input, requestOptions)

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
                    confirmAccCreation(<>Račun je bil uspešno ustvarjen.<br/>Sedaj se lahko prijaviš.</>);
                } else if (path === "/users/change-avatar") {
                    cngProfPic(input);
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