const express = require('express')
const bodyParser = require('body-parser')
const vkBot = require('node-vk-bot-api')
const api = require('node-vk-bot-api/lib/api')
 
require('dotenv').config();

console.log('PORT:', process.env.PORT)
console.log('GROUP ID:', process.env.GROUP_ID)
console.log('TOKEN:', process.env.TOKEN)
console.log('SECRET:', process.env.SECRET)
console.log('CONFIRMATION:', process.env.CONFIRMATION)

const app = express()
const bot = new vkBot({
    token: process.env.TOKEN,
    group_id: process.env.GROUP_ID,
    secret: process.env.SECRET,
    confirmation: process.env.CONFIRMATION,
})

async function handleVictim(ctx) {
    console.log('choosing victim')
    const response = await bot.execute('users.get', {
        user_ids: 6205753,
        access_token: process.env.TOKEN
    })
    ctx.reply(response)
}

bot.command('/victim', handleVictim)
 
app.use(bodyParser.json())

app.post('/api', bot.webhookCallback)

bot.startPolling()
 
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`);
});
