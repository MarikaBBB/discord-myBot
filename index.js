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
  ],
});

// Command prefix
const commandPrefix = "!";

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
    greet: () => message.channel.send(`Hello ${message.author.username}!`),
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


client.login(process.env.DISCORD_TOKEN);

