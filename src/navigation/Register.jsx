import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form";
import apiURL from "../utils/api_url.ts";

const Register = () => {
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [confirmator, setConfirmator] = useState(null);
  const [show, setShow] = useState(false);

  const handlePasswordShow = () => {setShow(!show)};

  const { register, handleSubmit } = useForm();

  const eventListener = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit);
    }
  }

  
  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  const handleReset = () => {
    setEmailError(null);
    setConfirmator(null);
    setServerError(null);
  }

  const onSubmit = async (data) => {
    handleReset();

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const emailCheck = emailRegex.test(data.logEmail);
    const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
    const passCheck = passRegex.test(data.logPassword1);
    
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

    else if (data.logPassword1 !== data.logPassword2 ) {
      setPasswordError(<>Gesli se ne ujemata.</>)
    }
      
    else {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "email": data.logEmail,
        "password": data.logPassword1
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
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
          let errorMessage = null;
          switch(error.message) {
            case ("Email in use"):
              errorMessage =
                <>
                  Email je že v uporabi.
                </>
              break
            default:
              errorMessage =
                <>
                  Nekaj je šlo narobe, poskusite znova kasneje ali nas opozorite o napaki.
                </>
          }
          setServerError(errorMessage);
        });
    }
  }

  const showPasswordIcon = show ? faEyeSlash : faEye;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="loginMenu"
      ><h4>Ustvari nov račun</h4>
      <p className='inputText'>Uporabniški email:</p>
      <input
        className='inputField inputEmail'
        {...register("logEmail", {
          required: true,
          minLength: 1
        })}
      />
        {emailError &&
          <p className="error">
            {emailError}
          </p>
        }
      
      <p
        className='inputText'
        >Dvakrat vpiši lokalno geslo:
      </p>
      <input
        type={show ?
          "text" :
          "password"
        }
        className='inputField inputPassword'
        {...register("logPassword1", {
          required: true,
          minLength: 1
        })}
      />
      <input
        type={show ?
          "text" :
          "password"
        }
        className='inputField inputPassword'
        {...register("logPassword2", {
          required: true,
          minLength: 1
        })}
      />
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
      {confirmator &&
        <p className="popUp">
          {confirmator}</p>}

      <button
        className="button"
        onClick={handleSubmit(onSubmit)}
        rel="noopener noreferrer"
        >Ustvari račun
      </button>
      
    </form>
  )
}

export default Register;