import { Message } from "discord.js";
import { BotCommand } from "../interfaces/command.interface";

export class SetupCommand implements BotCommand {
    command = '.setup';
    action = (message: Message) => {
        const voices: any[] = require("../configs/names.json");
        const voiceName = message.content.replace('.setup', '').trim().toLowerCase();
        for (let voice of voices) {
            const nameIdx = voice.names.map((n: string) => n.toLowerCase()).indexOf(voiceName);
            if (nameIdx >= 0) {
                const name = voice.names[nameIdx];
                this.users.set(message.author.id, name);
                message.reply('Your new voice is ' + name + ' :)');
                return;
            }
        }
        message.reply('The voice you inputed is not valid... Please make sure you spelled it correctly :)');
    }
    description = '';

    constructor(private users: Map<string, string>) {}
}