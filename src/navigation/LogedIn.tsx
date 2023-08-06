import { Link } from "react-router-dom";
import useAppStore from "../Store";
import useMenu from "../utils/useMenu"
import useRoot from "../utils/useRoot";

export default function LogedIn() {

    const { user } = useAppStore();
    const { boxShadowStyleBtnDef, handleBtnClickStyle } = useRoot();
    const { handleLogout, handleLocChange, loc } = useMenu();

    return (
        <div
            className='loginMenu'>
            <h3
                className='menuInfoBox'>
                {user?.username}
            </h3>
            <Link
                className="button"
                to={loc.to}
                onClick={() => handleLocChange()}
                onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
                onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
                onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
                style={{ boxShadow: boxShadowStyleBtnDef, fontWeight: "800" }}
                rel="noopener noreferrer">
                {loc.name}
            </Link>
            <Link
                className="button"
                to={""}
                onClick={handleLogout}
                onMouseDown={(e) => handleBtnClickStyle(e.currentTarget, true)}
                onMouseUp={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
                onMouseLeave={(e) => handleBtnClickStyle(e.currentTarget, false, true)}
                style={{ boxShadow: boxShadowStyleBtnDef, fontWeight: "800" }}
                rel="noopener noreferrer">
                Izpiši me
            </Link>
        </div>
    )
}