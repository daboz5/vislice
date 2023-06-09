import { useEffect } from "react";
import useAppStore from "../Store";
import useAcc from "../utils/useAcc"
import useFetch from "../utils/useFetch";
import "./Acc.css"

export default function AccountPage () {
    
    const {
        id,
        username,
        profPic,
    } = useAppStore();

    const {
        pastGames,
        ratio,
        iFile,
        picPreview,
        hoverLabel,
        setInputUsername,
        setHoverLable,
        handleUsername,
        handleAvatarChange,
        analizirajPodatke
    } = useAcc();

    const { postFetch } = useFetch();

    useEffect(() => {
        analizirajPodatke();
    }, [])

    return (
        <section className="accPage">
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
                                    src={profPic ?
                                        profPic :
                                        "user-astronaut-solid.svg"
                                    }
                                    style={profPic ?
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
                                style={hoverLabel ? {boxShadow: "0 0 3px"} : {}}
                                htmlFor="picBtn">
                                Izberi
                                <input
                                    type="file"
                                    id="picBtn"
                                    className="buttonHide"
                                    onChange={handleAvatarChange}
                                    accept="image/png, image/jpeg">
                                </input>
                            </label>
                            {picPreview &&
                                <button
                                    className="button"
                                    onClick={() => postFetch("/users/change-avatar", iFile)}
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
                    onClick={() => handleUsername()}
                    rel="noopener noreferrer">
                    Spremeni
                </button>

            </div>
            
            <div className="infoBox">
                <div
                    className="info"
                    style={{fontSize: 30}}>
                    {username}
                </div>
                <div className="info">
                    Zmage: {ratio.won}
                </div>
                <div className="info">
                    Opuščeno: {ratio.unfinished}
                </div>
                <div className="info">
                    Porazi: {ratio.lost}
                </div>
                <hr className="boardLine"/>
                <div id="pastGamesBox">
                    {pastGames}
                </div>
            </div>
        </section>
    )
}