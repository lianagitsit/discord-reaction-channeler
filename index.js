const { MessageEmbed, Client, Intents } = require('discord.js');
const { channelId, token } = require('./config.json');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});


let channel;

client.once('ready', () => {
	const elapsed = Date.now();
	const currentTime = new Date(elapsed);
    console.log(`Ready at ${currentTime.toString()}!`);
    client.channels.fetch(channelId).then(gChannel => channel = gChannel);
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
		console.log(`Hit guard clause with ${reaction.emoji.name} on ${reaction.message.author.username}'s message: ${reaction.message.content}`)
        return;
    }
	
	const cache = reaction.message.reactions.cache;
	const filter = cache.filter((r) => r.emoji.name === '📰')
	if (filter.first().count > 1) {
		console.log(`Cache has multiple 📰, news already posted.`);
		return;
	}

	console.log(`Newsworthy message: ${reaction.message.content}`);
    const author = reaction.message.author;
    const image = reaction.message.attachments.first() ? reaction.message.attachments.first().url : null;

    const embed = new MessageEmbed()
	.setColor('PURPLE')
	.setTitle(reaction.message.createdAt.toDateString())
	.setURL(reaction.message.url)
	.setAuthor(author.username, author.avatarURL(), )
	.setDescription(reaction.message.content)
    .setThumbnail(image);

    channel.send({ embeds: [embed] }).catch(console.error);
})

client.login(token);