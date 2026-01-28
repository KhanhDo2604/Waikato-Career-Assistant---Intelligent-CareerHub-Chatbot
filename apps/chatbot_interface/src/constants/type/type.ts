export type Sender = 'user' | 'bot';

export interface Interaction {
    id: string;
    question: string;
    answer?: string;
    createdAt: string;
    category: string;
}

export type Question = {
    id: number;
    questions: string[];
    category?: string;
    answer: string;
    common: boolean;
};

export interface MonthlyUserCount {
    day: number;
    uniqueUsers: number;
    totalInteractions?: number;
}

export interface QuestionTypeCount {
    category: string;
    count: number;
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
    isLoading: boolean;
    questionTypesMonthlyReport: QuestionTypeCount[];
    usageChatBot: MonthlyUserCount[];
    userInteractions: Interaction[];
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
    | { type: 'LOADING'; payload: boolean }
    | { type: 'UPDATE_COMMON_QUESTIONS'; payload: { commonQuestions: Question[] } }
    | { type: 'ADD_QUESTIONS'; payload: Question }
    | { type: 'UPDATE_QUESTION'; payload: Question }
    | { type: 'DELETE_QUESTION'; payload: number }
    | { type: 'GET_QUESTION_TYPES_MONTHLY_REPORT'; payload: QuestionTypeCount[] }
    | { type: 'GET_USAGE_CHATBOT'; payload: MonthlyUserCount[] }
    | { type: 'GET_USER_INTERACTIONS'; payload: Interaction[] };

export type ChatActions = {
    setInputText: (v: string) => void;
    sendMessage: (text: string) => Promise<void>;
    resetChat: () => void;
};

export type DashboardActions = {
    getQuestionsFromDB: () => void;
    toggleCommonQuestion: (questionId: number) => void;
    addQuestion: (questionData: Partial<Question>) => Promise<Question>;
    updateQuestion: (questionData: Partial<Question>) => Promise<Question>;
    deleteQuestion: (id: number) => Promise<string>;
    getQuestionTypesMonthlyReport: (year: number, month: number) => Promise<QuestionTypeCount[]>;
    getUsageChatBot: (year: number, month: number) => Promise<MonthlyUserCount[]>;
    getUserInteractions: () => Promise<Interaction[]>;
};

export type ChatContextValue = {
    state: ChatState;
    actions: ChatActions;
};

export type DashboardContextValue = {
    dashboardState: DashboardState;
    dashboardActions: DashboardActions;
};
