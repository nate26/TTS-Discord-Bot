import { AudioPlayerStatus, PlayerSubscription, StreamType, VoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, entersState, joinVoiceChannel } from "@discordjs/voice";
import { Client, ThreadChannel, VoiceBasedChannel } from "discord.js";
import { createDiscordJSAdapter } from './adapter';

export class VoiceController {

    player = createAudioPlayer();
    voiceConnection!: VoiceConnection;
    
    voiceIsConnected() {
        return this.voiceConnection && this.voiceConnection.state.status == VoiceConnectionStatus.Ready;
    }
    
    async connectToChannel(channel: VoiceBasedChannel) {
        try {
            this.voiceConnection = await this.createChannelConnection(channel);
            this.voiceConnection.subscribe(this.player) as PlayerSubscription;
        } catch (error) {
            console.error(error);
        }
    }
    
    async createChannelConnection(channel: VoiceBasedChannel): Promise<VoiceConnection> {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: createDiscordJSAdapter(channel),
        });
    
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            return connection;
        } catch (error) {
            connection.destroy();
            throw error;
        }
    }
    
    async leaveChannel() {
        try {
            this.voiceConnection.disconnect();
            this.voiceConnection.destroy();
        } catch (error) {
            console.error(error);
        }
    }
    
    tts(voice: string, text: string) {
        if (!text.replace(' ', '').length) return;
        
        const resource = createAudioResource(`https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${text}`, {
            inputType: StreamType.Arbitrary,
        });
    
        this.player.play(resource);
    
        return entersState(this.player, AudioPlayerStatus.Playing, 5000);
    }
    
    formatTextForTTS(client: Client, text: string) {
        try {
            if (text.at(0) == '$') return '';
            
            let textArr = text.split(' ');
            for (let i = 0; i < textArr.length; i++) {
        
                // replaces user name id with proper text
                let unID = new RegExp('(?<=<@).*(?=>)');
                const regUNRun = unID.exec(textArr[i]!);
                const regUNText = regUNRun ? regUNRun[0] + '' : '';
                if (regUNText) {
                    let idUNText = client.users.cache.get(regUNText)!.username;
                    textArr[i] = textArr[i]!.replace('<@' + regUNText + '>', idUNText);
                }
        
                // replaces text chat id with proper text
                let txID = new RegExp('(?<=<#).*(?=>)');
                const regTXRun = txID.exec(textArr[i]!);
                const regTXText = regTXRun ? regTXRun[0] : '';
                if (regTXText) {
                    let idTXText = (client.channels.cache.get(regTXText) as ThreadChannel).name;
                    textArr[i] = textArr[i]!.replace('<#' + regTXText + '>', idTXText);
                }
        
                // replace urls
                if (textArr[i]!.includes('http') || textArr[i]!.includes('www.')) {
                    textArr[i] = '';
                }
        
            }
            text = textArr.join(' ');
        } catch (e) { console.log(e) }
    
        text = text.replace('🙂', ' smile ');
        text = text.replace(/[^\x00-\x7F]/g, '');
        text = text.replace(/[%#]/g, '');
        text = text.replace(/&/g, 'and');
        text = text.replace(/(<a?:)(.+?)(:[0-9]+>)/g, `$2`);
        return text;
    }

}