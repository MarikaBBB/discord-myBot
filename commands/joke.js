const { SlashCommandBuilder } = require('@discordjs/builders');

const jokes = [
  'Why don\'t scientists trust atoms? Because they make up everything.',
  'I told my wife she should embrace her mistakes. She gave me a hug.',
  'Parallel lines have so much in common. It\'s a shame they\'ll never meet.'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells you a random joke'),
  async execute(interaction) {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    await interaction.reply(jokes[randomIndex]);
  },
};



// OLD CODE
// function handleJoke(message) {
//   const randomIndex = Math.floor(Math.random() * jokes.length);
//   message.channel.send(jokes[randomIndex]);
// }
