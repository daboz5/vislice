import { useState } from 'react';
import { toast } from "react-hot-toast";
import { Guess, Ratio } from '../type';
import useAppStore from '../Store';
import useLocalStorage from './useLocalStorage';
import apiURL from './api_url';

export default function useAccount () {

    const { guesses, user, setUser } = useAppStore();
    const { getData } = useLocalStorage();

    const [ iFile, setIFile ] = useState<File>();
    const [ picPreview, setPicPreview ] = useState("");
    const [ inputUsername, setInputUsername ] = useState("");
    const [ hoverLabel, setHoverLable ] = useState(false);
    const [ ratio , setRatio ] = useState<Ratio>({ won: 0, lost: 0, unfinished: 0});

    const handleAvatarChange = (file: File) => {
        if (!file) {return}
        if (file.size > 1000000) {
            toast.error(
                `Največja dovoljena velikost je 1 Mb.
                Priporočeno razmerje stranic je 1:1.`
                );
        } else {
            const imgPreview = URL.createObjectURL(file);
            setPicPreview(imgPreview);
            setIFile(file);
        }
    }

    const handleUsername = async () => {
        const token = getData("token");
        if (!token) {return}
        
        if (inputUsername.length < 3) {
            toast.error(`Uporabniško ime naj ima vsaj 3 znake.`);
        } else if (inputUsername.length > 20) {
            toast.error(`Uporabniško ime naj nima več kot 20 znakov.`);
        } else {
            const myHeaders = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            };
            const myBody = JSON.stringify({username: inputUsername})
            const requestOptions: RequestInit = {
                method: 'PATCH',
                headers: myHeaders,
                body: myBody,
                redirect: 'follow'
            };
            await fetch(apiURL + "/users/" + user?.id, requestOptions)
                .then(response => response.json())
                .then((result) => {
                    if (result.error) {
                        throw new Error(result.message)
                    } else if (result.username && user) {
                        setUser({
                            id: user.id,
                            username: result.username,
                            profPic: user.profPic
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    const postPicFetch = async (input: File) => {
        const token = getData("token");
        if (!token) {return}

        const myHeaders = {"Authorization": `Bearer ${token}`};
        const myBody = new FormData();
        myBody.append("file", input);
        const requestOptions: RequestInit = {
            method: 'POST',
            body: myBody,
            headers: myHeaders,
            redirect: 'follow',
        };

        await fetch (apiURL + "/users/change-avatar", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message)
                } else if (user) {
                    setUser({
                        id: user.id,
                        username: user.username,
                        profPic: URL.createObjectURL(input)
                    });
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    const analizirajPodatke = () => {
        let won = 0;
        let lost = 0;
        let unfinished = 0;
        guesses.forEach((guess:Guess) => {
            const status = guess.success;
            status === true ? won++ :
            status === false ? lost++ :
            status === null && unfinished++
        });
        setRatio({won: won, lost: lost, unfinished: unfinished});
    }
    const pastGames = guesses.map(
        (game: Guess, index: number) => {
            const success = game.success;
            return (
                <div
                    className='pastGame'
                    key={"game"+(index+1)}>
                    <p>{game.word}</p>
                    <p></p>
                    {
                        success === true ?
                            <img
                                src="Yes.svg"
                                className="boardIcon"
                                alt="Win"
                            /> :
                        success === false ?
                            <img
                                src="No.svg"
                                className="boardIcon"
                                alt="Loss"
                            /> :
                        success === null &&
                            <img
                                src="Other.svg"
                                className="boardIcon"
                                alt="No result"
                            />
                    }
                </div>
            );
        }
    ).reverse();

    return {
        pastGames,
        ratio,
        iFile,
        picPreview,
        hoverLabel,
        setInputUsername,
        handleUsername,
        handleAvatarChange,
        setHoverLable,
        analizirajPodatke,
        postPicFetch
    }
}