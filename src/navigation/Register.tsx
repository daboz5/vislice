import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form";
import { Err } from '../type';
import useAppStore from '../Store';
import useFetch from '../utils/useFetch';

export default function Register () {

  const {
    accConfirm,
    serverError,
    cngServerError
  } = useAppStore();
  
  const { register, handleSubmit } = useForm();

  const [ error, setError ] = useState<Err>({email: null, password: null});
  const [ show, setShow ] = useState(false);

  const { postFetch } = useFetch();

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
    setError({
      email: null,
      password: null,
    });
    cngServerError(null);
  }

  const onSubmit = async (data) => {
    handleReset();

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const emailCheck = emailRegex.test(data.logEmail);
    const passRegex = /^(?=.*\d)(?=.*[a-z]|[A-Z])(?=.*[a-zA-Z]).{6,}$/g;
    const passCheck = passRegex.test(data.logPassword1);
    
    if (!emailCheck || !passCheck) {
      if (!emailCheck) {
        error.email = <>Neustrezen epoštni naslov.</>;
        return setError(error);
      }
      if (!passCheck) {
        error.password =
          <>
            Neustrezno geslo.<br/>
            Ustrezno geslo vsebuje:<br/>
            &ensp;- vsaj 6 znakov<br/>
            &ensp;- vsaj eno črko<br/>
            &ensp;- vsaj eno številko
          </>;
        return setError(error);
      }
    }

    else if (data.logPassword1 !== data.logPassword2 ) {
      error.password = <>Gesli se ne ujemata.</>;
      setError(error);
    }
      
    else {
      const input = {
        "email": data.logEmail,
        "password": data.logPassword1
      }
      postFetch("/auth/signup", input);
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
          minLength: 3
        })}
      />
        {error.email &&
          <p className="error">
            {error.email}
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
        onClick={() => setShow(!show)}
      />

      {error.password &&
        <p className="error">
          {error.password}</p>}
      {serverError &&
        <p className="error">
          {serverError}</p>}
      {accConfirm &&
        <p className="popUp">
          {accConfirm}</p>}

      <button
        className="button"
        onClick={handleSubmit(onSubmit)}
        rel="noopener noreferrer"
        >Ustvari račun
      </button>
      
    </form>
  )
}