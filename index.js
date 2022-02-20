console.log("Beep beep! 🤖 Initializing bot..."); // When the file is run

const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
// Config
require("dotenv").config();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const guild = process.env.GUILD;
const tenorAPI = process.env.TENORAPI;

client.on("ready", () => {
	console.log(`Logged in as 🤖 "${client.user.tag}"!`); // When the bot is ready
});

client.on("messageCreate", async (message) => {
	// Ignore bot messages
	if (message.author.bot) return;
	// Ignore messages without prefix
	if (!message.content.startsWith(prefix)) return;
	// Ignore messages from other guilds
	if (!message.guildId == guild) return;

	// Get the command and args
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	let avatar = message.author.avatarURL({ format: "png", size: 2048 }); // The avatar of the user who sent the message

	if (command === "gif") {
		// Gif command
		let searchTerm = args.slice(0).join(" ");
		if (!searchTerm) {
			message.channel.send("Please provide a search term!");
			return;
		}
		// Get the gif from Tenor API
		let url = `https://g.tenor.com/v1/search?q=${searchTerm}&key=${tenorAPI}`; // &contentfilter=high for no NSFW
		let response = await fetch(url);
		let data = await response.json();
		let gif =
			data.results[Math.floor(Math.random() * data.results.length)]
				.media[0].gif.url;

		// Send an embed with the gif and the users avatar and name as the footer
		message.channel.send({
			embeds: [
				{
					title: `Tenor GIF Search for "${searchTerm}"`,
					color: 7254783,
					footer: {
						text: `Executed by ${message.author.username}`,
						icon_url: avatar,
					},
					image: {
						url: gif,
					},
				},
			],
		});
	}
});

client.login(token);
