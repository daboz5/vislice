import { Link } from "react-router-dom";
import useAppStore from "../Store";
import useMenu from "../utils/useMenu"

export default function LogedIn() {

    const { username } = useAppStore();
    const { handleLogout, setLoc, loc } = useMenu();

    return (
        <div
            className='loginMenu'>
            <div
                className='menuInfoBox'>
                {username}
            </div>
            <Link
                className="button"
                to={loc.to}
                onClick={() => setLoc({
                    to: window.location.pathname === "/" ?
                        "/" :
                        "account",
                    name: window.location.pathname === "/" ?
                    "Vislice" :
                    "Uporabniški račun"
                })}
                rel="noopener noreferrer">
                {loc.name}
            </Link>
            <Link
                className="button"
                to={""}
                onClick={handleLogout}
                rel="noopener noreferrer">
                Izpiši me
            </Link>
        </div>
    )
}