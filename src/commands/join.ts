import { Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";
import { VoiceController } from '../voice/voice-controller';

export class JoinCommand implements BotCommand {
    command = '.join';
	action = async (message: Message) => {
		const channel = message.member?.voice.channel;
		if (channel) {
			this.voiceController.connectToChannel(channel);
		} else {
			message.reply('Join a voice channel then try again!');
		}
	}
    description = '';

    constructor(private voiceController: VoiceController) {}
}