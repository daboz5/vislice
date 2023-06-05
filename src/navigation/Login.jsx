import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link } from 'react-router-dom';
import useAppStore from '../Store.ts';

const Login = (props) => {

  let navigate = useNavigate();

  const { url, urlAPI, changeUsername, changeProfilePic } = useAppStore();

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [sloError, setSloError] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [show, setShow] = useState(false);

  const handleReset = () => {
    setEmailError(null);
    setPassInput(null);
    setSloError(null);
    setServerError(null);
  }

  const eventListener = (event) => {
    if (!props.online && event.key === "Enter") {
      handleLogin(event)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  const handleInfo = (info) => {
    changeUsername(info.username);
    changeProfilePic(info.avatar);
    props.reportLoginStatus()

    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    credentials: "include"
    };
/*
    fetch((urlAPI + "guesses/me"), requestOptions)
      .then(response => {
        return response.json()})
      .then(result => {
        if (!result.error) {
          console.log(result)
        } else {
          throw new Error(result.message || setServerError(<>Nekaj je šlo narobe, poskusite kasneje.</>))
        }
      })
      .catch(error => {
        console.log(error)
        let sloError = null
        switch(error.message) {
          case ("User not found"):
            sloError = <>Email ali geslo sta napačna.</>
            break
            default:
              sloError = <>Nekaj je šlo narobe.<br/> Znova poskusite kasneje ali nas opozorite o napaki.</>
        }
            setServerError(sloError)
      });*/
/*
    setAccInfo({
      wins: props.loginInfo.wins,
      loses: props.loginInfo.loses
    });*/
  }

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

  const handleLogin = () => {
    handleReset();
    
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const emailCheck = emailRegex.test(emailInput);
    const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
    const passCheck = passRegex.test(passInput);

    if (emailInput !== "" && passInput !== "") {
      if (!emailCheck | !passCheck) {
        if (!emailCheck) {setEmailError(<>Neustrezen email. Prosimo, vnesite: &ensp;- primer@primer.kul</>)}
        if (!passCheck) {setPasswordError(<>Neustrezno geslo. Prosimo, vnesite:<br />&ensp;- vsaj 6 znakov<br />&ensp;- vsaj ena črka in vsaj ena številka</>)}
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "email": emailInput,
        "password": passInput
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch((urlAPI + "/auth/signin"), requestOptions)
        .then(response => {
          return response.json()})
        .then(result => {
          if (!result.error) {
            handleInfo(result);
          } else {
            throw new Error(result.message || setServerError(<>Nekaj je šlo narobe, poskusite kasneje.</>))
          }
        })
        .catch(error => {
          let sloError = null
          switch(error.message) {
            case ("Invalid email or password"):
              sloError = <>Email ali geslo sta napačna.</>
              break
            case ("User not found"):
              sloError = <>Email ali geslo sta napačna.</>
              break
            default:
              sloError = <>Nekaj je šlo narobe.<br/> Znova poskusite kasneje ali nas opozorite o napaki.</>
          }
          setServerError(sloError)
        });
      setEmailInput(document.querySelector(".inputEmail").value);
      setPassInput(document.querySelector(".inputPassword").value);
    }
  }
  
  const handleLogout = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch((urlAPI + "/auth/signout"), requestOptions)
      .then(result => {
        if (!result.error) {
            handleReset();
            props.reportLoginStatus();
          } else {
            throw new Error(result.message || setServerError(<>Nekaj je šlo narobe, poskusite kasneje.</>))
          }
        })
      .catch(error => {
        console.log(error)
        const sloError = <>Nekaj je šlo narobe.<br/> Znova poskusite kasneje ali nas opozorite o napaki.</>
        setServerError(sloError)
      });
  }

  const handlePasswordShow = () => {setShow(!show)};

  const showPasswordIcon = show ? faEyeSlash : faEye;

  const changeLocation = () => {
    const homePath = "/";
    const accPath = "/account";
    const currentPath = window.location.pathname;
    const path = currentPath !== homePath ? homePath : accPath;
    navigate(path);
  }

  return props.online ?
    (<div
      className='loginMenu'
      ><div
        className='menuInfoBox'
        ><p
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
          {handleRatio()}
          {calcRatio(fakeACC.wins, fakeACC.loses)[1]}
        </p>
      </div>
      <Link
        className="button-normal link"
        onClick={changeLocation}
        rel="noopener noreferrer"
        >{window.location.pathname === "/" ?
          "Uporabniški račun" :
          "Vislice"}
      </Link>
      <Link
        className="button-normal"
        onClick={handleLogout}
        rel="noopener noreferrer"
        >Izpiši me
      </Link>
    </div>) :
      
    (<form className="loginMenu">    
      <h4>Vpis</h4>
      <p className='inputText'>Uporabniški email:</p>
        <input
          className='inputField inputEmail'
          onChange={(event) => setEmailInput(event.target.value)}
          name="Username"/>
        
        {emailError &&
          <p className="error">
            {emailError}</p>}
      
      <p className='inputText'>Geslo:</p>
        <input
        type={show ?
          "text" :
          "password"}
        className='inputField inputPassword'
        onChange={(event) => setPassInput(event.target.value)}/>

        <FontAwesomeIcon
          className='eye'
          icon={showPasswordIcon}
          style={{color: "#000000", fontSize: 18, marginTop: 8}}
          onClick={handlePasswordShow}
        />

        {passwordError &&
          <p className="error">
            {passwordError}</p>}

        {serverError &&
          <p className="error">
            {serverError}</p>}

        {sloError &&
          <p className="error">
            {sloError}</p>}

      <Link
        className="button-normal loginBtn"
        onClick={changeLocation}
        rel="noopener noreferrer"
        >Vpiši me
      </Link>
    </form>)
}

export default Login;