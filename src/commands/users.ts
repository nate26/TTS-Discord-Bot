import { Client, Message, EmbedBuilder } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class UsersCommand implements BotCommand {
    command = '.users';
	action = async (message: Message) => {
        const parsedUsers = [];
        for (let [ id, voice ] of this.users.entries()) {
            const userName = await this.client.users.fetch(id);
            parsedUsers.push({ name: userName.username, value: voice });
        }
        const embedBuilder = new EmbedBuilder()
            .setAuthor({ name: 'Giorgio', iconURL: 'https://i.imgur.com/HA1AeIa.jpg' })
            .setColor(0x3FC400)
            .setTitle('Registered Users:')
            .setTimestamp()
            .setFields(parsedUsers)
        
        message.channel.send({ embeds: [embedBuilder] });
	}
    description = '';

    constructor(private users: Map<string, string>, private client: Client) {}
}