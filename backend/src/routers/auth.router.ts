import express from 'express'
import authController from '../controllers/auth.controller'

const router = express.Router()

router.post('/register', authController.registCust)
router.post('/register/org',authController.registOrg)
router.post('/signin', authController.signIn)
router.get('/verify', authController.verifyAccount)

export default router