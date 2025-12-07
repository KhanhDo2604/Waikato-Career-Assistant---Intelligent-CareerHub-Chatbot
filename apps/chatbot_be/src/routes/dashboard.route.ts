import { Router } from "express";
import { getDashboardStatusController } from "../controllers/dashboard.controller.js";

const dashboardRoute = Router();

dashboardRoute.get("/", getDashboardStatusController);

export default dashboardRoute;
