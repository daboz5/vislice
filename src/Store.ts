import { create } from 'zustand'

type State = {
    username: string,
    profilePic: string,
    menuState: boolean,
    online: boolean,
    changeUsername: (newUsername: string) => void,
    changeProfilePic: (newPic: string) => void,
    changeOnline: (menuState: boolean) => void
    changeMenuState: (menuState: boolean) => void
}

const useAppStore = create<State>((set) => ({
    username: "",
    profilePic: "",
    online: false,
    menuState: false,
    changeUsername: (newUsername: string) => set(
        (state) => ({...state, username: newUsername})
    ),
    changeProfilePic: (newPic: string) => set(
        (state) => ({...state, profilePic: newPic})
    ),
    changeOnline: (newOnlineState) => set(
        (state) => ({...state, online: newOnlineState})
    ),
    changeMenuState: () => set(
        (state) => ({...state, menuState: !state.menuState})
    ),
}));

export default useAppStore;