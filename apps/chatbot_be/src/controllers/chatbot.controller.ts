import { Request, Response } from "express";

export const getChatbotStatusController = (
  request: Request,
  response: Response
) => {
  try {
  } catch (error: Error | any) {
    return { status: 500, message: error.message };
  }
};
