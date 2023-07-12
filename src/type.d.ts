type Err = {
    email: JSX.Element | null;
    password: JSX.Element | null;
}

type Guess = {
    guesses: string[];
    guessId: number;
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

export type { Err, Guess, Ratio, Word };