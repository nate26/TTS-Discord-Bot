import { Message } from "discord.js";

export interface BotCommand {
    command: string;
	action: (message: Message) => void;
    description?: string;
}