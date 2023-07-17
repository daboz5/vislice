import { create } from 'zustand';
import { Guess, Word } from './type';

type State = {
    id: number | null,
    username: string,
    profPic: string,
    word: Word | null,
    guesses: Guess[] | [],
    online: boolean,
    menuOpened: boolean,
    serverError: JSX.Element | null,
    serverConnectionError: boolean,
    accConfirm: JSX.Element | null,
    darkMode: boolean,
}

type Action = {
    cngId(neId: number): void,
    cngUsername(newUsername: string): void,
    cngProfPic(newProfPic: string): void,
    cngWord(newWord: Word): void,
    cngGuesses(newGuesses: Guess[]): void,
    cngOnline(onlineState: boolean): void,
    switchMenuState(menuState: boolean): void,
    cngServerError(newError: JSX.Element | null): void,
    cngServerConnectionError(newError: boolean): void,
    confAccCreation(message: JSX.Element | null): void,
    cngDarkMode(newMode: boolean): void,
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
    })),

    word: null,
    cngWord: (newWord) => set(() => ({
        word: newWord
    })),

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

    serverConnectionError: false,
    cngServerConnectionError: (newState) => set(() => ({
        serverConnectionError: newState
    })),

    accConfirm: null,
    confAccCreation: (message) => set(() => ({
        accConfirm: message
    })),

    darkMode: false,
    cngDarkMode: (newMode) => set((state) => ({
        darkMode: newMode
    }))
}));

export default useAppStore;