import { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import useAppStore from '../Store';
import useFetch from "../utils/useFetch";
import "./AccountPage.css"

export default function AccountPage () {
    
    const {
        username,
        profilePic,
    } = useAppStore();
    
    const [ picPreview, setPicPreview ] = useState("");
    const [ inputUsername, setInputUsername ] = useState("");
    const [ hoverLabel, setHoverLable ] = useState(false);

    const { postFetch } = useFetch();

    let defPic = "user-astronaut-solid.svg";

    const handleAvatarChange = (event: any) => {
        let file: File = event.target.files[0];
        const fileSize = file.size
        const maxSize = 1000000;

        if (fileSize > maxSize) {
            toast.error(
                `Največja dovoljena velikost je 1 Mb.
                Priporočeno razmerje stranic je 1:1.`
            )
        } else {
            const imgPreview = URL.createObjectURL(file);
            setPicPreview(imgPreview);
            console.log(imgPreview, typeof imgPreview, picPreview)
        }
    }

    const handleUsername = () => {
        if (inputUsername.length < 3) {
            toast.error(
                `Uporabniško ime naj ima vsaj 3 znake.`
            )
        }
    };

    const hoverStyle = {boxShadow: "0 0 3px"}

    return (
        <div className="accPage">
            <div className="settingsBox">

                <h4>Profilna slika</h4>
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
                                        defPic
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
                                onMouseEnter={() => {setHoverLable(true)}}
                                onMouseLeave={() => {setHoverLable(false)}}
                                style={hoverLabel ? hoverStyle : {}}
                                htmlFor="picBtn">
                                Izberi
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
                                    onClick={() => postFetch("/users/change-avatar", profilePic)}
                                    rel="noopener noreferrer"
                                    style={{marginLeft: "10px"}}>
                                    Potrdi
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
                    rel="noopener noreferrer">
                    Spremeni
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