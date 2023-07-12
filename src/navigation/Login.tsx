import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye  } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';
import useMenu from '../utils/useMenu';
import useAppStore from '../Store';

export default function Login () {

  const {
    error,
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
          icon={showPass ? faEyeSlash : faEye}
          style={{
            color: "#000000",
            fontSize: 18,
            marginTop: 8
          }}
          onClick={() => setShowPass(!showPass)}
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
    </form>
  )
}