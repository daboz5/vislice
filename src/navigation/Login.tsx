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
        <img
          className='eye'
          src={showPass ? "eye-opened.svg" : "eye-closed.svg"}
          onClick={() => setShowPass(!showPass)}
          alt="show-password-icon"
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
        rel="noopener noreferrer">
        Vpiši me
      </button>
    </form>
  )
}