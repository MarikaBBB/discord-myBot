const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The YouTube URL of the song to play')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const songUrl = interaction.options.getString('url');
    if (!ytdl.validateURL(songUrl)) {
      await interaction.followUp('Please provide a valid YouTube URL.');
      return;
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.followUp('You need to be in a voice channel to play music!');
      return;
    }

    try {
      const songInfo = await ytdl.getInfo(songUrl);
      const stream = ytdl.downloadFromInfo(songInfo, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      connection.subscribe(player);
      player.play(resource);

      connection.on(VoiceConnectionStatus.Ready, () => {
        interaction.followUp(`Now playing: ${songInfo.videoDetails.title}`);
      });

    } catch (error) {
      console.error(error);
      interaction.followUp('There was an error trying to play the song.');
    }
  },
};







// const { SlashCommandBuilder } = require('@discordjs/builders');
// // Assume ytdl-core and @discordjs/voice are installed and properly set up.
// // const ytdl = require('ytdl-core');
// // const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');

// // imports for the play command
// const ytdl = require('ytdl-core');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');


// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('play-song')
//     .setDescription('Plays a song from YouTube')
//     .addStringOption(option => option.setName('url').setDescription('The YouTube URL of the song to play').setRequired(true)),
//   async execute(interaction) {
//     // This is a simplified example, error checking and additional functionality should be added.
//     const songUrl = interaction.options.getString('url');
//     if (!ytdl.validateURL(songUrl)) {
//       await interaction.reply('Please provide a valid YouTube URL.');
//       return;
//     }

//     const songInfo = await ytdl.getInfo(songUrl);
//     const stream = ytdl.downloadFromInfo(songInfo, { filter: 'audioonly' });
//     const resource = createAudioResource(stream);
//     const player = createAudioPlayer();

//     const connection = joinVoiceChannel({
//       channelId: interaction.member.voice.channel.id,
//       guildId: interaction.guild.id,
//       adapterCreator: interaction.guild.voiceAdapterCreator,
//     });

//     connection.subscribe(player);
//     player.play(resource);
//     await interaction.reply(`Now playing: ${songInfo.videoDetails.title}`);
//   },
// };

// OLD CODE

// async function handlePlay(args, message) {
//   if (!args.length) {
//     await message.channel.send("Please provide a YouTube URL to play.");
//     return;
//   }

//   // Check if the URL is a valid YouTube URL
//   const songUrl = args.join(' ');
//   if (!ytdl.validateURL(songUrl)) {
//     await message.channel.send("Please provide a valid YouTube URL.");
//     return;
//   }

//   const voiceChannel = message.member.voice.channel;
//   if (!voiceChannel) {
//     await message.channel.send("You need to be in a voice channel to play music!");
//     return;
//   }

//   try {
//     const songInfo = await ytdl.getInfo(songUrl);
//     const stream = ytdl.downloadFromInfo(songInfo, { filter: 'audioonly' });

//     // Handle streaming errors
//     stream.on('error', error => {
//       console.error(`Stream Error: ${error.message}`);
//       message.channel.send('An error occurred while streaming the track.');
//     });

//     const connection = joinVoiceChannel({
//       channelId: voiceChannel.id,
//       guildId: message.guild.id,
//       adapterCreator: message.guild.voiceAdapterCreator,
//     });

//     const player = createAudioPlayer();
//     const resource = createAudioResource(stream, { metadata: { title: songInfo.videoDetails.title } });

//     player.play(resource);
//     connection.subscribe(player);

//     player.on('error', error => {
//       console.error(`Error: ${error.message} with resource ${resource.metadata.title}`);
//       message.channel.send('An error occurred while playing the track.');
//     });

//     player.on(AudioPlayerStatus.Idle, () => {
//       connection.destroy(); // Disconnects from the voice channel
//       message.channel.send("Playback has finished.");
//     });

//     await message.channel.send(`Now playing: ${resource.metadata.title}`);
//   } catch (error) {
//     console.error("Error playing the song:", error);
//     await message.channel.send("There was an error playing the song.");
//   }
// }

