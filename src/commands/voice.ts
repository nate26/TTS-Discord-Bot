import { Collection, EmbedBuilder, Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class VoiceCommand implements BotCommand {
    command = '.voice';
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
        
        message.channel.send({ embeds: [embedBuilder] }).then((mes: Message) => {
            mes.channel.awaitMessages({
                max: 1,
                time: 30000,
                errors: ['time']
            }).then((collection: Collection<string, Message<boolean>>) => {
                const message = collection.first()!;
                for (let voice of voices) {
                    const nameIdx = voice.names.map((n: string) => n.toLowerCase()).indexOf(message.content.toLowerCase());
                    if (nameIdx >= 0) {
                        const name = voice.names[nameIdx];
                        this.users.set(message.author.id, name);
                        message.reply('Your new voice is ' + name + ' :)');
                        return;
                    }
                }
                message.reply('The voice you inputed is not valid... Please make sure you spelled it correctly :)');
            }).catch(_collected => {
                message.channel.send('You took too long to respond... Please try again :)');
            });
        });
    }
    description = '';

    constructor(private users: Map<string, string>) {}
}