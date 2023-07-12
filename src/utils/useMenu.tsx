import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Err } from '../type';
import useAppStore from '../Store';
import useLocalStorage from '../utils/useLocalStorage';
import useFetch from './useFetch';

export default function useMenu() {

    const {
        online,
        menuOpened,
        switchMenuState,
        cngUsername,
        cngProfPic,
        cngOnline,
        cngServerError
    } = useAppStore();

    const { storeData, removeData } = useLocalStorage();
    const { register, handleSubmit } = useForm();
    const { postFetch } = useFetch();

    const [ error, setError ] = useState<Err>({
        email: null,
        password: null
    });
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
        const passCheck = passRegex.test(data.logPassword);
    
        if (!emailCheck || !passCheck) {
            if (!emailCheck) {
                error.email = <>Neustrezen epoštni naslov.</>
                return setError(error)
            }
            if (!passCheck) {
            error.password =
                <>
                    Neustrezno geslo.<br/>
                    Ustrezno geslo vsebuje:<br/>
                    &ensp;- vsaj 6 znakov<br/>
                    &ensp;- vsaj eno črko<br/>
                    &ensp;- vsaj eno številko
                </>
            return setError(error)
            }
        }
  
        const input = {
            "email": data.logEmail,
            "password": data.logPassword
        }
        postFetch("/auth/signin", input);
    };
  
    const handleLogout = () => {
      removeData("token");
      cngOnline(false);
    }

    return {
        loc,
        error,
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