import {Router} from "express";
import {
    loginUserHandler,
    logoutUserHandler,
    refreshTokenHandler,
    registerUserHandler,
} from "./auth.controller"
import {loginSchema, registerSchema} from "./auth.validation"
import {validate} from "../../middlewares/validare.middleware"
/*
 * AUTH ROUTES
 */

const router: Router = Router()

router.post("/register", validate(registerSchema),registerUserHandler)
router.post("/login", validate(loginSchema), loginUserHandler)
router.post("/refresh", refreshTokenHandler)
router.post("/logout", logoutUserHandler)

export default router;