import { createContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Action, DashboardActions, DashboardContextValue, DashboardState } from '../constants/type/type';
import { getQuestionsFromDB, toggleCommonQuestion } from '../services/DashboardService';

const initialState: DashboardState = {
    commonQuestions: [],
    questions: [],
    questionsLoading: false,
    isLoadingCommonQuestions: false,
    questionsError: undefined,
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
        case 'RESET':
            return initialState;
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
        }),
        [],
    );

    const value = useMemo<DashboardContextValue>(
        () => ({ dashboardState, dashboardActions }),
        [dashboardState, dashboardActions],
    );

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
