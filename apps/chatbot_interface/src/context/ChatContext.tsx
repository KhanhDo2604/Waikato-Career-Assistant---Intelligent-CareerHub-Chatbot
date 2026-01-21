/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Action, ChatActions, ChatContextValue, ChatMessage, ChatState } from '../constants/type/type';
import { getAnswer } from '../services/ChatbotService';

const initialState: ChatState = {
    messages: [
        {
            id: '1',
            sender: 'bot',
            text: 'Hello! How can I help you today?',
            createAt: new Date(),
        },
    ],
    inputText: '',
    isBotTyping: false,
    hasStarted: false,
};

const chatReducer = (state: ChatState, action: Action): ChatState => {
    switch (action.type) {
        case 'SET_INPUT':
            return { ...state, inputText: action.payload };
        case 'SET_TYPING':
            return { ...state, isBotTyping: action.payload };
        case 'SET_STARTED':
            return { ...state, hasStarted: action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const fallbackMessage = `Sorry, this question is currently outside the scope of what I can assist with.\nPlease visit the link below to submit your question directly to an administrator for further support. \nhttps://mycareer.waikato.ac.nz/students/questions/`;

    const actions: ChatActions = useMemo(
        () => ({
            setInputText: (v: string) => dispatch({ type: 'SET_INPUT', payload: v }),

            resetChat: () => dispatch({ type: 'RESET' }),

            sendMessage: async (text: string) => {
                const trimmedText = text.trim();
                if (!trimmedText) return;
                if (state.isBotTyping) return;

                if (!state.hasStarted) dispatch({ type: 'SET_STARTED', payload: true });

                const userMessage: ChatMessage = {
                    id: Date.now().toString(),
                    sender: 'user',
                    text: trimmedText,
                    createAt: new Date(),
                };

                dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
                dispatch({ type: 'SET_INPUT', payload: '' });

                dispatch({ type: 'SET_TYPING', payload: true });

                try {
                    const botReply = await getAnswer(trimmedText);

                    const botMessage: ChatMessage =
                        botReply.answer && botReply.answer.length > 0
                            ? {
                                  id: (Date.now() + 1).toString(),
                                  sender: 'bot',
                                  text: botReply.answer,
                                  createAt: new Date(),
                              }
                            : {
                                  id: (Date.now() + 1).toString(),
                                  sender: 'bot',
                                  text: fallbackMessage,
                                  createAt: new Date(),
                              };

                    dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                    const botMessage: ChatMessage = {
                        id: (Date.now() + 2).toString(),
                        sender: 'bot',
                        text: err?.message || 'Sorry, something went wrong. Please try again later.',
                        createAt: new Date(),
                    };
                    dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
                } finally {
                    dispatch({ type: 'SET_TYPING', payload: false });
                }
            },
        }),
        [state.hasStarted, state.isBotTyping],
    );

    const value = useMemo<ChatContextValue>(() => ({ state, actions }), [state, actions]);

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
