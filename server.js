import express from 'express'
import path from 'node:path'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use('/assets', express.static('assets'))

app.get('/', (_, res) => {
    const filepath = path.join(__dirname, 'html', 'index.html')
    res.sendFile(filepath)
})

app.get('*', (_, res) => {
    const filepath = path.join(__dirname, 'html', 'notfound.html')
    res.status(404).sendFile(filepath)
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})