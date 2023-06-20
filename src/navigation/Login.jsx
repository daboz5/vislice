import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useAppStore from '../Store.ts';
import apiURL from "../utils/api_url.ts";

const Login = () => {

  let navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const {
    username,
    online,
    changeToken,
    changeUsername,
    changeProfilePic,
    changeOnline
  } = useAppStore();
  
  const [serverError, setServerError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleReset = () => {
    setEmailError(null);
    setServerError(null);
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

  const calcRatio = (won, lost) => {
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
    console.log(data)
    handleReset();

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const emailCheck = emailRegex.test(data.logEmail);
    const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
    const passCheck = passRegex.test(data.logPassword);

    if (!emailCheck | !passCheck) {
      if (!emailCheck) {
        return setEmailError(
          <>
            Neustrezen epoštni naslov.
          </>
        )
      }
      if (!passCheck) {
        return setPasswordError(
          <>
            Neustrezno geslo.<br/>
            Ustrezno geslo vsebuje:<br/>
            &ensp;- vsaj 6 znakov<br/>
            &ensp;- vsaj eno črko<br/>
            &ensp;- vsaj eno številko
          </>
        )
      }
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": data.logEmail,
      "password": data.logPassword
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch((apiURL + "/auth/signin"), requestOptions)
      .then(response => {
        return response.json()})
      .then(result => {
        if (!result.error) {
          const token = result.access_token;
          changeToken(token);

          changeOnline(true);
        } else {
          throw new Error(
            result.message ||
            setServerError(
              <>
                Nekaj je šlo narobe, poskusite kasneje.
              </>
            )
          )
        }
      })
      .catch(error => {
        let sloError = null;
        switch(error.message) {
          case ("Invalid email or password"):
            sloError =
            <>
              Email ali geslo sta napačna.
            </>
            break
          case ("User not found"):
            sloError =
            <>
              Email ali geslo sta napačna.
            </>
            break
          default:
            sloError =
            <>
              Nekaj je šlo narobe.<br/>
              Poskusite kasneje ali nas opozorite o napaki.
            </>
        }
        setServerError(sloError)
      }
    );
  };

  const handleLogout = () => {
    fetch((apiURL + "/auth/signout"))
      .then(result => {
        if (!result.error) {
            handleReset();
            changeUsername("");
            changeProfilePic("");
            changeOnline(false)
          } else {
            throw new Error(result.message || setServerError(<>Nekaj je šlo narobe, poskusite kasneje.</>))
          }
        })
      .catch(error => {
        console.log(error)
        const serverError = <>Nekaj je šlo narobe.<br/> Znova poskusite kasneje ali nas opozorite o napaki.</>
        setServerError(serverError)
      }
    );
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
            minLength: 1
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

        {emailError &&
          <p className="error">
            {emailError}</p>}
        {passwordError &&
          <p className="error">
            {passwordError}</p>}
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

export default Login;