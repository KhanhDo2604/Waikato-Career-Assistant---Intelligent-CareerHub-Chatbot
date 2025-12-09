import { Request, Response } from "express";

export const handleQuestionController = (
  request: Request,
  response: Response
) => {
  try {
    const { question } = request.body;
  } catch (error: Error | any) {
    return { status: 500, message: error.message };
  }
};
