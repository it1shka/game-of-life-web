import express from 'express'
import ApiController from './controller.js'

const router = new express.Router()
router.use(express.json())
router.get('/frames', ApiController.getFrames)
router.post('/new', ApiController.putFrame)
router.get('/like/:id', ApiController.likeFrame)
router.get('*', ApiController.notFound)
export default router
