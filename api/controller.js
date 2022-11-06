import {createNewFrame, getFramesWithOffset, likeFrame} from './model.js'

class ApiController {

    putFrame = async (req, res) => {
        try {
            const name = req.body.name
            const frame = req.body.frame
            if (!name || !frame) {
                res.status(400).send('Either "name" or "frame" fields are empty')
                return
            }
            await createNewFrame(name, frame)
            res.status(200).send('Successfully added frame')
        } catch (err) {
            console.log(err)
            res.status(400).send('Failed to create new frame')
        }
    }

    getFrames = async (req, res) => {
        try {
            const offset = Number(req.query.offset) ?? 0
            const frames = await getFramesWithOffset(offset)
            res.status(200).send(frames)
        } catch (err) {
            console.log(err)
            res.status(400).send('Failed to retrieve frames')
        }
    }

    likeFrame = async (req, res) => {
        try {
            const frameId = Number(req.params.id)
            await likeFrame(frameId)
            res.status(200).send('Successfully liked frame ' + frameId)
        } catch (err) {
            console.log(err)
            res.status(400).send('Failed to like frame')
        }
    }

    notFound = (_, res) => {
        res.status(404).send('API path not found')
    }

}

export default new ApiController()