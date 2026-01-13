export interface ErrorResponse {
    status: number;
    message: string;
}

export type AskResponse = {
    answer: string;
};

export type AskError = {
    status: number;
    message: string;
};

export type Question = {
    id: string;
    question: string;
    category?: string;
    answer: string;
    common: boolean;
};
