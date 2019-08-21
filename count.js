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
  const channelmsgs = channels.flatMap(channel => channel.messages)
  const guildchannelmsgs = guildchannels.flatMap(channel => channel.messages)
  const dmchannelmsgs = dmchannels.flatMap(channel => channel.messages)
  const dmgroupchannelmsgs = dmgroupchannels.flatMap(channel => channel.messages)
  const account = getUser()
  console.log(`ID: ${account.id}`)
  console.log(`User: ${account.username}#${account.discriminator}`)
  console.log(`Email: ${account.email} (${account.verified ? 'verified' : 'not verified'})`)
  console.log(`Friend count: ${account.relationships.length}`)
  console.log(`Locale (language): ${account.settings.locale}`)
  console.log(`Guild count: ${account.settings.guild_positions.length}`)
  console.log(`Theme: ${account.settings.theme}`)
  console.log(`Games in library: ${account.entitlements.length}`)
  console.log(`IP: ${account.ip}`)
  console.log(`Connected accounts: ${account.connections.length}`)
  console.log(`Number of messages sent: ${channelmsgs.length}`)
  console.log(`Number of chats (any type): ${channels.length}`)
  console.log(`DM chats: ${dmchannels.length} (${dmchannelmsgs.length} messages)`)
  console.log(`DM groups: ${dmgroupchannels.length} (${dmgroupchannelmsgs.length} messages)`)
  console.log(`Guild chats: ${guildchannels.length} (${guildchannelmsgs.length} messages)`)
}

start()
