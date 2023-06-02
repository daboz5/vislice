import { create } from 'zustand'

type State = {
    url:string,
    username: string,
    profilePic: string,
    menuState: boolean,
    changeUsername: (newUsername: string) => void,
    changeProfilePic: (newPic: string) => void,
    changeMenuState: (menuState: boolean) => void
}

const useAppStore = create<State>((set) => ({
    url: "http://localhost:3001",
    urlAPI: "http://localhost:3000",
    username: "",
    profilePic: "",
    menuState: false,
    changeUsername: (newUsername: string) => set(
        (state) => ({...state, username: newUsername})
    ),
    changeProfilePic: (newPic: string) => set(
        (state) => ({...state, profilePic: newPic})
    ),
    changeMenuState: () => set(
        (state) => ({...state, menuState: !state.menuState})
    ),
}));

export default useAppStore;