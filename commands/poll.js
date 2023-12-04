const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll with up to 5 options')
        .addStringOption(option => option.setName('question').setDescription('The poll question').setRequired(true))
        .addStringOption(option => option.setName('option1').setDescription('First option').setRequired(true))
        .addStringOption(option => option.setName('option2').setDescription('Second option'))
        .addStringOption(option => option.setName('option3').setDescription('Third option'))
        .addStringOption(option => option.setName('option4').setDescription('Fourth option'))
        .addStringOption(option => option.setName('option5').setDescription('Fifth option')),

    async execute(interaction) {
        // Extracting options from the interaction
        const question = interaction.options.getString('question');
        const options = [];
        for (let i = 1; i <= 5; i++) {
            const option = interaction.options.getString(`option${i}`);
            if (option) options.push(option);
        }

        // Prevent duplicate options
        if (new Set(options).size !== options.length) {
            await interaction.reply({ content: 'Duplicate options are not allowed.', ephemeral: true });
            return;
        }

        // Constructing and sending the poll message
        const pollMessageContent = `**${question}**\n\n${options.map((o, i) => `${String.fromCharCode(65 + i)} - ${o}`).join('\n')}`;
        await interaction.deferReply();
        let pollMessage;
        try {
            pollMessage = await interaction.followUp({ content: pollMessageContent, fetchReply: true });

            // Adding reaction emojis to the poll message
            const reactionEmojis = ['🇦', '🇧', '🇨', '🇩', '🇪'].slice(0, options.length);
            for (const emoji of reactionEmojis) {
                await pollMessage.react(emoji);
            }
        } catch (error) {
            console.error("Error in poll command:", error);
            await interaction.followUp({ content: 'There was an error while executing the poll command.', ephemeral: true });
            return;
        }

        // Reaction collector for the poll
        const collector = pollMessage.createReactionCollector({
            filter: (reaction, user) => reactionEmojis.includes(reaction.emoji.name) && !user.bot,
            time: 60000 // 1 minute
        });

        const votes = new Array(options.length).fill(0);
        collector.on('collect', (reaction) => {
            const index = reactionEmojis.indexOf(reaction.emoji.name);
            if (index !== -1) votes[index]++;
        });

        // Displaying poll results
        collector.on('end', () => {
            const results = options.map((option, index) => `${option}: ${votes[index]} vote(s)`).join('\n');
            interaction.followUp(`**Poll Results for "${question}"**\n\n${results}`);
        });
    },
};
function logEvent(event, details) {
    console.log(`[${new Date().toISOString()}] [${event}]`, details);
}


