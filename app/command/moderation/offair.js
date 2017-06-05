let app       = require('../../../index.js');
let discord   = require('discord.js-commando');
let logger    = app.logger;
let client    = app.client;
let recording = app.services.recording;

module.exports = class OffAirCommand extends discord.Command {
	constructor(client) {
		super(client, {
			name: 'offair',
			aliases: ['offair'],
			group: 'moderation',
			memberName: 'offair',
			description: 'Beendet eine laufende Sendung',
			throttling: {
				usages: 3,
				duration: 60
			}
		});
	}

	hasPermission(msg) {
		var response = false;

		let commandGroupRoles = app.config.discord.commandGroupRoles.find((role) => {
			return role.group === this.groupID;
		});

		commandGroupRoles.roles.forEach((role) => {
			if (msg.member._roles.includes(role)) {
				response = true;
			}
		});

		return response;
	}

	async run(msg, args) {
		recording.stop()
			.then(function(response) {
				logger.info('Sendung beendet von: ' + msg.author.username);
				return msg.reply('Alles klar, die Sendung ist vorbei');
			})
			.catch(function (error) {
				logger.error(error);
				return msg.reply('Tut mir leid, ich konnte die Sendung nicht beenden');
			});
	}
};
