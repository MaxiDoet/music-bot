const { Client, Intents, Collection, VoiceChannel, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const { generateDependencyReport, joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, VoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
console.log(generateDependencyReport());

const chalk = require('chalk');

const token = process.env.TOKEN;

const client = new Client({ intents: ['GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILDS'] });

// Youtube Player
var queue = [];
var connection = {};
var playing = false;
var connection = {};
var channel = {};

function play(channel, url) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    this.connection = getVoiceConnection(channel.guild.id);
    const stream = ytdl(url, {filter: 'audioonly'});
    const player = createAudioPlayer();
    var resource = createAudioResource(stream);
    player.play(resource);
    this.connection.subscribe(player);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName == "play") {
        channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply("❎ You need to be in a voice channel!");
            return;
        }

        interaction.reply("Please wait");

        const arg = interaction.options.getString("url");
        var url = "";

        if (!arg.includes("youtube.com")) {
            const results = await ytSearch.search(arg);
            url = results.all[0].url;
        } else {
            url = arg;
        }

        const info = await ytdl.getInfo(url);

        queue.push(url);
        if (queue.length > 1) {
            await interaction.editReply(`Added **${info.videoDetails.title}** to queue`);
        } else {
            await interaction.editReply(`Playing **${info.videoDetails.title}**`);
            play(channel, queue[0]);
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Playing")
            .setURL(url)
            .setThumbnail(info.videoDetails.thumbnails[0].url)
            .addField("Artist", info.videoDetails.ownerChannelName)
            .addField("Title", info.videoDetails.title)
            .addField("Duration", info.videoDetails.lengthSeconds + "s");

        interaction.followUp({embeds: [embed]});
    }

    if (interaction.commandName == "next") {
        if (!queue[1]) {
            interaction.reply("This was the last song!");
            queue.shift();
            return;
        }

        queue.shift();
        play(channel, queue[0]);
    }

    if (interaction.commandName == "info") {
        const url = queue[0];
        if (!url) {
            interaction.reply("I'm not playing anything... Sorry!");
            return;
        }

        interaction.reply("Please wait");

        const info =  ytdl.getInfo(url);

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Playing")
            .setURL(url)
            .setThumbnail(info.videoDetails.thumbnails[0].url)
            .addField("Artist", info.videoDetails.ownerChannelName)
            .addField("Title", info.videoDetails.title)
            .addField("Duration", info.videoDetails.lengthSeconds + "s");

        interaction.followUp({embeds: [embed]});
    }
});

client.once('ready', () => {
	console.log(chalk.greenBright('Login successful!'));
});

client.login(token);