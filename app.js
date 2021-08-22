require('module-alias/register')

const Discord = require('discord.js');
//const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] }); 
const intents = new Discord.Intents(32767);
const bot = new Discord.Client({
  intents
});
bot.commands = new Discord.Collection();
bot.slashCommands = new Discord.Collection();
const fs = require('fs');

//Functions
const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));

//Events
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

//This is for holding all the command folders that hold several commands within them
const commandFolders = fs.readdirSync('./commands');

//Get tokens
require('dotenv').config();
var token = process.env.TOKEN;

// Bot Settings - Global settings this file can use.
const prefix = '!';

//Distube for playing music
const DisTube = require('distube');

// Create a new DisTube
bot.distube = new DisTube(bot, {
  searchSongs: true,
  emitNewSongOnly: true
});

/*
bot.distube
  .on("playSong", (message, queue, song) => message.channel.send(
    `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
  ))
  .on("addSong", (message, queue, song) => message.channel.send(
    `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
  ))
  .on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
  })
  // DisTubeOptions.searchSongs = true
  .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
*/

(async () => {

  for (file of functions) {
    require(`./functions/${file}`)(bot)
  }
  
  bot.handleEvents(eventFiles, "./events");
  bot.handleCommands(commandFolders, "./commands");
  bot.login(token);
})();

//Listner Event: Runs whenever a message is received.
bot.on("messageCreate", message => {

      //evaluateMessage(message);

      //Variables
      let msg = message.content.toUpperCase(); //Variable takes message and turns it into upper case.
      let sender = message.author; //Takes message and finds out who author is.
      //let channelID = client.channels.get("the channel id");
      let args = message.content.slice(prefix.length).trim().split(" "); //This variable slices off the prefix, then puts the rest into an array by spaces
      let cmd1 = args.shift().toLowerCase(); //This takes away the first object in the cont array, then puts it in this
      let cmd2 = cmd1.concat(".js"); //add js to command reciece for comparison later 

      //Global Variables
      //let cont = message.content.slice(prefix.length).split(" ");
      //let args1 = cont.slice(1);

      //We also need to make sure it doesnt respond to bots
      if (sender.bot) return;

      if (!message.content.startsWith(prefix)) return; //We also want to make sure that the message does not start with a prefix

      //Command Handler
      try {

        //loop to run through all the folders
        for (const folder of commandFolders) {

          //Find each file when going through the folder
          const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

          //loop through each file in the folders
          for (const file of commandFiles) {

            //require the folder and file to run the command
            const command = require(`@root/commands/${folder}/${file}`);

            //if the command in chat matches the file name run it
            if (cmd2 == file) {

              //run the command
              command.execute(bot, message, args);
              break;
            }
          }

        }
      } catch (e) { //If an error occurs, this will run
        console.log(e.message); //logs error message
      } finally { //This will run after the first two clear up
        console.log(`${message.author.username} ran the command: ${cmd1}`);
      }

});