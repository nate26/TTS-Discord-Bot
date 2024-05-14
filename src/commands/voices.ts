import { EmbedBuilder, Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class VoicesCommand implements BotCommand {
    command = '.voices';
    action = (message: Message) => {
        const voices: any[] = require("../configs/names.json");
        const embedBuilder = new EmbedBuilder()
            .setAuthor({ name: 'Giorgio', iconURL: 'https://i.imgur.com/HA1AeIa.jpg' })
            .setDescription('You have 30 seconds to choose...')
            .setColor(0x3FC400)
            .setTitle('Choose a Voice')
            .setTimestamp()
            .setFooter({ text: 'Provided by Streamlabs', iconURL: 'https://images-na.ssl-images-amazon.com/images/I/518oFeBYbRL.png' })
            .setFields(voices.map(voice => ({ name: voice.group, value: voice.names.join(', ') })))
        
        message.channel.send({ embeds: [embedBuilder] });
    }
    description = '';

    constructor() {}
}