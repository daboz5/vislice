import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import useAppStore from '../Store';
import useLocalStorage from '../utils/useLocalStorage';
import apiURL from './api_url';
import { useQuery } from '@tanstack/react-query';

export default function useMenu() {

    const {
        user,
        help,
        darkMode,
        menuOpened,
        menuType,
        switchMenuType,
        setUser,
        switchBulbOn,
        switchHelp,
        switchDarkMode,
        switchMenuState,
        setServerError,
    } = useAppStore();

    const { storeData, removeData, getData } = useLocalStorage();
    const { register, reset, handleSubmit } = useForm<FieldValues>({
        defaultValues: {
            logEmail: "",
            logPassword1: "",
            logPassword2: ""
        }
    });
    const [passErr, setPassErr] = useState<JSX.Element | null>(null);
    const [mailErr, setMailErr] = useState<JSX.Element | null>(null);
    const [fetchData, setFetchData] = useState({
        email: "",
        password: ""
    }
    );
    const [showPass, setShowPass] = useState(false);
    const [loc, setLoc] = useState({
        to: window.location.pathname === "/" ?
            "account" :
            "/",
        name: window.location.pathname === "/" ?
            "Uporabniški račun" :
            "Vislice",
    });

    const handleReset = () => {
        setMailErr(null);
        setPassErr(null);
        setServerError(null);
        setFetchData({
            email: "",
            password: ""
        })
    }

    const handleBtnClick = () => {
        if (help) {
            switchHelp();
            switchBulbOn();
        }
        storeData("menuOpened", !menuOpened);
        switchMenuState(!menuOpened);
    }

    const handleDarkBtnClick = () => {
        storeData("darkMode", !darkMode);
        switchDarkMode(!darkMode);
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
        signFetchFn({
            email: data.logEmail,
            password: data.logPassword1
        })
        // if (!data.logPassword2) {
        //     setFetchData({
        //         email: data.logEmail,
        //         password: data.logPassword1
        //     });
        // } else {
        //     setFetchData({
        //         email: data.logEmail,
        //         password: data.logPassword1
        //     });
        // }
    };

    const signFetchFn = async (formData) => {
        const path = menuType ? "/auth/signup" : "/auth/signin"
        const myHeaders = { "Content-Type": "application/json" }
        const myBody = JSON.stringify({ "email": formData.email, "password": formData.password });

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: myBody,
            redirect: 'follow',
        };

        console.log("here", formData)
        await fetch(apiURL + path, requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log(result)
                if (result.message === "Email in use") {
                    throw new Error("Email je že v uporabi, izberite drugega.")
                } else if (result.error) {
                    throw new Error(result.error)
                } else if (path === "/auth/signin") {
                    const newToken = result.access_token;
                    storeData("token", newToken);
                    fetchMyData();
                } else if (path === "/auth/signup") {
                    switchMenuType();
                }
            })
    }

    const { isInitialLoading, refetch, isError, error } = useQuery({
        queryKey: ["sign"],
        queryFn: () => signFetchFn,
        enabled: false
    })

    if (isError) {
        console.log(isError, error)
        let sloError = <></>;
        switch (error) {
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
    }

    const handleLogout = () => {
        handleReset();
        setUser(null);
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
            onClick={() => handleBtnClick()}
            onMouseDown={() => { document.getElementById("navAnimation")?.classList.remove("pull") }}
            onMouseUp={() => { document.getElementById("navAnimation")?.classList.add("pull") }}>
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
            onClick={() => handleDarkBtnClick()}
            onMouseDown={() => { document.getElementById("darkBtnAnimation")?.classList.remove("pull") }}
            onMouseUp={() => { document.getElementById("darkBtnAnimation")?.classList.add("pull") }}>
            <img
                id="darkBtnImg"
                src="Moon.svg"
                style={{ opacity: darkMode ? "1" : "0" }}
                alt="dark mode btn"
            />
            <img
                id="lightBtnImg"
                src="Sun2.svg"
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
        showPass,
        isInitialLoading,
        reset,
        handleReset,
        onSubmit,
        setShowPass,
        handleLocChange,
        handleBtnClick,
        handleLogout,
        handleSubmit,
        register,
        eventListener,
        fetchMyData,
    };
}