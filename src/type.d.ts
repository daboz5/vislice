type Guess = {
    id: number;
    guesses: string[];
    success: boolean | null;
    word: string;
}

type Ratio = {
    won: number;
    lost: number;
    unfinished: number;
}

type Word = {
    id: number;
    word: string;
    definition: string;
}

type Panic = {
    state: boolean;
    style: {
        boxShadow: string;
        backgroundColor: string;
    }
}

type Game = {
    life: number;
    tried: string;
    found: string[]
}

export type {
    FormValues,
    Game,
    Guess,
    Panic,
    Ratio,
    Word,
};