import { AskError, AskResponse } from '../src/models/type.js';

const BACKEND_URL = process.env.MODEL_URL || 'http://localhost:8080';

export const askChatbot = async (question: string, tail: string, method: string): Promise<AskResponse> => {
    try {
        const url = tail ? `${BACKEND_URL}/${tail}` : BACKEND_URL;
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const errorMessage = errorBody?.message || 'Failed to get response from chatbot service';
            throw {
                status: response.status,
                message: errorMessage,
            } as AskError;
        }
        const data: AskResponse = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
