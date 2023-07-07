import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useAppStore from '../Store';
import useFetch from "../utils/useFetch";
import useLocalStorage from "../utils/useLocalStorage";

export default function Login () {

  type useErr = {
    email: JSX.Element | null;
    password: JSX.Element | null;
  }

  let navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const {
    username,
    online,
    serverError,
    cngUsername,
    cngProfPic,
    cngOnline,
    cngServerError
  } = useAppStore();

  const { removeData } = useLocalStorage();

  const [ error, setError ] = useState<useErr>({email: null, password: null});
  const [ showPass, setShowPass ] = useState(false);

  const { postFetch } = useFetch();

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

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  const calcRatio = (won:number, lost:number) => {
    if (won === 0 && lost === 0) {
      return ["Vaš račun nima zabeleženih iger."]
    }
    let total = won + lost;
    let ratioWon = `${((100*won)/total).toFixed(2)}%`;
    let ratioLost = `${((100*lost)/total).toFixed(2)}%`;
    return [ratioWon, ratioLost]
  }

  const fakeACC = {
    wins: 0,
    loses: 0
  }

  const handleRatio = () => {
    if (fakeACC.wins > fakeACC.loses) {
      return "\\^/_\\^/"
    }
    else if (fakeACC.wins < fakeACC.loses) {
      return "\\-/_\\-/"
    }
    else {
      return "\\o/_\\o/"
    }
  }

  const showPasswordIcon = showPass ? faEyeSlash : faEye;
  const handlePasswordShow = () => {setShowPass(!showPass)};

  const changeLocation = () => {
    const homePath = "/";
    const accPath = "/account";
    const currentPath = window.location.pathname;
    const path = currentPath !== homePath ? homePath : accPath;
    navigate(path);
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

  return online ?
    (<div
      className='loginMenu'
      ><div
        className='menuInfoBox'
        >{username &&
          <p
            style={{fontWeight: "600"}}
            >{username}
          </p>
        }
        <p
          className='menuUserInfo'
          >Zmage: {fakeACC.wins}
        </p>
        <p
          className='menuUserInfo'
          >Porazi: {fakeACC.loses}
        </p>
        <p
          className='menuUserInfo'
          >{calcRatio(fakeACC.wins, fakeACC.loses)[0]}
          {calcRatio(fakeACC.wins, fakeACC.loses)[1]}
          <br/>
          {handleRatio()}
        </p>
      </div>
      <button
        className="button"
        onClick={changeLocation}
        rel="noopener noreferrer"
        >{window.location.pathname === "/" ?
          "Uporabniški račun" :
          "Vislice"}
      </button>
      <button
        className="button"
        onClick={handleLogout}
        rel="noopener noreferrer"
        >Izpiši me
      </button>
    </div>) :
      
    (<form
      onSubmit={handleSubmit(onSubmit)}
      className="loginMenu"
      >
      <h4>Vpis</h4>
      <p className='inputText'>Uporabniški email:</p>
        <input
          className='inputField inputEmail'
          {...register("logEmail", {
            required: true,
            minLength: 3
          })}
        />
        
      <p className='inputText'>Geslo:</p>
        <input
          type={showPass ?
            "text" :
            "password"
          }
          className='inputField inputPassword'
          {...register("logPassword", {
            required: true,
            minLength: 1
          })}
        />
        <FontAwesomeIcon
          className='eye'
          icon={showPasswordIcon}
          style={{
            color: "#000000",
            fontSize: 18,
            marginTop: 8
          }}
          onClick={handlePasswordShow}
        />

        {error.email &&
          <p className="error">
            {error.email}</p>}
        {error.password &&
          <p className="error">
            {error.password}</p>}
        {serverError &&
          <p className="error">
            {serverError}</p>}

      <button
        type="submit"
        className="button loginBtn"
        rel="noopener noreferrer"
        >Vpiši me
      </button>
    </form>)
}