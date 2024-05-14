import { Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class RemoveCommand implements BotCommand {
    command = '.remove';
	action = async (message: Message) => {
        const id = message.content.replace('.users', '').trim() ?? message.author.id;
        if (this.users.has(id)) {
            this.users.delete(id);
        }
        else {
            message.reply('This user is not registered or the input is invalid...');
        }
	}
    description = '';

    constructor(private users: Map<string, string>) {}
}