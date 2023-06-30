import { REST } from "@discordjs/rest";
import { WebSocketManager } from "@discordjs/ws";
import {
  GatewayDispatchEvents,
  GatewayIntentBits,
  InteractionType,
  MessageFlags,
  Client,
  Routes,
} from "@discordjs/core";
import { SlashCommandBuilder } from "@discordjs/builders";

import * as env from "dotenv";

env.config();

const token = process.env.QFF_TOKEN;

// Create REST and WebSocket managers directly
const rest = new REST({ version: "10" }).setToken(token);

const gateway = new WebSocketManager({
  token,
  intents: GatewayIntentBits.MessageContent,
  rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

// Listen for interactions
// Each event contains an `api` prop along with the event data that allows you to interface with the Discord REST API

export const testCommand = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Test Command");

client.on(
  GatewayDispatchEvents.InteractionCreate,
  async ({ data: interaction, api }) => {
    if (
      interaction.type !== InteractionType.ApplicationCommand ||
      interaction.data.name === "test"
    ) {
      await api.interactions.reply(interaction.id, interaction.token, {
        content: "QFF!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
);

async function main() {
  const commands = [testCommand];
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        "1124227420816425004",
        "1124227230764113940"
      ),
      {
        body: commands,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

main();

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, () => console.log("Ready!"));

// Start the WebSocket connection.
gateway.connect();
