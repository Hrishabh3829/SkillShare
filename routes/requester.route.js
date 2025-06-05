import e from "express";
import {
    getProjectRequests,
    getMyRequests,
    cancelRequest,
    getRequestStatus
} from "../controllers/requester.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = e.Router();

// Project creator routes
router.get("/project/:projectId", isAuthenticated, getProjectRequests);

// Requester routes
router.get("/my-requests", isAuthenticated, getMyRequests);
router.delete("/:requestId", isAuthenticated, cancelRequest);
router.get("/status/:projectId", isAuthenticated, getRequestStatus);

export default router; 