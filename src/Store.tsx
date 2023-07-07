import { create } from 'zustand';

type State = {
    id: number,
    username: string,
    profilePic: string,
    online: boolean,
    menuOpened: boolean,
    serverError: JSX.Element | null,
    accConfirm: JSX.Element | null
}

type Action = {
    cngId(neId: number): void,
    cngUsername(newUsername: string): void,
    cngProfPic(newProfPic: string): void,
    cngOnline(onlineState: boolean): void,
    switchMenuState(menuState: boolean): void,
    cngServerError(newError: JSX.Element | null): void,
    confirmAccCreation(message: JSX.Element | null): void
}

const useAppStore = create<State&Action>((set) => ({
    id: -1,
    cngId: (newId) => set(() => ({
        id: newId
    })),

    username: "",
    cngUsername: (newUsername) => set(() => ({
        username: newUsername
    })),

    profilePic: "",
    cngProfPic: (newPic) => set((state) => ({
        profilePic: newPic
    })
    ),

    online: false,
    cngOnline: (onlineState) => set(() => ({
        online: onlineState
    })),

    menuOpened: false,
    switchMenuState: (menuState) => set(() => ({
        menuOpened: menuState
    })),

    serverError: null,
    cngServerError: (newError) => set(() => ({
        serverError: newError
    })),

    accConfirm: null,
    confirmAccCreation: (message) => set(() => ({
        accConfirm: message
    })),
}));

export default useAppStore;