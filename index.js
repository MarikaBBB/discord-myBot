const fs = require('fs');
const path = require('path');
require("dotenv").config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, GatewayIntentBits } = require("discord.js");

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

client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

function logEvent(event, details) {
    console.log(`[${new Date().toISOString()}] [${event}]`, details);
}


client.on('interactionCreate', async interaction => {
  logEvent('Interaction', { type: interaction.type, name: interaction.commandName });

  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
      await command.execute(interaction);
      logEvent('Command Executed', { name: interaction.commandName });
  } catch (error) {
      console.error(error);
      let errorMessage = 'There was an error while executing this command!';
      // Custom error handling
      if (error.response && error.response.data) {
        errorMessage = `Discord API error: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      await interaction.reply({ 
        content: errorMessage, 
        ephemeral: true 
      });
      logEvent('Command Error', { name: interaction.commandName, error: error.message });
  }
});


// Handling 'messageCreate' event for mentions and DMs
client.on("messageCreate", async (message) => {
  logEvent('Message Received', { author: message.author.tag, content: message.content });
  if (message.author.bot) return;

  // Handling direct messages
  if (message.channel.type === "DM") {
    logEvent('Direct Message', { author: message.author.tag });
    handleDirectMessage(message);
    return;
  }

  // Handling mentions
  if (message.mentions.users.has(client.user.id)) {
    logEvent('Bot Mentioned', { author: message.author.tag });
    handleMentions(message);
    return;
  }
});

async function handleMentions(message) {
  console.log("Responding to a mention");
  message.channel.send("**Hello! How can I assist you today?**");

  const logEntry = {
    timestamp: new Date().toISOString(),
    author: message.author.tag,
    messageContent: message.content,
    channel: message.channel.name,
  };
  console.log("Mention Log:", logEntry);
}

async function handleDirectMessage(message) {
  try {
    console.log("Responding to DM");
    await message.author.send("Hello! How can I help you in DM?");
  } catch (error) {
    console.error("Error in handleDirectMessage:", error);
  }
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
  logEvent('Bot Ready', { botTag: client.user.tag });

  const commandsData = Array.from(client.commands.values()).map(c => c.data.toJSON());

  try {
    logEvent('Refreshing Commands', { status: 'Started' });
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commandsData,
    });
    logEvent('Refreshing Commands', { status: 'Successful' });
  } catch (error) {
    console.error(error);
    logEvent('Refreshing Commands', { status: 'Failed', error: error.message });
  }
});

client.login(process.env.DISCORD_TOKEN);

