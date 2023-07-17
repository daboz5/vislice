import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';
import useMenu from '../utils/useMenu';
import useAppStore from '../Store';

export default function Login () {

  const {
    mailErr,
    passErr,
    showPass,
    register,
    eventListener,
    setShowPass,
    handleSubmit,
    onSubmit
  } = useMenu();

  const { serverError } = useAppStore();

  useEffect(() => {
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="loginMenu">
      <h4>Vpis</h4>
      <p className='inputText'>Uporabniški email:</p>
        <input
          inputMode='email'
          className='inputField inputEmail'
          {...register("logEmail", {
            required: true,
            minLength: 3
          })}
        />
        
      <p className='inputText'>Geslo:</p>
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

        {mailErr &&
          <p className="error">
            {mailErr}</p>}
        {passErr &&
          <p className="error">
            {passErr}</p>}
        {serverError &&
          <p className="error">
            {serverError}</p>}

      <button
        type="submit"
        className="button loginBtn"
        rel="noopener noreferrer"
        >Vpiši me
      </button>
    </form>
  )
}