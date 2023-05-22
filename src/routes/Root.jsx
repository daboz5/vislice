import { Outlet } from "react-router-dom";
import { useState, createContext } from "react";
import LogMenu from "../navigation/LogMenu";

export const MenuContext = createContext(null);

const Root = () => {

  const [menuState, setMenuState] = useState(false);
  const [location, setLocation] = useState("/account");
  const [accPic, setAccPic] = useState(null);
  const [accInfo, setAccInfo] =
    useState({
      name: "default",
      email: "default",
      avatar: null,
      wins: 0,
      loses: 0
    });

  return (
    <>
      <MenuContext.Provider value={{menuState, setMenuState, accInfo, setAccInfo, location, setLocation, accPic}}>
        <LogMenu/>
      </MenuContext.Provider>
      
      <main id="app">
      <MenuContext.Provider value={{menuState, accPic, setAccPic}}>
        <Outlet/>
      </MenuContext.Provider>
      </main>
    </>
  );
}

export default Root;