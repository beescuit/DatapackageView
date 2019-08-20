const fs = require('fs')
const util = require('util')
const parse = require('csv-parse')

async function getChannels () {
  const index = require('./package/messages/index.json')
  const channels = Object.keys(index).map(async channel => {
    const info = require(`./package/messages/${channel}/channel.json`)
    const csv = fs.readFileSync(`./package/messages/${channel}/messages.csv`, 'utf8')
    const messages = await util.promisify(parse)(csv, { columns: true })
    return {
      type: info.type,
      id: info.id,
      name: index[channel],
      messages
    }
  })
  return Promise.all(channels)
}

function getUser () {
  const user = require('./package/account/user')
  return user
}

async function start () {
  const channels = await getChannels()
  const guildchannels = channels.filter(channel => channel.type === 0)
  const dmchannels = channels.filter(channel => channel.type === 1)
  const dmgroupchannels = channels.filter(channel => channel.type === 3)
  const channelmsgs = channels.map(channel => channel.messages).flat(1)
  const guildchannelmsgs = guildchannels.map(channel => channel.messages).flat(1)
  const dmchannelmsgs = dmchannels.map(channel => channel.messages).flat(1)
  const dmgroupchannelmsgs = dmgroupchannels.map(channel => channel.messages).flat(1)
  const account = getUser()
  console.log('Dados de 29/01/2019')
  console.log(`ID: ${account.id}`)
  console.log(`Usuario: ${account.username}#${account.discriminator}`)
  console.log(`Email: ${account.email} (${account.verified ? 'verificado' : 'não verificado'})`)
  console.log(`Amigos: ${account.relationships.length}`)
  console.log(`Linguagem: ${account.settings.locale}`)
  console.log(`Guilds: ${account.settings.guild_positions.length}`)
  console.log(`Tema: ${account.settings.theme}`)
  console.log(`Jogos na biblioteca: ${account.entitlements.length}`)
  console.log(`IP: ${account.ip}`)
  console.log(`Contas conectadas: ${account.connections.length}`)
  console.log(`Total de mensagens enviadas no discord: ${channelmsgs.length}`)
  console.log(`Total de chats: ${channels.length}`)
  console.log(`Total de chats de DM: ${dmchannels.length} (${dmchannelmsgs.length} mensagens)`)
  console.log(`Total de grupos de DM: ${dmgroupchannels.length} (${dmgroupchannelmsgs.length} mensagens)`)
  console.log(`Total de chats de guild: ${guildchannels.length} (${guildchannelmsgs.length} mensagens)`)
}

start()
