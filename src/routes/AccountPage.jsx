import { useState } from "react";
import Button from "../app/Button";
import useAppStore from '../Store.ts';
import "../app/AccountPage.css"

const AccountPage = () => {

    const { username, changeProfilePic, changeUsername } = useAppStore();

    const [serverError, setServerError] = useState(null);
    const [picPreview, setPicPreview] = useState(null);
    const [picFile, setPicFile] = useState(null);
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    let pic = "user-astronaut-solid.svg";

    const handleAvatarChange = (event) => {
        setPicFile(event.target.files[0]);
        const imgPreview = URL.createObjectURL(event.target.files[0])
        setPicPreview(imgPreview)
    }
    
    const calcAvatarSize = () => {
        const fileSize = picPreview.files[picPreview]
        const maxSize = 1000000;
        console.log(fileSize, maxSize)
        if (fileSize > maxSize) {
            alert(`Slika je prevelika, največja dovoljena velikost je ${fileSize}`)
        } else {
            console.log("uspeh")
        }
    }
    
    const handleAvatarConfirmation = async (event) => {
        event.preventDefault();
        changeProfilePic(picPreview);
        setPicPreview(null);
        
        var formdata = new FormData();
        formdata.append("file", picFile);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            credentials: "include"
        };
/*
        fetch("http://localhost:3000/auth/change-avatar", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
*/
        fetch("http://localhost:3000/auth/whoami", {credentials:"include"})
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }

    const handleUsername = () => {
        changeUsername();
/*
        fetch("http://localhost:3000/auth/change-avatar", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
*/
    };

    const handlePassword = () => {
/*
        fetch("http://localhost:3000/auth/change-avatar", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
*/
    };

    return (
        <div className="accPage">
            <div className="settingsBox">
                <h4 alt="Slika profila">Profilna slika</h4>
                {picPreview ?
                    <div className="changeAvatarBox">
                        <div
                            className="avatarBox"
                            style={{backgroundImage: `url(${picPreview})`}}>
                        </div>
                        <div className="buttonBox">
                            <Button
                                button="img"
                                onChange={handleAvatarChange}
                                >Spremeni
                            </Button>
                            <Button
                                button="normal"
                                onClick={handleAvatarConfirmation}
                                >Potrdi
                            </Button>
                        </div>
                    </div> :
                    <div className="changeAvatarBox">
                        <div className="avatarBox">
                            <img
                                className="profilkaDef"
                                src={pic}
                                alt="Slika profila"
                            />
                        </div>
                        <Button
                            button="img"
                            onChange={handleAvatarChange}
                            >Izberi sliko
                        </Button>
                    </div>}

                <h4>Ime računa</h4>
                <input
                    placeholder={username}
                    onChange={(event) => setInputUsername(event.target.value)}/>
                <div className="buttonBox">
                    <Button button="normal">Spremeni</Button>
                    {inputUsername &&
                        <Button
                        button="normal"
                        onClick={handleUsername}
                        >Potrdi
                        </Button>
                    }
                </div>

                <h4>Geslo</h4>
                <input onChange={(event) => setInputPassword(event.target.value)}/>
                <div className="buttonBox">
                    <Button button="normal">Spremeni</Button>
                    {inputPassword &&
                        <Button
                            button="normal"
                            onClick={handlePassword}
                            >Potrdi
                        </Button>
                    }
                </div>
            </div>
            
            <div className="infoBox">
                <div className="info">
                    Zmage: 0
                </div>
                <div className="info">
                    Porazi: 0
                </div>
                <hr
                    style={{
                        height: "5px",
                        width: "30vw",
                        backgroundColor: "black"
                    }}
                />
                <div
                    className="info"
                    >Zmage vs Porazi
                    <div>
                        0 : 0
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountPage;