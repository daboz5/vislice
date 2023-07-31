type Game = {
    life: number;
    tried: string;
    found: string[]
}

type Guess = {
    id: number;
    guesses: string[];
    success: boolean | null;
    word: string;
}

type Panic = {
    state: boolean;
    style: {
        boxShadow: string;
        backgroundColor: string;
    }
}

type Ratio = {
    won: number;
    lost: number;
    unfinished: number;
}

type User = {
    id: number,
    username: string,
    profPic: string
} | null

type Word = {
    id: number;
    word: string;
    definition: string;
}

export type {
    Game,
    Guess,
    Panic,
    Ratio,
    User,
    Word,
};