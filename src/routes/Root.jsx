import { Outlet } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import Menu from "../navigation/Menu";
import useAppStore from '../Store.ts';
import apiURL from "../utils/api_url.ts";
import { Toaster } from "react-hot-toast";
import './Root.css';

export const MenuContext = createContext(null);

const Root = () => {

  const { changeUsername, changeProfilePic, changeOnline} = useAppStore();

  const [menuState, setMenuState] = useState(false);

  const checkWhoAmI = async () => {
      var requestOptions = {
          method: 'GET',
          redirect: 'follow',
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
      };

    await fetch(apiURL + "/auth/whoami", requestOptions)
        .then(response => response.json())
        .then((result) => {
          if (!result.error) {
            changeUsername(result.username);
            changeProfilePic(result.avatar);
            changeOnline(true)
          } else {
            throw new Error(result.message)
          }
        })
        .catch(error => {
          changeOnline(false);
          console.log(error);
        });
  }

  useEffect(() => {
    checkWhoAmI();
  }, [])

  return (
    <>
      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false} />
      </div>

      <MenuContext.Provider value={{menuState, setMenuState}}>
        <Menu/>
      </MenuContext.Provider>
      
      <main id="app">
        <MenuContext.Provider value={{menuState}}>
          <Outlet/>
        </MenuContext.Provider>
      </main>
    </>
  );
}

export default Root;