import { Link } from "react-router-dom";
import { useState } from "react";
import useAppStore from '../Store.ts';
import "./AccountPage.css"

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

        await fetch("http://localhost:3000/auth/change-avatar", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

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
                        <label>
                            <span
                                className="previewImgBtn"
                                >Spremeni
                            </span>
                            <input
                                type="file"
                                className="previewImgBtnHide"
                                onClick={handleAvatarChange}
                                accept="image/png, image/jpeg, image/webp">
                            </input>
                        </label>
                        <Link
                            className="button-normal"
                            onClick={handleAvatarConfirmation}
                            rel="noopener noreferrer"
                            >Potrdi
                        </Link>
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
                        <label>
                            <span
                                className="previewImgBtn"
                                >Izberi sliko
                            </span>
                            <input
                                type="file"
                                className="previewImgBtnHide"
                                onClick={handleAvatarChange}
                                accept="image/png, image/jpeg, image/webp">
                            </input>
                        </label>
                    </div>}

                <h4>Ime računa</h4>
                <input
                    placeholder={username}
                    onChange={(event) => setInputUsername(event.target.value)}/>
                <div className="buttonBox">
                    <Link
                        className="button-normal"
                        rel="noopener noreferrer"
                        >Spremeni
                    </Link>
                        {inputUsername &&
                            <Link
                                className="button-normal"
                                onClick={handleUsername}
                                rel="noopener noreferrer"
                                >Potrdi
                            </Link>
                        }
                </div>

                <h4>Geslo</h4>
                <input onChange={(event) => setInputPassword(event.target.value)}/>
                <div className="buttonBox">
                    <Link
                        className="button-normal"
                        rel="noopener noreferrer"
                        >Spremeni
                    </Link>
                        {inputUsername &&
                            <Link
                                className="button-normal"
                                onClick={handlePassword}
                                rel="noopener noreferrer"
                                >Potrdi
                            </Link>
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