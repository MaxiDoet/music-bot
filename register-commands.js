const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('./config.json');

const commands = [
	new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a youtube video or audio streams')
		.addStringOption(option => {
			return option
				.setName("url")
				.setDescription("The video url")
				.setRequired(true);
		})
	]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
