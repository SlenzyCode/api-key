const express = require("express");
const fs = require("fs");
const { Client, Partials, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent
    ],
    shards: "auto",
    partials: [
        Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction,
        Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember
    ]
});
require("dotenv").config();

app.get("/:api", (req, res) => {
    const key = req.params.api;

    fs.readFile("key.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ code: 500 });
            return;
        }

        try {
            const keyData = JSON.parse(data);
            const keyExists = keyData.hasOwnProperty(key);

            if (keyExists) {
                res.json({ merhaba: "hello" });
            } else {
                res.status(403).json({ code: 403, api: "Api key almak için discord'umuza geliniz." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ code: 500 });
        }
    });
});

client.on("messageCreate", (message) => {
    if (message.content === '!create-key') {
        const key = randomKey();

        fs.readFile("key.json", "utf8", (err, data) => {
            let keyData = {};

            if (!err) {
                keyData = JSON.parse(data);
            }

            keyData[key] = " ";

            fs.writeFile("key.json", JSON.stringify(keyData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({ name: 'Key Oluşturma', iconURL: message.author.displayAvatarURL() })
                        .setDescription(`> Dostum anahtarını oluşturdum aşağıda api keyini verdim.`)
                        .addFields([
                            { name: "🔑 Api Key", value: `**${key}**`, inline: true }
                        ])
                    message.reply({ embeds: [embed] });
                }
            });
        });
    }
});

function randomKey() {
    const uuid = require("uuid");
    return uuid.v4();
}

app.listen(process.env.PORT);
client.login(process.env.TOKEN);