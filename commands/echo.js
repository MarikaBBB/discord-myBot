const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Replies with your input!')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to echo back')
        .setRequired(true)
        ),
  async execute(interaction) {
    const input = interaction.options.getString('input');
    await interaction.reply(input);
  },
};


//OLD CODE
// function handleEcho(args, message) {
//   const echoMessage = args.join(" ");
//   if (!echoMessage) {
//     message.channel.send("Please provide a message to echo.");
//   } else {
//     message.channel.send(echoMessage);
//   }
// }
