const express = require('express')
const bodyParser = require('body-parser')
const vkBot = require('node-vk-bot-api')
const api = require('node-vk-bot-api/lib/api')
const Markup = require('node-vk-bot-api/lib/markup')
 
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

async function chooseVictim(peer_id, template) {
    console.log(`start messages.getConversationMembers request: peer_id - ${peer_id}, token - ${process.env.TOKEN}`)
    const data = await api('messages.getConversationMembers', {
        peer_id: peer_id,
        access_token: process.env.TOKEN,
    }) 
    const items = data.response.profiles
    const victim = randomItem(items)
    return `${template[2]} @id${victim.id} (${victim.first_name} ${victim.last_name}) ${template[3]}`    
}

const sleep = require('util').promisify(setTimeout)

async function startVictimSearch(peer_id, template, log) {
    try {
        const victim = await chooseVictim(peer_id, template)
        await sleep(1000)
        log(`${template[0]}...\n${template[1]}..\n${victim}`)
    } catch (err) {
        await sleep(1000)
        log(`Произошла ошибка 🥺\n(${JSON.stringify(err.response)})`)
    }
}

bot.on((ctx) => {
    console.log(JSON.stringify(ctx))

    const message = ctx.message.text
    if (message) {
        const expr = /^(?:\[club[0-9]+\|.+\] |-)(\w+)$/g
        const res = expr.exec(message)
        const command = res[1]
        console.log(message, '->', command)
        switch (command) {
            case 'review':
                const template = randomItem(templates)
                startVictimSearch(ctx.message.peer_id, template, (message) => {
                    ctx.reply(message)
                })
                break
            case 'keyboard':
                ctx.reply(
                    'Заряжаем барабан...',
                    null, 
                    Markup.keyboard([
                        Markup.button({
                        action: {
                            type: 'callback',
                            label: 'Крутануть',
                            payload: JSON.stringify({
                                type: 'callback',
                                label: 'alert',
                                payload: JSON.stringify({
                                    type: 'show_snackbar',
                                    text: 'Крутим барабан...'
                                }),
                            }),
                        },
                        color: 'default',
                        }),
                    ]),
                )
                break
            default:
                break
        }
    }    
})

app.use(bodyParser.json())

app.post('/api', bot.webhookCallback)

bot.startPolling()
 
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`)
})
