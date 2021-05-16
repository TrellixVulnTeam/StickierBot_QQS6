const Discord = require('discord.js');
const fs = require('fs');
const economy = require('C:/Users/bigbo/OneDrive/Desktop/StickierBot-jordan/mongo-listeners/economy.js'); 

module.exports.run = async (bot, message, args) => {
   
   const {guild, member} = message

   const user = message.mentions.users.first() 

    if(!user)
    {
        message.reply("Please @ the user who's balance I am adding too. Usage !pay <user> <amount>")
        return
    }

    const coinsToGive = args[2]
    if(isNaN(coinsToGive)){
        message.reply('Please provide a number I can use thank you. Usage !pay <user> <amount>')
        return
    }

    const coinsOwned = await economy.getCoins(guild.id, member.id)
    if(coinsOwned < coinsToGive)
    {
        message.reply(`You do not have ${coinsToGive} coins!`)
        return
    }

    const remainingCoins = await economy.addCoins(
        guild.id,
        member.id,
        coinsToGive * -1
    )

    const newBalance = await economy.addCoins(
        guild.id,
        user.id,
        coinsToGive
    )

    message.reply(`You have given <@${user.id}> ${coinsToGive} coins! They now have ${newBalance} coins and you have ${remainingCoins} coins!`)
}