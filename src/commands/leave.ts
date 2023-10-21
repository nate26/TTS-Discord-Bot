import { Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";
import { VoiceController } from '../voice/voice-controller';

export class LeaveCommand implements BotCommand {
    command = '.leave';
	action = async (_message: Message) => this.voiceController.leaveChannel();
    description = '';

    constructor(private voiceController: VoiceController) {}
}