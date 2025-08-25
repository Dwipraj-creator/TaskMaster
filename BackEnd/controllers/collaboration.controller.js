const CollaborationInvite = require("../models/collaborationInvite.model");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const crypto = require("crypto");

// ✅ 1. Create Invite
exports.createInvite = async (req, res) => {
  try {
    const { taskId, inviteeEmail, expiresInHours } = req.body;

    // check if task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only the creator of task can invite
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to invite on this task" });
    }

    // generate secure token
    const token = crypto.randomBytes(20).toString("hex");

    const invite = new CollaborationInvite({
      taskId,
      inviter: req.user.id,
      inviteeEmail,
      token,
      expiresAt: new Date(Date.now() + (expiresInHours || 24) * 60 * 60 * 1000), // default 24h
    });

    await invite.save();

    res.status(201).json({
      message: "Invite created successfully",
      inviteLink: `${process.env.FRONTEND_URL}/invite/${token}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating invite", error: error.message });
  }
};

// ✅ 2. Accept Invite
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await CollaborationInvite.findOne({ token });
    if (!invite) return res.status(404).json({ message: "Invalid invite token" });

    // check expiration
    if (invite.expiresAt < Date.now()) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ message: "Invite expired" });
    }

    // check if logged in user email matches invitee
    if (invite.inviteeEmail !== req.user.email) {
      return res.status(403).json({ message: "This invite is not for your account" });
    }

    // find task and add user as collaborator
    const task = await Task.findById(invite.taskId);
    if (!task.assignedTo.includes(req.user.id)) {
      task.assignedTo.push(req.user.id);
      await task.save();
    }

    invite.status = "accepted";
    await invite.save();

    res.status(200).json({ message: "Invite accepted, added to task collaborators", task });
  } catch (error) {
    res.status(500).json({ message: "Error accepting invite", error: error.message });
  }
};

// ✅ 3. Reject Invite (optional if you want explicit rejection)
exports.rejectInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await CollaborationInvite.findOne({ token });
    if (!invite) return res.status(404).json({ message: "Invalid invite token" });

    invite.status = "rejected";
    await invite.save();

    res.status(200).json({ message: "Invite rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting invite", error: error.message });
  }
};
// ✅ 4. Get All Invites for Logged-in User
exports.getUserInvites = async (req, res) => {
  try {
    const invites = await CollaborationInvite.find({
      inviteeEmail: req.user.email,
      status: "pending",
      expiresAt: { $gt: Date.now() },
    }).populate("taskId", "title description dueDate");

    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invites", error: error.message });
  }
};
