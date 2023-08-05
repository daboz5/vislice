import useAppStore from "../Store"
import BulbIcon from "../assets/BulbIcon";
import Chains from "../assets/Chains";
import "./Help.css";

export default function Help() {

    const {
        darkMode,
        help,
        switchBulbOn,
        switchHelp
    } = useAppStore();

    const style = {
        boxShadow: darkMode ?
            `2px -2px 2px 1px white,
            2px -2px 10px 1px black,
            -1px 2px 5px 2px black,
            -2px 3px 3px 1px white` :
            `1px -1px 3px 1px white,
            -1px 2px 5px 2px black`
    }

    return (
        <>
            <div className="swingBulb">
                <div id="infoBtnBox">
                    <Chains />
                    <BulbIcon />
                </div>
            </div>

            {help &&
                <div id="helpMenuBox">
                    <div
                        id="helpScreen"
                        onClick={() => {
                            switchHelp();
                            if (help) { switchBulbOn() }
                        }}>
                    </div>
                    <div className="helpMenu" style={style}>
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
                    <div id="zaslugaBox" className="helpMenu" style={style}>
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