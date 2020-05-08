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

async function chooseVictim(peer_id) {
    const data = await api('messages.getConversationMembers', {
        peer_id: peer_id,
        access_token: process.env.TOKEN,
    })
    var items = data.response.profiles
    var victim = items[Math.floor(Math.random() * items.length)]
    return `${victim.first_name} ${victim.last_name}`
}

bot.on(async (ctx) => {
    if (ctx.message.text.endsWith('victim')) {
        peer_id = ctx.message.peer_id
        chooseVictim(peer_id).then((victim) => {
            ctx.reply(victim)
        })
    }
})
 
app.use(bodyParser.json())

app.post('/api', bot.webhookCallback)

bot.startPolling()
 
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`);
});
