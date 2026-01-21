export type Sender = 'user' | 'bot';

export interface Interaction {
    id: string;
    userId: string;
    userType: 'user' | 'alumni';
    question: string;
    answer: string;
    timestamp: string;
    questionType?: string;
}

export interface CommonQuestionType {
    questionType: string;
    count: number;
}

export type Question = {
    id: string;
    question: string;
    category?: string;
    answer: string;
    common: boolean;
};

export interface MonthlyUserCount {
    month: string;
    uniqueUsers: number;
    users: number;
    alumni: number;
    total: number;
}

export interface ChatMessage {
    id: string;
    sender: Sender;
    text: string;
    createAt: Date;
}

export interface InputBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export type ChatState = {
    messages: ChatMessage[];
    inputText: string;
    isBotTyping: boolean;
    hasStarted: boolean;
};

export type DashboardState = {
    commonQuestions: Question[];
    questions: Question[];
    questionsLoading: boolean;
    isLoadingCommonQuestions: boolean;
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
    | { type: 'RESET' }
    | { type: 'UPDATE_COMMON_QUESTIONS'; payload: { newQuestionList: Question[]; commonQuestions: Question[] } };

export type ChatActions = {
    setInputText: (v: string) => void;
    sendMessage: (text: string) => Promise<void>;
    resetChat: () => void;
};

export type DashboardActions = {
    getQuestionsFromDB: () => void;
    toggleCommonQuestion: (questionId: number) => void;
};

export type ChatContextValue = {
    state: ChatState;
    actions: ChatActions;
};

export type DashboardContextValue = {
    dashboardState: DashboardState;
    dashboardActions: DashboardActions;
};
