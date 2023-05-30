const { Telegraf } = require('telegraf');
const fs = require('fs');
const { title } = require('process');

const bot = new Telegraf('5980630603:AAH3ikiRkcAP3qVpKjZA9mfh1IC95pHGxVk');

const questions = {
  weekend: {
    q1: 'Сколько дней ты берешь за свой счет?',
  },
  distant: {
    q1: 'Сколько дней ты будешь на удаленке?',
  },
  late: {
    q1: 'На сколько ты опаздываешь? (укажи время в минутах/часах)',
    q2: 'Подскажи, пожалуйста, почему опаздываешь',
  },
  be_later: {
    q1: 'В какое время ты планируешь быть в офисе?',
    q2: 'Укажи, пожалуйста, причину (Если встреча, то укажи клиента)',
  },
  pain: {},
  vacation: {
    q1: 'Пожалуйста, напиши даты отпуска в формате дд.мм-дд.мм',
  },
  business_trip: {
    q1: 'Пожалуйста, напиши даты командировки в формате дд.мм-дд.мм',
  },
};

const commands = ['Заболел', 'На удаленке', 'Буду позже', 'Опаздываю', 'Командировка', 'В отпуске', 'День за свой счет'];

bot.start((ctx) => {
  const userId = ctx.from.id;
  const users = loadUsers();

  if (users[userId]) {
    ctx.reply(`Привет, ${users[userId].userName}!`);
    showCommands(ctx);
  } else {
    ctx.reply('Как тебя зовут?');
  }
});

bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const users = loadUsers();

  if (!users[userId]) {
    users[userId] = {};
    users[userId].userName = ctx.message.text;
    saveUsers(users);

    ctx.reply(`Приятно познакомиться, ${users[userId].userName}! Выбери команду:`);
    showCommands(ctx);
  } else {
    const command = ctx.message.text;
    switch (command) {
      case 'Заболел':
        // Действие для Заболел
        ctx.reply('Ты заболел. Пожалуйста, позаботься о своем здоровье.');
        break;
      case 'На удаленке':
        askQuestions(ctx, userId, 'distant');
        break;
      case 'Буду позже':
        askQuestions(ctx, userId, 'be_later');
        break;
      case 'Опаздываю':
        askQuestions(ctx, userId, 'late');
        break;
      case 'Командировка':
        askQuestions(ctx, userId, 'business_trip');
        break;
      case 'В отпуске':
        askQuestions(ctx, userId, 'vacation');
        break;
      case 'День за свой счет':
        const userId = ctx.from.id;
        const users = loadUsers();
        messageText = {};
        messageText[title] = command;
        // messageText[userName] = users[userId].userName

        ctx.reply(`${questions.weekend.q1}`);
        messageText[q1] = ctx.message.text;

        const finalMessage = `<b>${messageText.title}</b>\n${String.fromCodePoint(0x1F464)} Имя - ${messageText.userName}\n${String.fromCodePoint(0x2753)} Дней взял - ${messageText.q1}`;

        ctx.telegram.sendMessage(-740721555, finalMessage);
        console.log('Сообщение успешно отправлено в группу');
        break;
      default:
        ctx.reply('Неверная команда');
        break;
    }
  }
});

function showCommands(ctx) {
  ctx.reply('Выбери команду:', {
    reply_markup: {
      keyboard: commands.map((command) => [{ text: command }]),
      one_time_keyboard: true,
    },
  });
}

function loadUsers() {
  try {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users));
}

bot.launch();
