import Button from '../app/Button';
import { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { MenuContext } from '../routes/Root';

const Login = (props) => {

  const {accInfo, setAccInfo, location, setLocation} = useContext(MenuContext);
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
  }

  const handleInfo = (info) => {
    props.reportStatus()
    setAccInfo({
      name: info.username,
      email: info.email,
      avatar: info.avatar,
      wins: props.loginInfo.wins,
      loses: props.loginInfo.loses
    });
  }

  const calcRatio = (won, lost) => {
    if (won === 0 && lost === 0) {
      return ["50%", "50%"]
    }
    let total = won + lost;
    let ratioWon = `${(100*won)/total}%`;
    let ratioLost = `${(100*lost)/total}%`;
    return [ratioWon, ratioLost]
  }

  const handleRatio = () => {
    if (accInfo.wins > accInfo.loses) {
      return "\\^/_\\^/"
    }
    else if (accInfo.wins < accInfo.loses) {
      return "\\-/_\\-/"
    }
    else {
      return "\\o/_\\o/"
    }
  }

  const handleLogin = (event) => {
    event.preventDefault();
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
      redirect: 'follow'
      };

      fetch("http://localhost:3000/auth/signin", requestOptions)
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
            case ("User not found"):
              sloError = <>Email ali geslo sta napačna.</>
              break
            default:
              sloError = <>Nekaj je šlo narobe.<br/> Znova poskusite kasneje ali nas opozorite o napaki.</>
          }
          setServerError(sloError)
        });
    }
  }

  const handlePathChange = () => {
    if (location === "/account") {
      setLocation("/")
    }
    else if (location === "/") {
      setLocation("/account")
    }
  }

  const handleLogout = () => {
    props.reportStatus();
  }

  const handlePasswordShow = () => {setShow(!show)};

  const showPasswordIcon = show ? faEyeSlash : faEye;

  return props.online ?
    (<div className='loginMenu'>
        <div className='menuInfoBox'>
          <p className='menuUserInfo'>Zmage: {accInfo.wins}</p>
          <p className='menuUserInfo'>Porazi: {accInfo.loses}</p>
          <p className='menuUserInfo'>{calcRatio(accInfo.wins, accInfo.loses)[0]} {handleRatio()}{calcRatio(accInfo.wins, accInfo.loses)[1]}</p>
        </div>
        
        <Button className='link'
          button="normal"
          to={location}
          onClick={handlePathChange}>
            Uporabniški račun
        </Button>
        
        <Button
          button="normal"
          onClick={handleLogout}>
            Izpiši me
        </Button>
    </div>) :
    
    (<form className="loginMenu">    
      <h4>Vpis</h4>
        <p className='inputText'>Uporabniški email:</p>
          <input
            className='inputField'
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
          className='inputField'
          onChange={(event) => setPassInput(event.target.value)}/>

          <FontAwesomeIcon
            className='eye'
            icon={showPasswordIcon}
            style={{color: "#000000", fontSize: 18, marginTop: 8}}
            onClick={handlePasswordShow} />

          {passwordError &&
            <p className="error">
              {passwordError}</p>}

          {serverError &&
            <p className="error">
              {serverError}</p>}

          {sloError &&
            <p className="error">
              {sloError}</p>}
    
        <Button
          button="normal"
          onClick={handleLogin}>
            Vpiši me
        </Button>
    </form>)
}

export default Login;