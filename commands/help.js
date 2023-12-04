const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands or info about a specific command"),
  async execute(interaction) {
    let helpMessage = "Available Commands:\n";
    interaction.client.commands.forEach((cmd) => {
      let commandUsage = `/${cmd.data.name}`;

      // check if the command has options and append them to commandUsage, for echo and weather 
      const options = cmd.data.options;
      if (options && options.length > 0) {
        commandUsage +=
          " " + options.map((option) => `[${option.name}]`).join(" ");
      }

      helpMessage += `${commandUsage}: ${cmd.data.description}\n`;
    });
    helpMessage +=
      "\nYou can also mention me in any channel or send me a direct message for assistance!";

    await interaction.reply(helpMessage);
  },
};


// OLD CODE

// function handleHelp(message) {
//   const helpMessage = `
//   **Available commands:**
//   - \`!gif\`: Get a random GIF
//   - \`!ping\`: Get a Pong response
//   - \`!echo [message]\`: Echoes the message
//   - \`!userinfo\`: Get your user information
//   - \`!meme\`: Get a random meme
//   - \`!weather [city]\`: Get weather information for a city
//   - \`!greet\`: Personalized greeting
//   - \`!joke\`: Get a random joke
//   - \`!help\`: Display this help message
//   - \`!log\`: Display this log message
//   - \`!poll [question] / [option1] / [option2] / ...\`: Create a poll with given options
//   - \`!play [song name or URL]\`: Play music in a voice channel
//   `;
//   message.channel.send(helpMessage);
// }