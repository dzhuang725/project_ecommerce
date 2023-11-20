const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuthenticated = require("../middleware/adminAuthenticated");

router.get("/admin/login", adminController.adminLoginView);
router.get(
  "/admin/dashboard",
  adminAuthenticated,
  adminController.adminDashboardView
);

router.post("/admin/login", adminController.adminLogin);
module.exports = router;
