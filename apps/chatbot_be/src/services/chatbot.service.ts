import { ErrorResponse } from "../models/type.js";

// Place to handle chatbot logics

export const handleQuestion = async (question: string) => {
  try {
  } catch (error: ErrorResponse | any) {
    return { status: 500, message: error.message };
  }
};
