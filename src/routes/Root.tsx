import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "../navigation/Menu";
import useAppStore from "../Store";
import useLocalStorage from "../utils/useLocalStorage";
import useMenu from "../utils/useMenu";
import './Root.css';

const queryClient = new QueryClient();

export default function Root() {

  const { getData } = useLocalStorage();
  const { darkMode, switchMenuState, switchDarkMode } = useAppStore();
  const { fetchMyData } = useMenu();

  useEffect(() => {
    const menuState = getData("menuOpened");
    const darkMode = getData("darkMode");
    const token = getData("token");

    switchMenuState(menuState ? menuState : false);
    switchDarkMode(darkMode ? darkMode : false);
    if (token) { fetchMyData() }
  }, []);

  const lightStyle = {
    color: "#202020",
    backgroundColor: "#AFE2FF"
  }

  const darkStyle = {
    color: "#FFFFA9",
    backgroundColor: "#000424"
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div id="app" style={darkMode ? darkStyle : lightStyle}>
        <Menu />
        <main id="main">
          <Outlet />
        </main>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </QueryClientProvider>
  );
}