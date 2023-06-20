import { useState } from "react";
import { toast } from "react-hot-toast";
import useAppStore from '../Store.ts';
import apiURL from "../utils/api_url.ts";
import "./AccountPage.css"

const AccountPage = () => {
    
    const {
        token,
        username,
        profilePic,
        changeProfilePic,
        changeUsername
    } = useAppStore();
    
    const [picPreview, setPicPreview] = useState(null);
    const [picFile, setPicFile] = useState(null);
    const [inputUsername, setInputUsername] = useState("");
    const [hoverLabel, setHoverLable] = useState(false);

    let pic = "user-astronaut-solid.svg";

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        const fileSize = file.size
        const maxSize = 1000000;

        if (fileSize > maxSize) {
            toast.error(
                `Največja dovoljena velikost je 1 Mb.
                Priporočeno razmerje stranic je 1:1.`
            )
        } else {
            setPicFile(file);
            const imgPreview = URL.createObjectURL(file);
            setPicPreview(imgPreview);
        }
    }
    
    const handleAvatarConfirmation = async () => {
        var formdata = new FormData();
        formdata.append("file", picFile);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        await fetch(apiURL + "/users/change-avatar", requestOptions)
        .then(response => response.json())
        .then(() => {
            changeProfilePic(picPreview);
            setPicPreview(null);
        })
        .catch(error => {
            console.log(error);
            toast.error = (
                `Nekaj je šlo narobe.
                Znova poskusite kasneje ali nas opozorite o napaki.`
            );
        });
    }

    const handleUsername = () => {
        if (inputUsername.length < 3) {
            toast.error(
                `Uporabniško ime naj ima vsaj 3 znake.`
            )
        }

        var requestOptions = {
            method: 'POST',
            //body: inputUsername,
            redirect: 'follow',
            credentials: "include"
        };

        fetch(apiURL + "/auth/!!!!!!!!!!!!!", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            changeUsername(inputUsername);
            document.getElementById("accNameInput").value = "";
        })
        .catch(error => {
            console.log(error);
            toast.error = (
                `Nekaj je šlo narobe.
                Znova poskusite kasneje ali nas opozorite o napaki.`
            );
        });

    };

    const handleMouseEnter = () => {
        setHoverLable(true);
    }
    const handleMouseLeave = () => {
        setHoverLable(false);
    }
    const hoverStyle = {boxShadow: "0 0 3px"}

    return (
        <div className="accPage">
            <div className="settingsBox">
                <h4 alt="Slika profila">Profilna slika</h4>
                    
                    <div className="changeAvatarBox">
                        <div className="avatarBox">
                            {picPreview ?
                                <img
                                    src={picPreview}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%"
                                    }}
                                    alt="Slika profila"
                                /> :
                                <img
                                    src={profilePic ?
                                        profilePic :
                                        pic
                                    }
                                    style={profilePic ?
                                        {
                                            maxWidth: "100%",
                                            maxHeight: "100%"
                                        } :
                                        {
                                            maxWidth: "75%",
                                            maxHeight: "75%"
                                        }
                                    }
                                    alt="Nova slika profila"
                                />
                            }
                        </div>
                        <div>
                            <label
                                className="button"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                style={hoverLabel ?
                                    hoverStyle :
                                    {}
                                }
                                htmlFor="picBtn"
                                >Izberi
                                <input
                                    type="file"
                                    id="picBtn"
                                    className="buttonHide"
                                    onChange={handleAvatarChange}
                                    accept="image/png, image/jpeg, image/webp">
                                </input>
                            </label>
                            {picPreview &&
                                <button
                                    className="button"
                                    onClick={() => handleAvatarConfirmation()}
                                    rel="noopener noreferrer"
                                    style={{marginLeft: "10px"}}
                                    >Potrdi
                                </button>
                            }
                        </div>
                    </div>

                <h4>Ime računa</h4>
                <input
                    id="accNameInput"
                    placeholder={username}
                    onChange={(event) => setInputUsername(event.target.value)}
                />
                <button
                    className="button"
                    rel="noopener noreferrer"
                    >Spremeni
                </button>

            </div>
            
            <div className="infoBox">
                {username &&
                    <div
                        className="info"
                        style={{fontSize: 30}}
                        >{username}
                    </div>
                }
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