import { Timestamp } from 'firebase-admin/firestore';

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

export type InteractionDoc = {
    anonSid?: string;
    anon_sid?: string;
    userType?: 'user' | 'alumni';
    user_type?: 'user' | 'alumni';
    question?: string;
    answer?: string;
    category?: string;
    createdAt?: Timestamp | string | Date;
};

export type FaqItem = {
    id?: string;
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
};
