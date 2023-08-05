import { create } from 'zustand';
import { Game, Guess, Panic, User, Word } from './type';

type State = {
    user: User,
    word: Word | null,
    guesses: Guess[] | [],
    menuOpened: boolean,
    serverError: JSX.Element | null,
    serverConnectionError: boolean,
    accConfirm: JSX.Element | null,
    darkMode: boolean,
    panic: Panic,
    paniced: boolean,
    bulbOn: boolean,
    help: boolean,
    game: Game,
    won: boolean,
    lost: boolean
}

type Action = {
    setUser(newUser: User): void,
    setWord(newWord: Word): void,
    setGuesses(newGuesses: Guess[]): void,
    switchMenuState(menuState: boolean): void,
    setServerError(newError: JSX.Element | null): void,
    setServerConnectionError(newError: boolean): void,
    confAccCreation(message: JSX.Element | null): void,
    switchDarkMode(newMode: boolean): void,
    setPanic(newPanic: Panic): void,
    switchPaniced(): void,
    switchBulbOn(): void,
    switchHelp(): void,
    setGame(newGame: Game): void,
    switchWon(): void,
    switchLost(): void
}

const useAppStore = create<State & Action>((set) => ({
    user: null,
    setUser: (newUser) => set(() => ({
        user: newUser
    })),

    word: null,
    setWord: (newWord) => set(() => ({
        word: newWord
    })),

    guesses: [],
    setGuesses: (newGuesses: Guess[] | []) => set(() => ({
        guesses: newGuesses
    })),

    menuOpened: false,
    switchMenuState: (menuState) => set(() => ({
        menuOpened: menuState
    })),

    serverError: null,
    setServerError: (newError) => set(() => ({
        serverError: newError
    })),

    serverConnectionError: false,
    setServerConnectionError: (newState) => set(() => ({
        serverConnectionError: newState
    })),

    accConfirm: null,
    confAccCreation: (message) => set(() => ({
        accConfirm: message
    })),

    darkMode: false,
    switchDarkMode: (newMode) => set(() => ({
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
    setPanic: (newPanic) => set(() => ({
        panic: newPanic
    })),
    switchPaniced: () => set((state) => ({
        paniced: !state.paniced
    })),

    bulbOn: false,
    help: false,
    switchBulbOn: () => set((state) => ({
        bulbOn: !state.bulbOn
    })),
    switchHelp: () => set((state) => ({
        help: !state.help
    })),

    game: {
        life: 7,
        tried: "",
        found: [""]
    },
    setGame: (newGame) => set(() => ({
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