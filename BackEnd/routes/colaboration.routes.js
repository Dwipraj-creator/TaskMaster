const express = require("express");
const collaborationRouter = express.Router();
const auth = require("../middleware/auth.middleware");
const { createInvite ,acceptInvite,rejectInvite,getUserInvites} = require("../controllers/collaboration.controller");

// ✅ Create a new invite (task owner/admin only)
collaborationRouter.post("/invites", auth,createInvite);

// ✅ Get all pending invites for logged-in user
collaborationRouter.get("/invites", auth, getUserInvites);

// ✅ Accept invite using token
collaborationRouter.get("/invites/accept/:token", auth, acceptInvite);

// ✅ Reject invite using token
collaborationRouter.get("/invites/reject/:token", auth,rejectInvite);

module.exports = collaborationRouter;
