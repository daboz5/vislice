import { create } from 'zustand'

type State = {
    token: string,
    username: string,
    profilePic: string,
    menuState: boolean,
    online: boolean,
    changeToken: (newToken: string) => void,
    changeUsername: (newUsername: string) => void,
    changeProfilePic: (newPic: string) => void,
    changeOnline: (menuState: boolean) => void
    changeMenuState: (menuState: boolean) => void
}

const useAppStore = create<State>((set) => ({
    token: "",
    username: "",
    profilePic: "",

    online: false,
    menuState: false,

    changeToken: (newToken: string) => set(
        (state) => ({...state, token: newToken})
    ),
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