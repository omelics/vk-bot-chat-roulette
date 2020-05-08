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

const templates = [
    ['Выбираем жертву', 'Гадаем на рунах', 'Жертва на ревью', '😈'],
    ['Подбираем лучшего инженера', 'Проводим собеседования', 'Ревью посмотрит уважаемый разработчик', '🎩'],
    ['Ищем счастливчика', 'Опрашиваем друзей', 'Ревью проведёт', '🤩'],
    ['Выбираем хорошего мальчика', 'Закупаем лакомства', 'Ревью обнюхает', '🐶'],
    ['Ищем плохую компанию', 'Шатаемся по району', 'Ревью проведёт чётенький пацан', '😎'],
    ['Открываем врата ада', 'Нагреваем котлы', 'Ревью вилы поднимет', '👹'],
    ['Рисуем радугу', 'Радуемся солнцу', 'В этот чудесный день ревью проведёт', '☀️'],
    ['Изучаем вирус', 'Ищем подопытного ревьюера', 'На стол к лаборанту попадает', '🧪'],
]

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function later(delay) {
    return new Promise(function(resolve) {
        setTimeout(resolve, delay);
    });
}

async function chooseVictim(peer_id, template) {
    const data = await api('messages.getConversationMembers', {
        peer_id: peer_id,
        access_token: process.env.TOKEN,
    }) 
    const items = data.response.profiles
    const victim = randomItem(items)
    return `${template[2]}: @id${victim.id} (${victim.first_name} ${victim.last_name}) ${template[3]}`    
}

function startVictimSearch(peer_id, template, log) {
    log(`${template[0]}...`)
    chooseVictim(peer_id, template).then((victim) => {
        later(1000).then(() => {
            log(`${template[1]}..`)
            later(1000).then(() => {
                log(victim)
            })
        })
    }).catch((err) => {
        log(`Произошла ошибка 🥺\n(${JSON.stringify(err.response)})`)
    })
}

function endsWithAny(suffixes, string) {
    return suffixes.some(function (suffix) {
        return string.endsWith(suffix);
    });
}

bot.on((ctx) => {
    if (endsWithAny(['го', 'go'],ctx.message.text)) {
        const template = randomItem(templates);
        startVictimSearch(ctx.message.peer_id, template, (message) => {
            ctx.reply(message);
        });
    }
})
 
app.use(bodyParser.json())

app.post('/api', bot.webhookCallback)

bot.startPolling()
 
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`);
});
