//Data structure
// common_questions (
//   question: string,
//   answer: string,
//   category: string,      // 'CV', 'Internship', 'Appointment', ...
//   createdAt: Timestamp,
//   updatedAt: Timestamp

// );

// CREATE TABLE interactions (
//     anonSid: string,        // lưu UUID từ HttpOnly cookie (backend đọc được)
//   question: string,
//   answer: string,
//   category?: string,      // snapshot: 'CV', 'Job Search', ...
//   createdAt: Timestamp
// );

/**
 * Count how many question types in a particular month (Firestore version)
 *
 * Goal:
 * Build data for Pie Chart
 * { "CV": 34, "Internship": 21, "Job Search": 18, "General": 14 }
 *
 * Input:
 * - year: number        // e.g. 2025
 * - month?: number      // optional (1..12)
 *
 * Output:
 * {
 *   status: 200,
 *   data: { "CV": 34, "Internship": 21, ... }
 * }
 *
 * Firestore Steps:
 * 1) Query collection "interactions".
 * 2) Filter by year and (optionally) month using where().
 * 3) Loop through documents:
 *    - Read category field.
 *    - If category is missing/null → treat as "General".
 * 4) Use a JS object to count occurrences.
 * 5) Return the object map.
 */
export const questionTypesMonthlyReport = async () => {
    try {
        // TODO:
        // 1) Read year/month from request query
        // 2) Build Firestore query:
        //    query(collection(database, 'interactions'), where('year','==',year))
        // 3) If month exists → add where('month','==',month)
        // 4) Execute query
        // 5) Reduce docs into:
        //    const result: Record<string, number> = {}
        // 6) return { status: 200, data: result }
    } catch (error: any) {
        return { status: 500, message: `questionTypesMonthlyReport: ${error.message}` };
    }
};

/**
 * Count how many users use chatbot in a particular period
 *
 * Goal:
 * Build Bar Chart data
 *
 * Input:
 * - year: number
 * - month?: number (optional)
 *
 * Output:
 * {
 *   status: 200,
 *   data: {
 *     uniqueUsers: number,
 *     users: number,
 *     alumni: number,
 *     total: number
 *   }
 * }
 *
 * Firestore Steps:
 * 1) Query interactions filtered by year/month.
 * 2) Loop through all documents.
 * 3) Use:
 *    - Set() to count unique anonSid
 *    - Simple counters for userType
 * 4) Return aggregated numbers.
 */
export const usageChatBot = async () => {
    try {
        // TODO:
        // 1) Query interactions by year/month
        // 2) Create:
        //    const uniqueUsers = new Set<string>()
        //    let users = 0, alumni = 0
        // 3) For each doc:
        //    - uniqueUsers.add(anonSid)
        //    - if userType === 'user' → users++
        //    - if userType === 'alumni' → alumni++
        // 4) total = users + alumni
        // 5) return { status: 200, data: {...} }
    } catch (error: any) {
        return { status: 500, message: `usageChatBot: ${error.message}` };
    }
};

/**
 * Get MOST COMMON QUESTIONS in a particular month
 *
 * (Your function name says "type questions", but in UI you show
 * "Most Common Questions", so this function should probably return questions)
 *
 * Goal: Top 5 most question types in the period by counting.
 *
 * Input:
 * - month?: number
 * - year: number
 *
 * Output (example):
 * {
 *   status: 200,
 *   data: [
 *     { type: "CV", count: 12 },
 *     ...
 *   ]
 * }
 *
 * Firestore Steps:
 * 1) Query interactions filtered by year/month.
 * 2) Loop through docs and count by question text.
 * 3) Convert map to array.
 * 4) Sort by count DESC.
 * 5) Slice top N (e.g. 5).
 */
export const mostCommonTypeQuestions = async () => {
    try {
    } catch (error: any) {
        return { status: 500, message: `mostCommonTypeQuestions: ${error.message}` };
    }
};

/**
 * Get Recent User Interactions (question and Date)
 *
 * Goal: Show a table of the newest interactions (like activity log).
 *
 * Input:
 * - limit?: number (default 100)
 *
 * Output:
 * {
 *   status: 200,
 *   data: [
 *     {
 *       id: "uuid",
 *       question: "...",
 *       date: "2025-01-05T10:15:00Z"
 *     },
 *     ...
 *   ]
 * }
 *  * Firestore Steps:
 * 1) Query interactions ordered by createdAt DESC.
 * 2) Apply limit().
 * 3) Map docs to frontend-friendly format.
 */
export const userInteractions = () => {
    try {
        // TODO:
        // - Get limit from params (optional)
        // - Query DB for latest rows
        // - Map to Interaction[] for frontend
        // - Return { status: 200, data: interactions }
    } catch (error: any | Error) {
        return { status: 500, message: `userInteractions: ${error.message}` };
    }
};

/**
 * Update FAQ dataset (Firestore version)
 *
 * Goal:
 * Allow admin to add/update FAQ questions
 *
 * Input:
 * [
 *   { id?, question, answer, category, isActive }
 * ]
 *
 * Output:
 * { status: 200, updated: number }
 *
 * Firestore Steps:
 * 1) Loop through input array.
 * 2) Validate question & answer.
 * 3) If id exists:
 *    - update doc(common_questions/{id})
 * 4) Else:
 *    - add new document
 * 5) Count how many were written.
 */
export const updateDataset = async () => {
    try {
        // TODO:
        // 1) Read dataset from request body
        // 2) Validate each item
        // 3) Use add() or update()
        // 4) return count
    } catch (error: any) {
        return { status: 500, message: `updateDataset: ${error.message}` };
    }
};
