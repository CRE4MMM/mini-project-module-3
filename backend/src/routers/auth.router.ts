import express from 'express'
import authController from '../controllers/auth.controller'
import { protectWithRole } from '../middleware/rolecheck'

const router = express.Router()

router.post('/register', authController.registCust)
router.post('/register/org', protectWithRole(['ORGANIZER']), authController.registOrg)
router.post('/signin', authController.signIn)

export default router