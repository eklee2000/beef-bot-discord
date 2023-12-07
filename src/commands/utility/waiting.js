const { SlashCommandBuilder } = require("discord.js");
const path = require("node:path");

const resourcePath = path.join(__dirname, "../../resources/waiting.gif");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("waiting")
    .setDescription("waiting gif"),
  async execute(interaction) {
    await interaction.reply({ files: [resourcePath] });
  },
};
