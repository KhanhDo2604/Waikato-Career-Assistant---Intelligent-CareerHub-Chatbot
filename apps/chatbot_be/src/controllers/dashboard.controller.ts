import { Request, Response } from "express";

export const getDashboardStatusController = (
  request: Request,
  response: Response
) => {
  try {
    //Just query params or body or headers if needed, then call service functions
    //Send response back to client
    //Remember to set proper status codes, also handle errors status
  } catch (error: any | Error) {
    response.status(500).json({ message: error.message });
  }
};
