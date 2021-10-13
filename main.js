const { Client, Intents, Collection, VoiceChannel } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');

const { generateDependencyReport, joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, VoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
console.log(generateDependencyReport());

var { token } = require('./config.json');
const chalk = require('chalk');

if (token == "") token = process.env.TOKEN;

const client = new Client({ intents: ['GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILDS'] });

// Youtube Player
var queue = [];
var connection = {};
var playing = false;
var connected = false;
var connection = {};

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == "play") {
        const channel = interaction.member.voice.channel;
        const url = interaction.options.getString("url");

        if (!this.connected) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            this.connected = true;
        }

        const info = await ytdl.getInfo(url);

        console.log(`Playing ${url}`);
        interaction.reply(`Playing ${info.videoDetails.title}`);

        this.connection = getVoiceConnection(interaction.guild.id);
        const stream = ytdl(url, {filter: 'audioonly'});
        const player = createAudioPlayer();
        var resource = createAudioResource(stream);
        player.play(resource);
        this.connection.subscribe(player);
    }
});

client.once('ready', () => {
	console.log(chalk.greenBright('Login successful!'));
});

client.login(token);