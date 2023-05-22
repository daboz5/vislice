import { useState } from "react";
import Button from "../app/Button";
import "../app/AccountPage.css"

const AccoutPage = () => {

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [pic, setPic] = useState("user-astronaut-solid.svg");
    const [picPreview, setPicPreview] = useState(null);

    const handleAvatarChange = (event) => {
        const selectedFile = event.target.files[0];
        const imgPreview = URL.createObjectURL(selectedFile)
        setPicPreview(imgPreview)
    }

    const handleAvatarConfirmation = () => {
        setPic(picPreview);
        setPicPreview(null);
    }

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
                                onChange={handleAvatarConfirmation}
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
                <input/>
                <Button button="normal">Spremeni</Button>

                <h4>Email</h4>
                {email ?
                    <input /> :
                    <input />}
                <Button button="normal">Spremeni</Button>

                <h4>Geslo</h4>
                {password ?
                    <input /> :
                    <input />}
                <Button button="normal">Spremeni</Button>
            </div>
            
            <div className="infoBox">
                <div className="info">Zmage</div>
                <div className="info">Porazi</div>
                <div className="info">Razmerje</div>
            </div>
        </div>
    )
}

export default AccoutPage;