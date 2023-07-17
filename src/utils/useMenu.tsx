import { useForm } from 'react-hook-form';
import { useState } from 'react';
import useAppStore from '../Store';
import useLocalStorage from '../utils/useLocalStorage';
import useFetch from './useFetch';

export default function useMenu() {

    const {
        darkMode,
        profPic,
        online,
        menuOpened,
        cngDarkMode,
        switchMenuState,
        cngUsername,
        cngProfPic,
        cngOnline,
        cngServerError
    } = useAppStore();

    const { storeData, removeData } = useLocalStorage();
    const { register, handleSubmit } = useForm();
    const { postFetch } = useFetch();

    const [ passErr, setPassErr ] = useState<JSX.Element | null>(null);
    const [ mailErr, setMailErr ] = useState<JSX.Element | null>(null);
    const [ showPass, setShowPass ] = useState(false);
    const [ menuType, setMenuType ] = useState({
        regOpened: false,
        string: <>Potrebuješ nov račun? Klikni tukaj.</>
    });
    const [ loc, setLoc ] = useState({
        to: window.location.pathname === "/" ?
            "account" :
            "/",
        name: window.location.pathname === "/" ?
        "Uporabniški račun" :
        "Vislice",
    });
    
    const handleBtnClick = () => {
        storeData("menuOpened", !menuOpened);
        switchMenuState(!menuOpened);
    }
    
    const cngMenuType = () => {
        handleReset();
        menuType.regOpened ?
        setMenuType({
            regOpened: false,
            string: <>Potrebuješ nov račun? Klikni tukaj.</>
        }) :
        setMenuType({
            regOpened: true,
            string: <>Že imaš račun? Klikni tukaj.</>
        });
    }
  
    const handleReset = () => {
        cngUsername("");
        cngProfPic("");
        setMailErr(null);
        setPassErr(null);
        cngServerError(null);
        cngOnline(false)
    }
  
    const eventListener = (event) => {
        if (!online && event.key === "Enter") {
            handleSubmit(onSubmit);
        }
    }
  
    const onSubmit = (data) => {
        handleReset();
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const emailCheck = emailRegex.test(data.logEmail);
        const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
        const passCheck = passRegex.test(data.logPassword1);
        if (!emailCheck) {
            const emailErr = <>Neustrezen epoštni naslov.</>
            setMailErr(emailErr);
            return
        }
        if (!passCheck) {
            const passwordErr =
                <>
                    Neustrezno geslo.<br/>
                    Ustrezno geslo vsebuje:<br/>
                    &ensp;- vsaj 6 znakov<br/>
                    &ensp;- vsaj eno črko<br/>
                    &ensp;- vsaj eno številko
                </>
            setPassErr(passwordErr);
            return
        } else if (data.logPassword2 && data.logPassword1 !== data.logPassword2 ) {
            const passwordErr = <>Gesli se ne ujemata.</>;
            setPassErr(passwordErr);
            return
        }
  
        const input = {
            "email": data.logEmail,
            "password": data.logPassword1
        }
        if (!data.logPassword2) {
            postFetch("/auth/signin", input);
        } else {
            postFetch("/auth/signup", input);
        }
    };
  
    const handleLogout = () => {
        handleReset();
        removeData("token");
        cngOnline(false);
    }

    const btn = (
        <div
            className="mainBtn"
            onClick={() => handleBtnClick()}>
            <img
            id="mainBtnImg"
            src={
                profPic ?
                profPic :
                "user-astronaut-solid.svg"
            }
            style=
            {
                profPic ?
                {maxHeight: "100%", maxWidth: "100%"} :
                {maxHeight: "75%", maxWidth: "75%"}
            }
            alt="Slika profila"
            />
        </div>
    )

    const handleDarkBtnClick = () => {
        storeData("darkMode", !darkMode);
        cngDarkMode(!darkMode);
    }

    const darkBtn = (
        <div
            id="darkBtn"
            className="mainBtn"
            onClick={() => handleDarkBtnClick()}>
            <img
                id="darkBtnImg"
                src="Moon.svg"
                alt="dark mode btn"
            />
            <img
                id="lightBtnImg"
                src="Sun.svg"
                style={{opacity: darkMode ? "0" : "1"}}
                alt="light mode btn"
            />
        </div>
    )

    return {
        btn,
        darkBtn,
        loc,
        mailErr,
        passErr,
        menuType,
        showPass,
        setLoc,
        setShowPass,
        handleBtnClick,
        cngMenuType,
        handleLogout,
        handleSubmit,
        onSubmit,
        register,
        eventListener,
    };
}