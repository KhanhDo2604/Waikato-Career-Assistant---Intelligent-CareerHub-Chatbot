import { createContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Action, DashboardActions, DashboardContextValue, DashboardState } from '../constants/type/type';
import {
    addNewQuestion,
    deleteQuestion,
    editQuestion,
    getQuestionsFromDB,
    getQuestionTypesMonthlyReport,
    getUsageChatBot,
    getUserInteractions,
    toggleCommonQuestion,
} from '../services/DashboardService';

const initialState: DashboardState = {
    commonQuestions: [],
    questions: [],
    questionsLoading: false,
    isLoadingCommonQuestions: false,
    questionsError: undefined,
    isLoading: false,
    questionTypesMonthlyReport: [],
    usageChatBot: [],
    userInteractions: [],
};

const dashboardReducer = (state: DashboardState, action: Action): DashboardState => {
    switch (action.type) {
        case 'FETCH_QUESTIONS_START':
            return { ...state, questionsLoading: true, questionsError: undefined };
        case 'FETCH_QUESTIONS_SUCCESS': {
            const questions = action.payload;
            const commonQuestions = questions.filter((q) => q.common === true);

            return {
                ...state,
                questionsLoading: false,
                questions: questions,
                commonQuestions: commonQuestions,
            };
        }
        case 'FETCH_QUESTIONS_ERROR':
            return {
                ...state,
                questionsLoading: false,
                questionsError: action.payload,
            };
        case 'UPDATE_COMMON_QUESTIONS':
            return {
                ...state,
                commonQuestions: action.payload.commonQuestions,
                questions: action.payload.newQuestionList,
            };
        case 'ADD_QUESTIONS':
            return {
                ...state,
                questions: [...state.questions, action.payload],
            };
        case 'UPDATE_QUESTION':
            return {
                ...state,
                questions: state.questions.map((q) => (q.id === action.payload.id ? action.payload : q)),
            };
        case 'DELETE_QUESTION':
            return {
                ...state,
                questions: state.questions.filter((q) => q.id !== action.payload.toString()),
            };
        case 'RESET':
            return initialState;

        case 'LOADING':
            return { ...state, isLoading: action.payload };

        case 'GET_QUESTION_TYPES_MONTHLY_REPORT':
            return {
                ...state,
                questionTypesMonthlyReport: action.payload,
            };

        case 'GET_USAGE_CHATBOT':
            return {
                ...state,
                usageChatBot: action.payload,
            };

        case 'GET_USER_INTERACTIONS':
            return {
                ...state,
                userInteractions: action.payload,
            };

        default:
            return state;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [dashboardState, dispatch] = useReducer(dashboardReducer, initialState);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                dispatch({ type: 'FETCH_QUESTIONS_START' });

                const fetchQuestions = await getQuestionsFromDB();

                dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: fetchQuestions });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
                dispatch({ type: 'FETCH_QUESTIONS_ERROR', payload: errorMessage });
                console.error('Error fetching questions:', err);
            }
        };

        if (dashboardState.questions.length === 0 && !dashboardState.questionsLoading) {
            fetchQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dashboardActions: DashboardActions = useMemo(
        () => ({
            getQuestionsFromDB: async () => {
                dispatch({ type: 'FETCH_QUESTIONS_START' });

                const fetchQuestions = await getQuestionsFromDB();

                dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: fetchQuestions });
            },

            toggleCommonQuestion: async (questionId: number) => {
                const result = await toggleCommonQuestion(questionId);

                if (result.status) {
                    dispatch({
                        type: 'UPDATE_COMMON_QUESTIONS',
                        payload: { newQuestionList: result.newQuestionList, commonQuestions: result.commonQuestions },
                    });
                }
            },
            addQuestion: async (questionData) => {
                dispatch({ type: 'LOADING', payload: true });
                const result = await addNewQuestion({
                    id: questionData?.id || '0',
                    question: questionData?.question || '',
                    answer: questionData?.answer || '',
                    category: questionData?.category,
                    common: questionData?.common || false,
                });

                dispatch({ type: 'ADD_QUESTIONS', payload: result.new_question });
                dispatch({ type: 'LOADING', payload: false });
                return result.message;
            },
            updateQuestion: async (questionData) => {
                dispatch({ type: 'LOADING', payload: true });
                const result = await editQuestion({
                    id: questionData?.id || '0',
                    question: questionData?.question || '',
                    answer: questionData?.answer || '',
                    category: questionData?.category,
                    common: questionData?.common || false,
                });
                dispatch({ type: 'UPDATE_QUESTION', payload: result.new_question });
                dispatch({ type: 'LOADING', payload: false });
                return result.message;
            },
            deleteQuestion: async (id) => {
                dispatch({ type: 'LOADING', payload: true });
                const result = await deleteQuestion(id);
                dispatch({ type: 'DELETE_QUESTION', payload: id });
                dispatch({ type: 'LOADING', payload: false });
                return result;
            },
            getQuestionTypesMonthlyReport: async (year: number, month: number) => {
                dispatch({ type: 'LOADING', payload: true });
                const result = await getQuestionTypesMonthlyReport(year, month);

                dispatch({ type: 'GET_QUESTION_TYPES_MONTHLY_REPORT', payload: result });
                dispatch({ type: 'LOADING', payload: false });
                return result;
            },
            getUsageChatBot: async (year: number, month: number) => {
                dispatch({ type: 'LOADING', payload: true });
                const result = await getUsageChatBot(year, month);
                dispatch({ type: 'GET_USAGE_CHATBOT', payload: result });
                dispatch({ type: 'LOADING', payload: false });
                return result;
            },
            getUserInteractions: async () => {
                dispatch({ type: 'LOADING', payload: true });
                const result = await getUserInteractions();
                dispatch({ type: 'GET_USER_INTERACTIONS', payload: result });
                dispatch({ type: 'LOADING', payload: false });
                return result;
            },
        }),
        [],
    );

    const value = useMemo<DashboardContextValue>(
        () => ({ dashboardState, dashboardActions }),
        [dashboardState, dashboardActions],
    );

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
