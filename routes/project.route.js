import e from "express";
import { 
    userNeed, 
    getAllProjects, 
    requestToJoin, 
    handleJoinRequest, 
    getMatchingProjects,
    getMyProjects,
    getJoinedProjects 
} from "../controllers/project.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = e.Router();

// Project creation and listing
router.route("/")
    .post(isAuthenticated, userNeed)
    .get(getAllProjects);

// User's projects
router.get("/my-projects", isAuthenticated, getMyProjects);
router.get("/joined-projects", isAuthenticated, getJoinedProjects);

// Project matching
router.get("/matching", isAuthenticated, getMatchingProjects);

// Project join requests
router.post("/join/:projectId", isAuthenticated, requestToJoin);
router.put("/request/:requestId", isAuthenticated, handleJoinRequest);

export default router;
