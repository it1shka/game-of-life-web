import {DataTypes, Sequelize} from 'sequelize'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db'
})

sequelize.authenticate()
    .then(() => console.log('Connected to a database'))
    .catch((err) => console.log(`Failed to connect to a database: ${err}`))

const Frame = sequelize.define('Frame', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    frame: DataTypes.TEXT,
    likes: DataTypes.INTEGER,
})

// await sequelize.sync({ alter: true })
await sequelize.sync()

export async function createNewFrame(name, frame) {
    await Frame.create({
        name, frame, likes: 0
    })
}

export async function getFramesWithOffset(offset) {
    return await Frame.findAll({
        offset: offset,
        limit: 5,
        order: ['createdAt', 'DESC'],
        raw: true
    })
}

export async function likeFrame(frameId) {
    const frame = await Frame.findByPk(frameId)
    if (!frame) {
        throw new Error(`Frame ${frameId} not found`)
    }
    frame.likes++
    await frame.save()
}
