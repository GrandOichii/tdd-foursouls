import mongoose from 'mongoose'
import config from 'config'

mongoose.set('strictQuery', true)
// console.log();
await mongoose.connect(config.get('db'))
console.log('Connected to DB');