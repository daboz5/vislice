import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "../navigation/Menu";
import useRoot from "../utils/useRoot";
import useAppStore from "../Store";
import useLocalStorage from "../utils/useLocalStorage";
import './Root.css';

export default function Root () {

  const { getData } = useLocalStorage();
  const { online, darkMode, switchMenuState, cngDarkMode } = useAppStore();
  const { fetchMyData, fetchMyResults } = useRoot();
  
  useEffect(() => {
    const menuState = getData("menuOpened");
    switchMenuState(menuState ? menuState : false);
    const darkModeData = getData("darkMode");
    if (darkModeData) {cngDarkMode(darkModeData)}
  }, []);
  
  useEffect(() => {
    fetchMyData();
    fetchMyResults();
  }, [online, fetchMyData, fetchMyResults]);

  const lightStyle = {
    color: "#202020",
    backgroundColor: "#AFE2FF"
  }

  const darkStyle = {
    color: "#FFFFA9",
    backgroundColor: "#000424"
  }

  return (
    <div
      id="app"
      style={darkMode ? darkStyle : lightStyle }>
      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false} />
      </div>

      <Menu/>
      
      <main id="main">
          <Outlet/>
      </main>
    </div>
  );
}