const { MessageEmbed, Client, Intents } = require('discord.js');
const { channelId, token } = require('./config.json');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});


let channel;

client.once('ready', () => {
    console.log('Ready!');
    client.channels.fetch(channelId).then(gChannel => channel = gChannel);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

client.on('messageReactionAdd', async (reaction, users) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

    if (reaction.emoji.name !== '📰') {
        return;
    }
    // // console.log("Someone logged the news!")
    // console.log(`${users.username}'s message "${reaction.message.content}" is newsworthy!`);
    // // console.log(reaction.message);
    // console.log(channel.name)

    // emoji is applied to message
    // get message URL and send to channel

    channel.send(reaction.message.url)
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(console.error);

    // const exampleEmbed = new MessageEmbed()
	// .setColor('#0099ff')
	// .setTitle('Some title')
	// .setURL(reaction.message.url)
	// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	// .setDescription('Some description here')
	// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
	// .addFields(
	// 	{ name: 'Regular field title', value: 'Some value here' },
	// 	{ name: '\u200B', value: '\u200B' },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
	// )
	// .addField('Inline field title', 'Some value here', true)
	// .setImage('https://i.imgur.com/AfFp7pu.png')
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

    // channel.send({ embeds: [exampleEmbed] });
})

client.login(token);