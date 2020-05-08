const express = require('express')
const bodyParser = require('body-parser')
const VkBot = require('node-vk-bot-api')
 
require('dotenv').config();

console.log('PORT:', process.env.PORT)
console.log('TOKEN:', process.env.TOKEN)
console.log('CONFIRMATION:', process.env.CONFIRMATION)

const app = express()
const bot = new VkBot({
  token: process.env.TOKEN,
  confirmation: process.env.CONFIRMATION,
})
 
bot.on((ctx) => {
  ctx.reply('Hello!')
})
 
app.use(bodyParser.json())

app.post('/api', bot.webhookCallback)
 
app.listen(process.env.PORT)
