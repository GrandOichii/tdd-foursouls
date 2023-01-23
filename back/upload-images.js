import mongoose from 'mongoose'
import {readFileSync} from 'fs'

await mongoose.connect('mongodb://127.0.0.1/image-test')
console.log('Connected');

const Types = mongoose.model('Type', {
    name: {
        type: String,
        required: true
    },
    backgrounds: [{
        data: Buffer,
        contentType: String
    }]
})

const types = JSON.parse(readFileSync('./types.json'))
for (let [type, {backgrounds}] of Object.entries(types)) {
    const result = {name: type, backgrounds: []}
    backgrounds.forEach(bgPath => {
        const data = readFileSync(bgPath)
        result.backgrounds.push({
            data: data,
            contentType: 'image/png'
        })
    })
    await new Types(result).save()
}
// https://pasteboard.co/S7Y73blvNBVz.png
// https://pasteboard.co/ae36596pOLkx.png
await mongoose.disconnect()