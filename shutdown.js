import mongoose from 'mongoose'
import { server } from './index'

async function shutdown() {
    server.close()
    await mongoose.disconnect()
}

export default shutdown