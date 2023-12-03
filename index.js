// Load environment variables from .env file
require("dotenv").config();

// Import axios for HTTP requests
const axios = require("axios");

// Import necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");

// Create a new client instance with the required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Command prefix
const commandPrefix = "!";

const jokes = [
  'Why don\'t scientists trust atoms? Because they make up everything.',
  'I told my wife she should embrace her mistakes. She gave me a hug.',
  'Parallel lines have so much in common. It\'s a shame they\'ll never meet.'
  // ... add more jokes
];

// imports for the play command
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

client.once("ready", () => {
  console.log("My-bot is ready!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(commandPrefix)) return;

  const args = message.content.slice(commandPrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const commands = {
    gif: () => handleGif(message),
    ping: () => message.channel.send("Pong!"),
    echo: () => handleEcho(args, message),
    userinfo: () => handleUserinfo(message),
    meme: () => handleMeme(message),
    weather: () => handleWeather(args, message),
    help: () => handleHelp(message),
    joke: () => handleJoke(message),
    log: () => handleLog(message),
    greet: () => message.channel.send(`Hello ${message.author.username}!`),
    poll: () => handlePoll(args, message),
    play: () => handlePlay(args, message),
    // ... add more commands and features as needed
  };

  const commandFunction = commands[command];
  if (commandFunction) {
    commandFunction();
  }
});

// Command Handlers
async function handleGif(message) {
  try {
    const response = await axios.get(`http://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}`);
    const gifUrl = response.data.data.images.original.url;
    await message.channel.send({ files: [gifUrl] });
  } catch (error) {
    console.error("Error fetching GIF:", error);
    await message.channel.send("Failed to retrieve a GIF.");
  }
}

function handleEcho(args, message) {
  const echoMessage = args.join(" ");
  if (!echoMessage) {
    message.channel.send("Please provide a message to echo.");
  } else {
    message.channel.send(echoMessage);
  }
}

function handleUserinfo(message) {
  message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}

async function handleMeme(message) {
  try {
    const response = await axios.get(process.env.MEME_API_URL);
    const memes = response.data.data.memes;
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    await message.channel.send({ files: [randomMeme.url] });
  } catch (error) {
    console.error("Error fetching meme:", error);
    await message.channel.send("Failed to retrieve a meme.");
  }
}

async function handleWeather(args, message) {
  if (args.length === 0) {
    message.channel.send("Please provide a city name. e.g., !weather London");
  } else {
    const city = args.join(" ");
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
      const weatherData = response.data;
      await message.channel.send(`Weather in ${city}: ${weatherData.main.temp}°C, ${weatherData.weather[0].description}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      await message.channel.send(`Could not retrieve weather for ${city}.`);
    }
  }
}

function handleHelp(message) {
  const helpMessage = `
  **Available commands:**
  - \`!gif\`: Get a random GIF
  - \`!ping\`: Get a Pong response
  - \`!echo [message]\`: Echoes the message
  - \`!userinfo\`: Get your user information
  - \`!meme\`: Get a random meme
  - \`!weather [city]\`: Get weather information for a city
  - \`!greet\`: Personalized greeting
  - \`!joke\`: Get a random joke
  - \`!help\`: Display this help message
  - \`!log\`: Display this log message
  - \`!poll [question] / [option1] / [option2] / ...\`: Create a poll with given options
  - \`!play [song name or URL]\`: Play music in a voice channel
  `;
  message.channel.send(helpMessage);
}



function handleJoke(message) {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  message.channel.send(jokes[randomIndex]);
}

function handleLog(message) {
  console.log(`Command used by ${message.author.username}: ${message.content}`);
  message.channel.send('Your command usage has been logged.');
}

async function handlePoll(args, message) {
  // The args are expected to be in the format: question / option1 / option2 / ...
  if (args.length < 2) {
    await message.channel.send("You need at least two options to create a poll.");
    return;
  }

  const [question, ...options] = args.join(' ').split(' / ');
  if (options.length < 2) {
    await message.channel.send("You need at least two options to create a poll.");
    return;
  }

  let pollMessageContent = `**${question}**\n`;
  const pollReactions = ['🇦', '🇧', '🇨', '🇩', '🇪']; // Define more reactions for more options

  options.forEach((option, index) => {
    if (index < pollReactions.length) {
      pollMessageContent += `${pollReactions[index]} ${option}\n`;
    }
  });

  const pollMessage = await message.channel.send(pollMessageContent);
  for (let i = 0; i < options.length && i < pollReactions.length; i++) {
    await pollMessage.react(pollReactions[i]);
  }

  // Add logic to handle the collection of reactions and tally votes as needed
}

// Utility to get an emoji by index. 
function getReactionEmoji(index) {
  const emojis = ['🅰️', '🅱️', '🇨', '🇩', '🇪']; // emojis
  return emojis[index];
}

async function handlePlay(args, message) {
  if (!args.length) {
    await message.channel.send("Please provide a YouTube URL to play.");
    return;
  }

  // Check if the URL is a valid YouTube URL
  const songUrl = args.join(' ');
  if (!ytdl.validateURL(songUrl)) {
    await message.channel.send("Please provide a valid YouTube URL.");
    return;
  }

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    await message.channel.send("You need to be in a voice channel to play music!");
    return;
  }

  try {
    const songInfo = await ytdl.getInfo(songUrl);
    const stream = ytdl.downloadFromInfo(songInfo, { filter: 'audioonly' });

    // Handle streaming errors
    stream.on('error', error => {
      console.error(`Stream Error: ${error.message}`);
      message.channel.send('An error occurred while streaming the track.');
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream, { metadata: { title: songInfo.videoDetails.title } });

    player.play(resource);
    connection.subscribe(player);

    player.on('error', error => {
      console.error(`Error: ${error.message} with resource ${resource.metadata.title}`);
      message.channel.send('An error occurred while playing the track.');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy(); // Disconnects from the voice channel
      message.channel.send("Playback has finished.");
    });

    await message.channel.send(`Now playing: ${resource.metadata.title}`);
  } catch (error) {
    console.error("Error playing the song:", error);
    await message.channel.send("There was an error playing the song.");
  }
}


client.login(process.env.DISCORD_TOKEN);

