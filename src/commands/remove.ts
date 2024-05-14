import { Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class RemoveCommand implements BotCommand {
    command = '.remove';
	action = async (message: Message) => {
        const parsedId = message.content.replace('.remove', '').replace('<@', '').replace('>', '').trim();
        const id = parsedId.length > 0 ? parsedId : message.author.id;
        if (this.users.has(id)) {
            this.users.delete(id);
            message.reply('The user was removed!');
        }
        else {
            message.reply('This user is not registered or the input is invalid...');
        }
	}
    description = '';

    constructor(private users: Map<string, string>) {}
}