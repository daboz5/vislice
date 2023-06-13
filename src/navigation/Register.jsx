import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import apiURL from "../utils/api_url.ts";

const Register = () => {
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [sloError, setSloError] = useState(null);
  const [confirmator, setConfirmator] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [passInput1, setPassInput1] = useState("");
  const [passInput2, setPassInput2] = useState("");
  const [show, setShow] = useState(false);

  const handlePasswordShow = () => {setShow(!show)};

  const eventListener = (event) => {
    if (
      event.key === "Enter" &&
      passInput1 !== "" &&
      passInput2 !== "" &&
      emailInput !== ""
    ) {
      handleCreateAcc(event)
    }
  }
  
  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  const handleReset = () => {
    setEmailError(null);
    setPassInput1(null);
    setPassInput2(null);
    setConfirmator(null);
    setSloError(null);
  }

  const handleCreateAcc = async (event) => {
      event.preventDefault();
      handleReset();

      if (emailInput !== "" && passInput1 !== "" && passInput2 !== "") {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        const emailCheck = emailRegex.test(emailInput);
        const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
        const passCheck = passRegex.test(passInput1);
        
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

        else if (passInput1 !== passInput2 ) {setPasswordError(<>Gesli se ne ujemata.</>)}
        
        else {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var data = JSON.stringify({
            "email": emailInput,
            "password": passInput1
          });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
          };
          
          await fetch(apiURL + "/auth/signup", requestOptions)
            .then(response => response.json())
            .then(result => {
              if (!result.error) {
                setConfirmator(
                  <>
                    Račun je bil uspešno ustvarjen.<br/>
                    Sedaj se lahko prijaviš.
                  </>
                )
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
                case ("Email in use"):
                  sloError =
                    <>
                      Email je že v uporabi.
                    </>
                  break
                default:
                  sloError =
                    <>
                      Nekaj je šlo narobe, poskusite znova kasneje ali nas opozorite o napaki.
                    </>
              }
              setServerError(sloError);
            });
        }
      }
    }

    const showPasswordIcon = show ? faEyeSlash : faEye;

    return sloError ?
      (sloError &&
        <div className='loginMenu'>
          {sloError}
        </div>
      ) :

      <form className="loginMenu">
        <h4>Ustvari nov račun</h4>

        <p className='inputText'>Uporabniški email:</p>
        <div>
          <input
            className='inputField'
            onChange={(event) => setEmailInput(event.target.value)}
          />
          {emailError &&
            <p className="error">
              {emailError}
            </p>
          }
        </div>
        
        <p
          className='inputText'
          >Dvakrat vpiši lokalno geslo:
        </p>
        <div>
          <div>
            <input
              type={show ?
                "text" :
                "password"
              }
              className='inputField'
              onChange={(event) => setPassInput1(event.target.value)}
            />
            <input
              type={show ?
                "text" :
                "password"
              }
              className='inputField'
              onChange={(event) => setPassInput2(event.target.value)}
            />
            <FontAwesomeIcon
              className='eye'
              icon={showPasswordIcon}
              style={{color: "#000000", fontSize: 18, marginTop: 8}}
              onClick={handlePasswordShow}
            />
          </div>
          {passwordError &&
            <p className="error">
              {passwordError}</p>}
          {serverError &&
            <p className="error">
              {serverError}</p>}
          {confirmator &&
            <p className="popUp">
              {confirmator}</p>}
        </div>
        <button
          className="button"
          onClick={(event) => handleCreateAcc(event)}
          rel="noopener noreferrer"
          >Ustvari račun
        </button>
        
      </form>
}

export default Register;