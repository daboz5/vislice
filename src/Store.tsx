import { create } from 'zustand';
import { Game, Guess, Panic, Word } from './type';

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
    panic: Panic,
    paniced: boolean,
    help: boolean,
    game: Game,
    won: boolean,
    lost: boolean
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
    cngPanic(newPanic: Panic): void,
    switchPaniced(): void,
    switchHelp(): void,
    cngGame(newGame: Game): void,
    switchWon(): void,
    switchLost(): void
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
    cngDarkMode: (newMode) => set(() => ({
        darkMode: newMode
    })),

    panic: {
        state: false,
        style: {
            boxShadow: `inset 1px -1px 7px 4px black`,
            backgroundColor: "rgb(0, 220, 0)",
        }
    },
    paniced: false,
    cngPanic: (newPanic) => set(() => ({
        panic: newPanic
    })),
    switchPaniced: () => set((state) => ({
        paniced: !state.paniced
    })),

    help: false,
    switchHelp: () => set((state) => ({
        help: !state.help
    })),

    game: {
        life: 7,
        tried: "",
        found: [""]
    },
    cngGame: (newGame) => set(() => ({
        game: newGame
    })),

    won: false,
    lost: false,
    switchWon: () => set((state) => ({
        won: !state.won
    })),
    switchLost: () => set((state) => ({
        lost: !state.lost
    }))
}));

export default useAppStore;