const express = require('express')
const bodyParser = require('body-parser')
const VkBot = require('node-vk-bot-api')
 
console.log(process.env.TOKEN)
console.log(process.env.CONFIRMATION)

const app = express()
const bot = new VkBot({
  token: process.env.TOKEN,
  confirmation: process.env.CONFIRMATION,
})
 
bot.on((ctx) => {
  ctx.reply('Hello!')
})
 
app.use(bodyParser.json())

app.post('api', function(res, req) {
    console.log('api', res, req)
})
app.post('/', bot.webhookCallback)
 
app.listen(process.env.PORT)
