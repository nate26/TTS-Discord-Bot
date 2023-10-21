import { EmbedBuilder, Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class HelpCommand implements BotCommand {
    command = '.help';
	action = async (message: Message) => {
        const embedBuilder = new EmbedBuilder()
        .setTitle('Available Commands')
        .setAuthor({ name: 'Giorgio', iconURL: 'https://i.imgur.com/HA1AeIa.jpg' })
        .setColor(0x3FC400)
        .addFields([
            { name: '.join', value: 'Joins the vc of the current user' },
            { name: '.leave', value: 'Leaves the vc' }
        ])
        .setTimestamp();    
        message.channel.send({ embeds: [embedBuilder] });
	}
    description = '';

}