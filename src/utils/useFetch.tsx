import useAppStore from "../Store";
import apiURL from "./api_url";
import useLocalStorage from "./useLocalStorage";

export default function useFetch () {

    const {
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
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token
            }
        };

        await fetch(apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message)
                } else if (path === "/auth/whoami" && result.message !== "Unauthorized") {
                    cngUsername(result.username);
                    cngProfPic(result.avatar);
                    cngOnline(true);
                }
            })
            .catch(error => {
                console.log(error);
                if (path === "/auth/whoami") {
                    cngOnline(false);
                }
            }
        );
    }
    
    const postFetch = async (path: string, input: any) => {
        const tokenData = getData("token");
        const token = `Bearer ${tokenData}`;
        let formdata = "";
        switch (path) {
            case "/guesses":
                formdata = JSON.stringify({
                    "wordId": input.wordId,
                    "guesses": input.guesses
                });
                break;
            case "/users/change-avatar":
                formdata = JSON.stringify({
                    "file": input,
                  });
                break;
            case "/auth/signin":
                formdata = JSON.stringify({
                    "email": input.email,
                    "password": input.password
                  });
                break;
            case "/auth/signup":
                formdata = JSON.stringify({
                    "email": input.email,
                    "password": input.password
                    });
                break;
            default:
                console.log("Unknown POST path.")
        }
        
        let requestOptions: RequestInit = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: token
            }
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
    

    return { getFetch, postFetch }
}