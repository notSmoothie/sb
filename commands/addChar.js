const { SlashCommandBuilder } = require("@discordjs/builders");
const { optionBase } = require("../helpers/commands");

const charDesc = "the name of your character";
const optionKeys = {
	c: "character",
	uid: "userId",
};
const maxChars = 5;

const data = new SlashCommandBuilder()
	.setName("addchar")
	.setDescription("Adds WOW character into a database of your characters")
	.addStringOption((o) => optionBase(o, optionKeys.c, charDesc));

for (let i = 2; i <= maxChars; i++) {
	data.addStringOption((o) =>
		optionBase(o, `${optionKeys.c}${i}`, charDesc, false)
	);
}

data.addUserOption((o) =>
	optionBase(o, optionKeys.uid, "the user you want to add character to", false)
);

/**
 *
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function execute(interaction) {
	if (
		!interaction.options.getUser(optionKeys.uid) &&
		interaction.user.id !== "319128664291672085"
	) {
		await interaction.reply({
			content: "NONO",
			ephemeral: true,
		});
		return;
	}
	if (!interaction.options.getString(optionKeys.c)) {
		await interaction.reply({
			content: "Gib char",
			ephemeral: true,
		});
		return;
	}

	//#region setup vars
	const options = interaction.options;
	const user = (options.getUser("userid") ?? interaction.user).id;
	//#endregion

	//we will query async resources later, defer reply
	await interaction.deferReply({
		ephemeral: true,
	});

	let addBed = {
		title: "ADD Character",
		description: `Your character add query returned :`,
		color: 7419530,
		timestamp: Date.now(),
		footer: {
			icon_url: "https://i.ibb.co/vs7BpgP/ss.png",
			text: "powered by SMObot",
		},
		author: {
			name: "ID Manager",
			icon_url: "https://i.ibb.co/vs7BpgP/ss.png",
		},
		fields: [],
	};

	await addCharacter(
		options.getString(optionKeys.c).toLowerCase(),
		user,
		addBed
	);

	for (let i = 2; i <= maxChars; i++) {
		if (options.getString(`${optionKeys.c}${i}`)) {
			await addCharacter(
				options.getString(`${optionKeys.c}${i}`).toLowerCase(),
				user,
				addBed
			);
		}
	}

	await interaction.editReply({
		embeds: [addBed],
		ephemeral: true,
	});
}
async function addCharacter(char, uid, addBed) {}
module.exports = { data, execute };
