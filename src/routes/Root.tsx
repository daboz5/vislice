import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "../navigation/Menu";
import useFetch from "../utils/useFetch";
import useAppStore from "../Store";
import useLocalStorage from "../utils/useLocalStorage";
import './Root.css';

export default function Root () {

  const { getData } = useLocalStorage();
  const { online, switchMenuState } = useAppStore();
  const { getFetch } = useFetch();

  useEffect(() => {
    let menuState = getData("menuOpened");
    switchMenuState(menuState ? menuState : false);
    getFetch("/auth/whoami");
  }, [online]);

  return (
    <>
      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false} />
      </div>

      <Menu/>
      
      <main id="app">
          <Outlet/>
      </main>
    </>
  );
}