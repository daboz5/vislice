import { create } from 'zustand';
import { Guess } from './type';

type State = {
    id: number | null,
    username: string,
    profPic: string,
    guesses: Guess[] | [],
    online: boolean,
    menuOpened: boolean,
    serverError: JSX.Element | null,
    accConfirm: JSX.Element | null,
}

type Action = {
    cngId(neId: number): void,
    cngUsername(newUsername: string): void,
    cngProfPic(newProfPic: string): void,
    cngGuesses(newGuesses: Guess[]): void,
    cngOnline(onlineState: boolean): void,
    switchMenuState(menuState: boolean): void,
    cngServerError(newError: JSX.Element | null): void,
    confAccCreation(message: JSX.Element | null): void,
}

const useAppStore = create<State&Action>((set) => ({
    id: null,
    cngId: (newId) => set(() => ({
        id: newId
    })),

    username: "",
    cngUsername: (newUsername) => set(() => ({
        username: newUsername
    })),

    profPic: "",
    cngProfPic: (newPic) => set(() => ({
        profPic: newPic
    })
    ),

    guesses: [],
    cngGuesses: (newGuesses: Guess[] | []) => set(() => ({
        guesses: newGuesses
    })),

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
    confAccCreation: (message) => set(() => ({
        accConfirm: message
    })),
}));

export default useAppStore;