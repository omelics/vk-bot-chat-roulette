const express = require('express')
const bodyParser = require('body-parser')
const VkBot = require('node-vk-bot-api')
 
require('dotenv').config();

console.log('PORT:', process.env.PORT)
console.log('GROUP ID:', process.env.GROUP_ID)
console.log('TOKEN:', process.env.TOKEN)
console.log('SECRET:', process.env.SECRET)
console.log('CONFIRMATION:', process.env.CONFIRMATION)

const app = express()
const bot = new VkBot({
    token: process.env.TOKEN,
    group_id: process.env.GROUP_ID,
    secret: process.env.SECRET,
    confirmation: process.env.CONFIRMATION,
  })
 
bot.on((ctx) => {
  ctx.reply('Hello!')
})
 
app.use(bodyParser.json())

app.post('/api', bot.webhookCallback)
 
app.listen(process.env.PORT)
