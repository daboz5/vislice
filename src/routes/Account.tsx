import { useEffect } from "react";
import useAppStore from "../Store";
import useAccount from "../utils/useAccount"
import useRoot from "../utils/useRoot";
import "./Account.css"

export default function Account() {

    const { user, darkMode } = useAppStore();

    const {
        pastGames,
        ratio,
        iFile,
        picPreview,
        setInputUsername,
        handleUsername,
        handleAvatarChange,
        postPicFetch,
        fetchMyResults
    } = useAccount();

    const {
        boxShadowStyleBtn,
        handleBtnClickStyle
    } = useRoot();

    useEffect(() => {
        fetchMyResults();
    }, [])

    return (
        <section className="accPage">
            <div className="settingsBox">

                <h4>Profilna slika</h4>
                <div className="avatarBox">
                    <img
                        src={picPreview ?
                            picPreview :
                            user?.profPic ?
                                user.profPic :
                                "user-astronaut-solid.svg"
                        }
                        style={picPreview ?
                            {} :
                            user?.profPic ?
                                {} :
                                { maxWidth: "75%", maxHeight: "75%" }
                        }
                        alt={picPreview ?
                            "Nova slika profila" :
                            "Slika profila"
                        }
                    />
                </div>
                <div id="picCngBtnBox">
                    <label
                        className="button"
                        onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
                        onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false)}
                        onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false)}
                        style={{ boxShadow: boxShadowStyleBtn, fontWeight: "800" }}
                        htmlFor="picBtn">
                        Izberi
                        <input
                            type="file"
                            id="picBtn"
                            className="buttonHide"
                            onChange={(event) => handleAvatarChange(event.currentTarget.files![0])}
                            accept="image/png, image/jpeg">
                        </input>
                    </label>
                    {picPreview &&
                        <button
                            className="button"
                            onClick={() => postPicFetch(iFile!)}
                            onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
                            onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false)}
                            onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false)}
                            style={{ boxShadow: boxShadowStyleBtn }}
                            rel="noopener noreferrer">
                            Potrdi
                        </button>
                    }
                </div>

                <h4>Ime računa</h4>
                <input
                    id="accNameInput"
                    placeholder={user?.username}
                    onChange={(event) => setInputUsername(event.target.value)}
                />
                <button
                    className="button"
                    onClick={() => handleUsername()}
                    onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
                    onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false)}
                    onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false)}
                    style={{ boxShadow: boxShadowStyleBtn }}
                    rel="noopener noreferrer">
                    Spremeni
                </button>

            </div>

            <div className="infoBox">
                <div
                    className="info"
                    style={{ fontSize: 30 }}>
                    {user?.username}
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
                <hr className="boardLine" />
                <div
                    id="pastGamesBox"
                    className={!darkMode ? "scrollDay" : "scrollNight"}>
                    {pastGames}
                </div>
            </div>
        </section>
    )
}