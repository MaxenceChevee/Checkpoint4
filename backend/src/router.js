const express = require("express");
const verifyToken = require("./controllers/verifyToken");

const router = express.Router();
const userControllers = require("./controllers/userControllers");
const friendControllers = require("./controllers/friendControllers");
const friendRequestControllers = require("./controllers/friendRequestControllers");
const notificationControllers = require("./controllers/notificationControllers");
const unreadNotificationController = require("./controllers/unreadNotificationController");
const readNotificationController = require("./controllers/readNotificationController");

router.post("/login", userControllers.login);

router.get("/users", verifyToken, userControllers.browse);
router.get("/users/:id", userControllers.read);
router.put("/users/:id", userControllers.edit);
router.get("/users/:id/check-wheel-spin", userControllers.checkWheelSpin);
router.post("/users", userControllers.add);
router.post("/forgot-password", userControllers.forgottenPassword);
router.post("/reset-password/:token", userControllers.resetPassword);
router.put("/users/:id/credits", verifyToken, userControllers.updateCredits);
router.delete("/users/:id", userControllers.destroy);
router.get(
  "/users/by-pseudoname/:pseudoname",
  userControllers.findUserByPseudoname
);

// Routes de gestion des amis
router.get("/friends/:userId", verifyToken, friendControllers.getFriendsList);
router.post("/friends/:friendId/add", verifyToken, friendControllers.addFriend);
router.delete(
  "/friends/:friendId/unfriend",
  verifyToken,
  friendControllers.unfriend
);

// Routes de gestion des demandes d'amis
router.post(
  "/friend-requests/:toUserId",
  verifyToken,
  friendRequestControllers.sendFriendRequest
);
router.get(
  "/friend-requests/:toUserId",
  verifyToken,
  friendRequestControllers.getFriendRequests
);
router.put(
  "/friend-requests/:notificationId/accept",
  verifyToken,
  friendRequestControllers.acceptFriendRequest
);
router.put(
  "/friend-requests/:notificationId/reject",
  verifyToken,
  friendRequestControllers.rejectFriendRequest
);
router.delete(
  "/friend-requests/:requestId/cancel",
  verifyToken,
  friendRequestControllers.cancelFriendRequest
);

// Routes de gestion des notifications
router.get(
  "/users/:userId/notifications",
  verifyToken,
  notificationControllers.getNotificationsByUserId
);
router.put(
  "/notifications/:notificationId/mark-as-read",
  verifyToken,
  notificationControllers.markNotificationAsRead
);
router.delete(
  "/notifications/:notificationId",
  verifyToken,
  notificationControllers.deleteNotification
);
router.get(
  "/unreadNotifications/:userId",
  verifyToken,
  unreadNotificationController.getUnreadNotificationsByUserId
);
router.get(
  "/readNotifications/:userId",
  verifyToken,
  readNotificationController.getReadNotificationsByUserId
);

module.exports = router;
