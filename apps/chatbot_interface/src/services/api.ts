const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

export interface MonthlyUserCount {
    month: string;
    uniqueUsers: number;
    users: number;
    alumni: number;
    total: number;
}

export const api = {
    async saveInteraction(userId: string, userType: 'user' | 'alumni', question: string, answer: string) {
        const response = await fetch(`${API_BASE_URL}/api/interactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, userType, question, answer }),
        });
        return response.json();
    },

    async getQuestionTypes(month?: number, year?: number) {
        const params = new URLSearchParams();
        if (month !== undefined) params.append('month', month.toString());
        if (year !== undefined) params.append('year', year.toString());
        const response = await fetch(`${API_BASE_URL}/api/analytics/question-types?${params}`);
        return response.json();
    },

    async getCommonQuestions(month?: number, year?: number, limit = 10) {
        const params = new URLSearchParams();
        if (month !== undefined) params.append('month', month.toString());
        if (year !== undefined) params.append('year', year.toString());
        params.append('limit', limit.toString());
        const response = await fetch(`${API_BASE_URL}/api/analytics/common-questions?${params}`);
        return response.json();
    },

    async getUserCounts(month?: number, year?: number): Promise<MonthlyUserCount[]> {
        const params = new URLSearchParams();
        if (month !== undefined) params.append('month', month.toString());
        if (year !== undefined) params.append('year', year.toString());
        const response = await fetch(`${API_BASE_URL}/api/analytics/user-counts?${params}`);
        return response.json();
    },

    async getInteractions(userType?: 'user' | 'alumni', limit?: number): Promise<Interaction[]> {
        const params = new URLSearchParams();
        if (userType) params.append('userType', userType);
        if (limit) params.append('limit', limit.toString());
        const response = await fetch(`${API_BASE_URL}/api/analytics/interactions?${params}`);
        return response.json();
    },
};
