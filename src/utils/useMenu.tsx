import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import useAppStore from '../Store';
import useLocalStorage from '../utils/useLocalStorage';
import apiURL from './api_url';

export default function useMenu() {

    const {
        user,
        help,
        darkMode,
        menuOpened,
        setUser,
        switchHelp,
        switchDarkMode,
        switchMenuState,
        setServerError,
        confAccCreation
    } = useAppStore();

    const { storeData, removeData, getData } = useLocalStorage();
    const { register, handleSubmit } = useForm<FieldValues>();
    const [passErr, setPassErr] = useState<JSX.Element | null>(null);
    const [mailErr, setMailErr] = useState<JSX.Element | null>(null);
    const [showPass, setShowPass] = useState(false);
    const [menuType, setMenuType] = useState({
        regOpened: false,
        string: <>Potrebuješ nov račun? Klikni tukaj.</>
    });
    const [loc, setLoc] = useState({
        to: window.location.pathname === "/" ?
            "account" :
            "/",
        name: window.location.pathname === "/" ?
            "Uporabniški račun" :
            "Vislice",
    });


    const handleReset = () => {
        setUser(null);
        setMailErr(null);
        setPassErr(null);
        setServerError(null);
    }

    const handleBtnClick = () => {
        if (help) { switchHelp() }
        storeData("menuOpened", !menuOpened);
        switchMenuState(!menuOpened);
    }

    const handleDarkBtnClick = () => {
        storeData("darkMode", !darkMode);
        switchDarkMode(!darkMode);
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

    const eventListener = (event: KeyboardEvent) => {
        if (!user && event.key === "Enter") {
            handleSubmit(onSubmit)();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        handleReset();
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const emailCheck = emailRegex.test(data.logEmail);
        const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
        const passCheck = passRegex.test(data.logPassword1);
        if (!emailCheck) {
            const emailErr = <>Neustrezen epoštni naslov.</>
            setMailErr(emailErr);
            return;
        }
        if (!passCheck) {
            const passwordErr =
                <>
                    Neustrezno geslo.<br />
                    Ustrezno geslo vsebuje:<br />
                    &ensp;- vsaj 6 znakov<br />
                    &ensp;- vsaj eno črko<br />
                    &ensp;- vsaj eno številko
                </>
            setPassErr(passwordErr);
            return;
        } else if (data.logPassword2 && data.logPassword1 !== data.logPassword2) {
            const passwordErr = <>Gesli se ne ujemata.</>;
            setPassErr(passwordErr);
            return;
        }
        if (!data.logPassword2) {
            signFetch("/auth/signin", data.logEmail, data.logPassword1);
        } else {
            signFetch("/auth/signup", data.logEmail, data.logPassword1);
        }
    };

    const signFetch = async (path: string, emailData: string, passwordData: string) => {
        const myHeaders = { "Content-Type": "application/json" }
        const myBody = JSON.stringify({ "email": emailData, "password": passwordData });

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: myBody,
            redirect: 'follow',
        };

        await fetch(apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.message === "Email in use") {
                    setServerError(<>Email je že v uporabi, izberite drugega.</>)
                } else if (result.error) {
                    throw new Error(
                        result.message ||
                        setServerError(<>Nekaj je šlo narobe, poskusite kasneje.</>)
                    )
                } else if (path === "/auth/signin") {
                    const newToken = result.access_token;
                    storeData("token", newToken);
                    fetchMyData();
                } else if (path === "/auth/signup") {
                    confAccCreation(<>
                        Račun je bil uspešno ustvarjen.<br />
                        Sedaj se lahko prijaviš.
                    </>);
                }
            })
            .catch(error => {
                let sloError = <></>;
                switch (error.message) {
                    case ("Invalid email or password"):
                        sloError = <>Email ali geslo sta napačna.</>
                        break
                    case ("User not found"):
                        sloError = <>Email ali geslo sta napačna.</>
                        break
                    case ("Email in use"):
                        sloError = <>Email je že v uporabi.</>
                        break
                    default:
                        sloError = <>
                            Nekaj je šlo narobe.<br />
                            Poskusite kasneje ali nas opozorite o napaki.
                        </>
                }
                setServerError(sloError);
            })
    }

    const handleLogout = () => {
        handleReset();
        removeData("token");
        handleBtnClick();
    }

    const handleLocChange = () => {
        setLoc({
            to: window.location.pathname === "/" ?
                "/" :
                "account",
            name: window.location.pathname === "/" ?
                "Vislice" :
                "Uporabniški račun"
        });
        handleBtnClick();
    }


    const fetchMyData = useCallback(async () => {
        const token = getData("token");
        if (!token) { return }

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            redirect: 'follow'
        };

        await fetch(apiURL + "/auth/whoami", requestOptions)
            .then(response => response.json())
            .then((result) => {
                if (result.error) {
                    throw new Error(result.message);
                } else if (result.message === "Unauthorized") {
                    setUser(null)
                } else if (result.message !== "Unauthorized") {
                    setUser({
                        id: result.id,
                        username: result.username,
                        profPic: result.avatar
                    })
                }
            }
            )
            .catch(error => {
                console.log(error);
            });
    }, [setUser, getData])


    const btn = (
        <div
            className="mainBtn"
            onClick={() => handleBtnClick()}>
            <img
                id="mainBtnImg"
                src={
                    user?.profPic ?
                        user.profPic :
                        "user-astronaut-solid.svg"
                }
                style={
                    user?.profPic ?
                        { maxHeight: "100%", maxWidth: "100%" } :
                        { maxHeight: "75%", maxWidth: "75%" }
                }
                alt="Slika profila"
            />
        </div>
    )

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
                style={{ opacity: darkMode ? "0" : "1" }}
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
        setShowPass,
        handleLocChange,
        handleBtnClick,
        cngMenuType,
        handleLogout,
        handleSubmit,
        onSubmit,
        register,
        eventListener,
        fetchMyData,
    };
}