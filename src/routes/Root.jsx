import { Outlet } from "react-router-dom";
import { useState, createContext } from "react";
import LogMenu from "../navigation/LogMenu";

export const MenuContext = createContext(null);

const Root = () => {

  const [menuState, setMenuState] = useState(false);

  return (
    <>
      <MenuContext.Provider value={{menuState, setMenuState}}>
        <LogMenu/>
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