const express = require("express")
const router = express.Router()
const controller = require("../controlers/controller")

router.route("/").get(controller.home)
// router.route("/register").post(controller.register)
router.route("/check_login").post(controller.check_login)
router.route("/send_otp").post(controller.send_otp)
router.route("/verify_otp").post(controller.verify_otp)
router.route("/teacher_profile").get(controller.teacher_profile)
router.route("/update_profile").post(controller.update_profile)




module.exports = router