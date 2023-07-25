import useAppStore from "../Store"
import BulbIcon from "../icons/BulbIcon";
import "./Help.css";

export default function Help () {

    const { help, darkMode, switchHelp } = useAppStore();

    const turnLightOn = () => {
        const light = document.getElementById("lightSource");
        if (light) {
            light.style.opacity = "1";
            light.style.backgroundColor = "rgb(255, 255, 255)"
            light.style.boxShadow = "0 0 10px 5px white, inset 0 0 3px 1px yellow";
        }
    }
    
    const turnLightOff = () => {
        const light = document.getElementById("lightSource");
        if (light) {
            light.style.opacity = "0.7";
            light.style.backgroundColor = "rgb(0, 0, 50)";
            light.style.boxShadow = "none";
        }
    }
    
    const handleBtnClick = () => {
        const bulb = document.getElementById("bulb");
        if (bulb && help) {
            bulb.style.opacity = "1";
            bulb.style.fill = "rgb(255, 255, 50)";
        }
        if (bulb && !help) {
            bulb.style.opacity = "0.7";
            darkMode ?
                bulb.style.fill = "#000B60" :
                bulb.style.fill = "#AFE2FF";
        }
        switchHelp();
    }

    return (
        <>
            <div
                id="infoBtnBox"
                onMouseEnter={() => {
                    !help && turnLightOn()
                }}
                onMouseLeave={() => {
                    !help && turnLightOff()
                }}
                onClick={() => handleBtnClick()}
                style={darkMode ?
                    {backgroundColor: "rgba(240, 248, 255, 0.6)"} :
                    {backgroundColor: "aliceblue"}
                }>
                <BulbIcon />
                <div id="lightSource">
                </div>
            </div>

            {help &&
                <div id="helpMenuBox">
                    <div
                        id="helpScreen"
                        onClick={() => {
                            switchHelp()
                            help ?
                                turnLightOff() :
                                turnLightOn()
                        }}>
                    </div>
                    <div className="helpMenu">
                        <h3>Info</h3>
                        <div id="infoBox">
                            <p className="informacije">Vislice so otroška igra za vse starosti.</p>
                            <p className="informacije"><b>Za zmago je potrebno uganiti vse črke v besedi, preden ti zmanjka življenj.</b></p>
                            <p className="informacije">V kolikor zmagaš ali izgubiš, se pokaže iskana beseda ter njena definicija.</p>
                            <p className="informacije">Igra vključuje vse besede in definicije iz SSKJ. Žal SSKJ ne ponuja javno dostopne podatkovne datoteke, zato je bilo uporabljeno praskanje SSKJ spletne strani. Nekatere definicije so zaradi nestandardnih SSKJ struktur pomanjkljive. V kolikor opazite tovrstno definicijo, prosimo za razumevanje.</p>
                            <p className="informacije">Če si prijavljen, se bodo rezultati beležili na tvoj račun.</p>
                            <p className="informacije">Beležena stanja so <b>rešen</b>, <b>obešen</b> ter <b>neodločeno</b>.</p>
                            <p className="informacije">Če želiš igrati z manj pritiska in samo uživati v iskanju besed, lahko stisneš <b>zeleni gumb.</b></p>
                            <p className="informacije">Zeleni gumb izklopi odštevanje življenja in beleženje rezultatov dokler ni izbrana naslednja beseda, pri kateri gumb ni bil vklopljen.</p>
                            <p className="informacije">Če naletiš na tehnične težave, jih je mogoče prijaviti na <b>aljaz.bozicko@aol.com</b>.</p>
                            <p className="informacije">Uživaj :)</p>
                        </div>
                    </div>
                    <div id="zaslugaBox" className="helpMenu">
                        <h3>Zasluge</h3>
                        <div className="zasluga">
                            <p>Spletna stran in kreator</p>
                            <p><b>Aljaž Božičko</b></p>
                        </div>
                        <div className="zasluga">
                            <p>Podatkovna baza in mentor</p>
                            <p><b>Klemen Fajs</b></p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}