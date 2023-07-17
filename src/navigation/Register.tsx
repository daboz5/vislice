import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form";
import useAppStore from '../Store';
import useMenu from '../utils/useMenu';

export default function Register () {

  const {
    accConfirm,
    serverError,
  } = useAppStore();

  const {
    mailErr,
    passErr,
    showPass,
    onSubmit,
    setShowPass,
    eventListener,
  } = useMenu();
  
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="loginMenu"
      ><h4>Ustvari nov račun</h4>
      <p className='inputText'>Uporabniški email:</p>
      <input
        inputMode='email'
        className='inputField inputEmail'
        {...register("logEmail", {
          required: true,
          minLength: 3
        })}
      />
        {mailErr &&
          <p className="error">
            {mailErr}</p>}
      
      <p
        className='inputText'
        >Dvakrat vpiši lokalno geslo:
      </p>
      <input
        inputMode='none'
        type={showPass ?
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
        inputMode='none'
        type={showPass ?
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
        icon={showPass ? faEyeSlash : faEye}
        style={{
          color: "#000000",
          fontSize: 18,
          marginTop: 8
        }}
        onClick={() => setShowPass(!showPass)}
      />

      {passErr &&
        <p className="error">
          {passErr}</p>}
      {serverError &&
        <p className="error">
          {serverError}</p>}
      {accConfirm &&
        <p className="popUp">
          {accConfirm}</p>}

      <button
        className="button"
        onClick={handleSubmit(onSubmit)}
        rel="noopener noreferrer">
        Ustvari račun
      </button>
      
    </form>
  )
}