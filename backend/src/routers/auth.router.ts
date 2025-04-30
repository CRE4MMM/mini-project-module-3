import express from 'express'
import authController from '../controllers/auth.controller'
import { protectWithRole } from '../middleware/rolecheck'

const router = express.Router()

router.post('/register', authController.registCust)
router.post('/register/org',authController.registOrg)
router.post('/signin', authController.signIn)
router.get('/keepsignin', protectWithRole(['CUSTOMER', 'ORGANIZER']), authController.keepSignIn)
router.post('/signout', protectWithRole(['CUSTOMER', 'ORGANIZER']), authController.signOut)

export default router