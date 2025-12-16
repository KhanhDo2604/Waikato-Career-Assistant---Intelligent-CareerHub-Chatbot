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
