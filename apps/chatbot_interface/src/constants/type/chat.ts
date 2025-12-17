export type Sender = 'user' | 'bot';

export interface ChatMessage {
    id: string;
    sender: Sender;
    text: string;
    createAt: Date;
    link?: string;
}

export interface InputBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export interface Question {
    id: string;
    question: string;
    answer: string;
}

export type ChatState = {
    messages: ChatMessage[];
    inputText: string;
    isBotTyping: boolean;
    hasStarted: boolean;

    questions: Question[];
    questionsLoading: boolean;
    questionsError?: string;
};

export type Action =
    | { type: 'SET_INPUT'; payload: string }
    | { type: 'SET_TYPING'; payload: boolean }
    | { type: 'SET_STARTED'; payload: boolean }
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'FETCH_QUESTIONS_START' }
    | { type: 'FETCH_QUESTIONS_SUCCESS'; payload: Question[] }
    | { type: 'FETCH_QUESTIONS_ERROR'; payload: string }
    | { type: 'RESET' };

export type ChatActions = {
    setInputText: (v: string) => void;
    sendMessage: (text: string) => Promise<void>;
    resetChat: () => void;
};

export type ChatContextValue = {
    state: ChatState;
    actions: ChatActions;
};
