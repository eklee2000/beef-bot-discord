const { SlashCommandBuilder } = require('discord.js');
const {DateTime} = require ('luxon');
const PACIFIC = 'America/Los_Angeles'
const CENTRAL = 'America/Chicago'
const EASTERN = 'America/New_York'
const PST = 'PST'
const CST = 'CST'
const EST = 'EST'
const AM = 'AM'
const PM = 'PM'
const AMONG_US_ROLE = '754917499715452989'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flex')
        .setDescription('Suggest a time for Ranked Flex')
        .addStringOption(option =>
            option.setName('am-pm')
                .setDescription('AM or PM')
                .setRequired(true)
                .addChoices(
                    { name: "PM", value: PM },
                    { name: "AM", value: AM }
                )
        )
        .addStringOption(option =>
            option.setName('time')
                .setDescription('What time do you want to flex (FORMAT -> HH:MM)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('What is your timezone')
                .setRequired(true)
                .addChoices(
                    { name: "Pacific", value: PACIFIC },
                    { name: "Central", value: CENTRAL },
                    { name: "Eastern", value: EASTERN }
                )
        ),
    async execute(interaction) {
        let time = interaction.options.getString('time')
        if (!time.includes(":")) {
          time = time.concat(":00") 
        }
        if (!isTimeInputValid(time)) {
            await interaction.reply({content: `You entered an invalid time: ${time}. It should be in a format like 12:30 or 8:00.`, ephemeral: true})
            return
        }
        const amOrPm = interaction.options.getString('am-pm')
        let timezone = interaction.options.getString('timezone')
        let hour = parseInt(time.split(":")[0])
        let minutes = parseInt(time.split(":")[1])
        hour = updateHour(hour, amOrPm)
        let dt = DateTime.fromObject({ hour: hour, minute: minutes }, { zone: timezone })
        let flexTime = []
        flexTime = formatFlexTimesArray(dt)
        // await interaction.reply({content: `<@${interaction.member.id}> suggested this time for flex: ${flexTime[0]}, ${flexTime[1]}, ${flexTime[2]}`, ephemeral: true})

        await interaction.reply(`<@${interaction.member.id}> suggested this time for flex: ${flexTime[0]}, ${flexTime[1]}, ${flexTime[2]} <@&${AMONG_US_ROLE}>`)
    },
};

function formatFlexTimesArray(dt) {
    let flexTimes = []
    flexTimes.push(formatTimezoneChange(dt, PACIFIC, PST))
    flexTimes.push(formatTimezoneChange(dt, CENTRAL, CST))
    flexTimes.push(formatTimezoneChange(dt, EASTERN, EST))
    return flexTimes
}

function formatTimezoneChange(dt, timezone, timeZoneString) {
    let time = dt.setZone(timezone)
    let flexTime = time.toLocaleString(DateTime.DATETIME_MED)
    console.log(flexTime)
    return flexTime.split(", ")[2].concat(` ${timeZoneString}`)
}

function updateHour(hour, amOrPm) {
    if (amOrPm == PM) {
        hour += 12
    }
    return hour
}

function isTimeInputValid(time) {
    let regex = new RegExp(/\d/)
    let hour = time.split(":")[0]
    let minute = time.split(":")[1]
    if (hour.length < 1 && hour.length > 2) {
        return false
    }
    console.log(regex.test(hour))
    if (!regex.test(hour)) {
        return false
    }
    if (minute.length != 2) {
        return false
    }
    if (!regex.test(minute)) {
        return false
    }
    return true
}
