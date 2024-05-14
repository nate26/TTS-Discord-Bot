import { Message, EmbedBuilder } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class UsersCommand implements BotCommand {
    command = '.users';
	action = async (message: Message) => {
        const embedBuilder = new EmbedBuilder()
            .setAuthor({ name: 'Giorgio', iconURL: 'https://i.imgur.com/HA1AeIa.jpg' })
            .setColor(0x3FC400)
            .setTitle('Registered Users:')
            .setTimestamp()
            .setFields(Array.from(this.users.entries()).map(([ id, voice ]) => ({ name: message.guild.cache.get(id).name, value: voice })))
        
        message.channel.send({ embeds: [embedBuilder] });
	}
    description = '';

    constructor(private users: Map<string, string>) {}
}