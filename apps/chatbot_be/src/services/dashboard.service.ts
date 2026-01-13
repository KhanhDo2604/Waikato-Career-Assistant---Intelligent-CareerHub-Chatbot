import { promises as fs } from 'fs';
import path from 'path';

import { Question } from '../models/type';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, '../../../../AI_server/background_docs/QA_list.json');

export async function readQAFile(): Promise<Question[]> {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');

    return JSON.parse(raw);
}

export const getQuestionsService = async () => {
    try {
        const questions = await readQAFile();
        return { status: 200, data: questions };
    } catch (error) {
        return { status: 500, message: `getQuestionsService: ${error.message}` };
    }
};

export const toggleCommonQuestionService = async (questionId: number) => {
    try {
        const questions = await readQAFile();
        const updatedQuestions = questions.map((q) =>
            q.id === questionId.toString() ? { ...q, common: !q.common } : q,
        );

        await fs.writeFile(DATA_PATH, JSON.stringify(updatedQuestions, null, 2), 'utf-8');
        return {
            status: 200,
            newQuestionList: updatedQuestions,
            commonQuestions: updatedQuestions.filter((q) => q.common),
        };
    } catch (error) {
        return { status: 500, message: `toggleCommonQuestionService: ${error.message}` };
    }
};

export const getCommonQuestionsService = async () => {
    try {
        const questions = await readQAFile();
        const commonQuestions = questions.filter((q) => q.common);
        return commonQuestions;
    } catch (error) {
        return { status: 500, message: `getCommonQuestionsService: ${error.message}` };
//Data structure
// common_questions (
//   question: string,
//   answer: string,
//   category: string,      // 'CV', 'Internship', 'Appointment', ...
//   createdAt: Timestamp,
//   updatedAt: Timestamp
// );

// CREATE TABLE interactions (
//   anonSid: string,        // store UUID from HttpOnly cookie
//   question: string,
//   answer: string,
//   category?: string,      // snapshot: 'CV', 'Job Search', ...
//   createdAt: Timestamp
// );

import database from '../../firebase.js';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit as limitQuery,
    orderBy,
    query,
    updateDoc,
    where,
    Timestamp,
    QueryConstraint,
} from 'firebase/firestore';

type InteractionDoc = {
    anonSid?: string;
    anon_sid?: string;
    userType?: 'user' | 'alumni';
    user_type?: 'user' | 'alumni';
    question?: string;
    answer?: string;
    category?: string;
    createdAt?: Timestamp | string | Date;
};

type FaqItem = {
    id?: string;
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
};

const normalizeMonthIndex = (month?: number) => {
    if (month === undefined || month === null) return undefined;

    // Accept both 1-12 (human friendly) and 0-11 (Date.getMonth()) inputs
    if (month >= 1 && month <= 12) return month - 1;
    if (month >= 0 && month <= 11) return month;

    throw new Error('month must be between 1-12 (or 0-11 if zero-based)');
};

const buildDateConstraints = (year?: number, month?: number): QueryConstraint[] => {
    if (!year) return [];

    const monthIndex = normalizeMonthIndex(month);
    const start = new Date(year, monthIndex ?? 0, 1);
    const end = monthIndex === undefined ? new Date(year + 1, 0, 1) : new Date(year, monthIndex + 1, 1);

    return [where('createdAt', '>=', Timestamp.fromDate(start)), where('createdAt', '<', Timestamp.fromDate(end))];
};

/**
 * Count how many question types in a particular month (Firestore version)
 */
export const questionTypesMonthlyReport = async (year?: number, month?: number) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const constraints = buildDateConstraints(year, month);
        const snapshot = await getDocs(query(collection(database, 'interactions'), ...constraints));

        const result: Record<string, number> = {};

        snapshot.forEach((docSnap) => {
            const data = docSnap.data() as InteractionDoc;
            const category = data?.category || 'General';
            result[category] = (result[category] || 0) + 1;
        });

        return { status: 200, data: result };
    } catch (error: any) {
        return { status: 500, message: `questionTypesMonthlyReport: ${error.message}` };
    }
};

/**
 * Count how many users use chatbot in a particular period
 */
export const usageChatBot = async (year?: number, month?: number) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const constraints = buildDateConstraints(year, month);
        const snapshot = await getDocs(query(collection(database, 'interactions'), ...constraints));

        const uniqueUsers = new Set<string>();
        let users = 0;
        let alumni = 0;

        snapshot.forEach((docSnap) => {
            const data = docSnap.data() as InteractionDoc;

            const anonSid = (data.anonSid || data.anon_sid || '').trim();
            if (anonSid) uniqueUsers.add(anonSid);

            const userType = data.userType || data.user_type || 'user';
            if (userType === 'alumni') {
                alumni += 1;
            } else {
                users += 1;
            }
        });

        return {
            status: 200,
            data: {
                uniqueUsers: uniqueUsers.size,
                users,
                alumni,
                total: users + alumni,
            },
        };
    } catch (error: any) {
        return { status: 500, message: `usageChatBot: ${error.message}` };
    }
};

/**
 * Get MOST COMMON QUESTIONS in a particular month
 */
export const mostCommonTypeQuestions = async (year?: number, month?: number, top = 5) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const constraints = buildDateConstraints(year, month);
        const snapshot = await getDocs(query(collection(database, 'interactions'), ...constraints));

        const counter: Record<string, number> = {};

        snapshot.forEach((docSnap) => {
            const data = docSnap.data() as InteractionDoc;
            const questionKey = (data.question || '').trim() || 'Unknown';
            counter[questionKey] = (counter[questionKey] || 0) + 1;
        });

        const data = Object.entries(counter)
            .map(([question, count]) => ({ question, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, top);

        return { status: 200, data };
    } catch (error: any) {
        return { status: 500, message: `mostCommonTypeQuestions: ${error.message}` };
    }
};

/**
 * Get Recent User Interactions (question and Date)
 */
export const userInteractions = async (limit = 100) => {
    try {
        const snapshot = await getDocs(
            query(collection(database, 'interactions'), orderBy('createdAt', 'desc'), limitQuery(limit)),
        );

        const interactions = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as InteractionDoc;
            const createdAt =
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt
                    ? new Date(data.createdAt)
                    : undefined;

            return {
                id: docSnap.id,
                question: data.question || '',
                date: createdAt ? createdAt.toISOString() : '',
                userType: data.userType || data.user_type || 'user',
                questionType: data.category || 'General',
            };
        });

        return { status: 200, data: interactions };
    } catch (error: any | Error) {
        return { status: 500, message: `userInteractions: ${error.message}` };
    }
};

/**
 * Update FAQ dataset (Firestore version)
 */
export const updateDataset = async (dataset: FaqItem[]) => {
    try {
        if (!Array.isArray(dataset) || dataset.length === 0) {
            return { status: 400, message: 'dataset is required' };
        }

        const faqCollection = collection(database, 'common_questions');
        let updated = 0;

        for (const item of dataset) {
            if (!item?.question?.trim() || !item?.answer?.trim()) {
                return { status: 400, message: 'question and answer are required for each FAQ item' };
            }

            const payload = {
                question: item.question.trim(),
                answer: item.answer.trim(),
                category: item.category || 'General',
                isActive: item.isActive ?? true,
                updatedAt: Timestamp.now(),
            };

            if (item.id) {
                await updateDoc(doc(faqCollection, item.id), payload);
            } else {
                await addDoc(faqCollection, { ...payload, createdAt: Timestamp.now() });
            }

            updated += 1;
        }

        return { status: 200, updated };
    } catch (error: any) {
        return { status: 500, message: `updateDataset: ${error.message}` };
    }
};
