import { Client, GatewayIntentBits, ChannelType, Message, VoiceState, ActivityType  } from 'discord.js';
import { VoiceController } from './voice/voice-controller';
import { JoinCommand } from './commands/join';
import { LeaveCommand } from './commands/leave';
import { HelpCommand } from './commands/help';
import { VoicesCommand } from './commands/voices';
import { SetupCommand } from './commands/setup';
import { UsersCommand } from './commands/users';
import { RemoveCommand } from './commands/remove';

let { token, mikeID } = require('./configs/config.json');
// let { token } = require('./configs/config.json');
// let { mikeID } = require('./configs/config_testing.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	]
});

const voiceController = new VoiceController();

const users = new Map();
users.set(mikeID, 'Giorgio');

const registeredCommands = [
	new JoinCommand(voiceController),
	new LeaveCommand(voiceController),
	new HelpCommand(),
	new SetupCommand(users),
	new RemoveCommand(users),
	new UsersCommand(users, client),
	new VoicesCommand()
];


client.on('ready', async () => {
	let idx = false;
	client.user?.setActivity({
		name: 'TXT',
		url: 'https://www.youtube.com/watch?v=vuePKt5tJHw&ab_channel=ChillDays',
		type: ActivityType.Streaming
	});
	setInterval(() => {
		if (idx) {
			client.user?.setActivity({
				name: 'TXT',
				url: 'https://www.youtube.com/watch?v=vuePKt5tJHw&ab_channel=ChillDays',
				type: ActivityType.Streaming
			});
		} else {
			client.user?.setActivity({
				name: 'Seventeen',
				url: 'https://www.youtube.com/watch?v=bw6VKsFLJGE&ab_channel=KpopViral101',
				type: ActivityType.Streaming
			});
		}
		idx = !idx;
	}, 600000)
	console.log('Giorgio is ready :)');
});

client.on("messageCreate", async (message: Message) => {
	if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;
	
	// console.log(`Message from ${message.author.username}: ${message.content}`);

	for (let command of registeredCommands) {
		if (message.content == command.command || message.content.startsWith(command.command + ' ')) {
			command.action(message);
		}
	}

	if (!registeredCommands.filter(c => c.command == message.content).length && users.has(message.author.id) && voiceController.voiceIsConnected()) {
		voiceController.tts(users.get(message.author.id), voiceController.formatTextForTTS(client, message.content));
	}
});

client.on('voiceStateUpdate', async (_oldState: VoiceState, newState: VoiceState) => {
    if (newState.channel && newState.id === mikeID) {
		voiceController.connectToChannel(newState.channel);
    } else if (!newState.channel && newState.id === mikeID) {
        voiceController.leaveChannel();
    }
});

client.login(token);
