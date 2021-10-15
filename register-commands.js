const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const commands = [
	{
		name: "play",
		description: "Plays a youtube video",
		options:[
			{
				type: 3,
				name: "url",
				description: "The video url",
				required: true
			}
		]
	},
	{
		name: "next",
		description: "Plays the next song in the queue"
	},
	{
		name: "info",
		description: "Returns info about the current song"
	}
]

const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
