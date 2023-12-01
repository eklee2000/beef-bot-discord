const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer')
const champNamesJson = require('../../champNames.json')

const baseURL = "https://u.gg/lol/champions/"
const BUILD = "/build/"
const numCounters = 5
const errorText = "Check the spelling of this champion: "
const CHAMPION_NAME_INDEX = 0
const CHAMPION_WINRATE_INDEX = 1
const FIRST_CHAR = 1

const championSpellings = new Map()
championSpellings.set("jarvan", "jarvaniv")
championSpellings.set("rek'sai", "reksai")
championSpellings.set("aurelion sol", "aurelionsol")
championSpellings.set("dr.mundo", "drmundo")
championSpellings.set("dr. mundo", "drmundo")
championSpellings.set("k'sante", "ksante")
championSpellings.set("kai'sa", "kaisa")
championSpellings.set("kogmaw", "kogmaw")
championSpellings.set("kha'zix", "khazix")
championSpellings.set("k'sante", "ksante")
championSpellings.set("lee sin", "leesin")
championSpellings.set("master yi", "masteryi")
championSpellings.set("miss fortune", "missfortune")
championSpellings.set("renataglasc", "renata")
championSpellings.set("tahm kench", "tahmkench")
championSpellings.set("twisted fate", "twistedfate")
championSpellings.set("vel'koz", "velkoz")
championSpellings.set("bel'veth", "belveth")
championSpellings.set("cho'gath", "chogath")
championSpellings.set("xin zhao", "xinzhao")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counter')
        .setDescription('Return list of counter picks for a given champion')
        .addStringOption( option =>
            option.setName('champion')
                .setDescription('The champion you want counters for')
                .setRequired(true)
        )
        .addStringOption( option => 
            option.setName('role')
                .setDescription('The role for the champion you want counters for')
                .setRequired(false)
                .addChoices(
                    { name: "Support", value: "support"},
                    { name: "ADC", value: "adc"},
                    { name: "Mid", value: "mid"},
                    { name: "Jungle", value: "jungle"},
                    { name: "Top", value: "top"},
                )
        ),
    async execute(interaction) {
        const champ = interaction.options.getString('champion').toLowerCase()
        let role = interaction.options.getString('role')
        if (role == null) {
            role = ""
        }
        await interaction.deferReply();
        getCounters(interaction, champ, role)
    },
};

const getCounters = async (interaction, champion, role = '') => {

    let champ = champion
    if (championSpellings.has(champion)) {
        champ = championSpellings.get(champion)
    }

    const browser = await puppeteer.launch();

    const url = `${baseURL}${champ}${BUILD}${role}`
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    const counters = await page.evaluate(() => {
        const counterList = []

        const matchups = document.querySelector("#toughest-matchups")
        if (matchups == null) {
            return `Check the spelling of this champion: `
        }

        const children = matchups.children
        for (let x = 0; x < children.length; x++) {
            champInfo = []
            champInfo.push(children[x].querySelector(".champion-name").textContent)
            champInfo.push(children[x].querySelector(".win-rate").firstChild.textContent)
            counterList.push(champInfo)
        }

        console.log(counterList.toString())
        return counterList
    })

    const selectedRole = await page.evaluate(() => {
        const SLASH_OFFSET = 1
        const hrefString = document.querySelector('.active.role-filter').getAttribute('href')
        role = hrefString.slice(hrefString.lastIndexOf('/') + SLASH_OFFSET)
        return role
    })

    browser.close()
    text = formatResultText(counters, champ, selectedRole)

    interaction.editReply(text)

}

function formatWinrate(stringPercentage) {
    winrate = (100.0 - (parseFloat(stringPercentage))).toString().concat("% winrate");
    return winrate;
}

function formatResultText(champArray, champion, role) {
    if (isChampArrayInvalid(champArray)) {
        return champArray.concat(champion)
    }
    role = formatSelectedRole(role)
    resultText = `Counters for ${champNamesJson[champion]} ${role}:\n`;
    for (let x = 0; x < numCounters; x++) {
        resultText = resultText.concat(champArray[x][CHAMPION_NAME_INDEX]);
        resultText = resultText.concat(", ");
        resultText = resultText.concat(formatWinrate(champArray[x][CHAMPION_WINRATE_INDEX]));
        resultText = resultText.concat("\n");
    }
    return resultText;
}

function isChampArrayInvalid(champArray) {
    return champArray.includes(errorText)
}

function formatSelectedRole(role) {
    if (role == 'adc') {
        return role.toUpperCase()
    } else {
        return role.charAt(0).toUpperCase().concat(role.slice(FIRST_CHAR))
    }
}