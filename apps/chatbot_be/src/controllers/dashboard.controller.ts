import { Request, Response } from "express";
import {
  questionTypesMonthlyReport,
  usageChatBot,
  mostCommonTypeQuestions,
  userInteractions,
} from "../services/dashboard.service.js";

export const getDashboardStatusController = async (
  request: Request,
  response: Response
) => {
  try {
    const metric = (request.query.metric as string) || "question-types";
    const year = request.query.year ? Number(request.query.year) : undefined;
    const month =
      request.query.month !== undefined ? Number(request.query.month) : undefined;
    const limit =
      request.query.limit !== undefined ? Number(request.query.limit) : undefined;

    if (!year) {
      return response.status(400).json({ message: "year query param is required" });
    }

    switch (metric) {
      case "question-types": {
        const result = await questionTypesMonthlyReport(year, month);
        return response.status(result.status).json(result);
      }
      case "usage": {
        const result = await usageChatBot(year, month);
        return response.status(result.status).json(result);
      }
      case "most-common": {
        const result = await mostCommonTypeQuestions(year, month, limit || 5);
        return response.status(result.status).json(result);
      }
      case "interactions": {
        const result = await userInteractions(limit || 100);
        return response.status(result.status).json(result);
      }
      default: {
        const [questionTypes, usage, commonQuestions, interactions] =
          await Promise.all([
            questionTypesMonthlyReport(year, month),
            usageChatBot(year, month),
            mostCommonTypeQuestions(year, month, limit || 5),
            userInteractions(limit || 100),
          ]);

        return response.status(200).json({
          status: 200,
          data: {
            questionTypes: questionTypes.data,
            usage: usage.data,
            mostCommon: commonQuestions.data,
            interactions: interactions.data,
          },
        });
      }
    }
  } catch (error: any | Error) {
    response.status(500).json({ message: error.message });
  }
};
