import { useState } from 'react';
import { toast } from "react-hot-toast";
import { Guess, Ratio } from '../type';
import useFetch from './useFetch';
import useAppStore from '../Store';

export default function useAcc () {

    const { guesses } = useAppStore();

    const [ iFile, setIFile ] = useState<File>();
    const [ picPreview, setPicPreview ] = useState("");
    const [ inputUsername, setInputUsername ] = useState("");
    const [ hoverLabel, setHoverLable ] = useState(false);
    const [ ratio , setRatio ] = useState<Ratio>({ won: 0, lost: 0, unfinished: 0});

    const { patchFetch } = useFetch();

    const handleAvatarChange = (event: any) => {
        let file: File = event.target.files[0];
        setIFile(file);
        const maxSize = 1000000;

        if (file.size > maxSize) {
            toast.error(
                `Največja dovoljena velikost je 1 Mb.
                Priporočeno razmerje stranic je 1:1.`
            )
        } else {
            const imgPreview = URL.createObjectURL(file);
            setPicPreview(imgPreview);
        }
    }

    const handleUsername = () => {
        if (inputUsername.length < 3) {
            toast.error(
                `Uporabniško ime naj ima vsaj 3 znake.`
            )
        } else {
            patchFetch("/users/", inputUsername);
        }
    };

    const analizirajPodatke = () => {
        let won = 0;
        let lost = 0;
        let unfinished = 0;
        guesses.forEach((guess:Guess) => {
            const status = guess.success;
            status === true ? won++ :
            status === false ? lost++ :
            status === null && unfinished++
        })
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
    );

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
        analizirajPodatke
    }
}