const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('Logs your message to the console')
    .addStringOption(option => option.setName('message').setDescription('The message to log').setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    console.log(`Log Command used by ${interaction.user.tag}: ${message}`);
    await interaction.reply('Your message has been logged to the console.');
  },
};



// OLD CODE
// function handleLog(message) {
//   console.log(`Command used by ${message.author.username}: ${message.content}`);
//   message.channel.send('Your command usage has been logged.');
// }
