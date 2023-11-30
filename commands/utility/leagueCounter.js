const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer')

const baseURL = "https://u.gg/lol/champions/"
const BUILD = "/build/"
const numCounters = 5
const errorText = "Check the spelling of this champion: "

const championSpellings = new Map()
championSpellings.set("jarvan", "jarvaniv")
championSpellings.set("rek'sai", "reksai")
championSpellings.set("aurelion sol", "aurelionsol")
championSpellings.set("dr.mundo", "drmundo")
championSpellings.set("dr. mundo", "drmundo")
championSpellings.set("k'sante", "ksante")
championSpellings.set("kai'sa", "kaisa")
championSpellings.set("lee sin", "leesin")
championSpellings.set("master yi", "masteryi")
championSpellings.set("renataglasc", "renata")
championSpellings.set("tahm kench", "tahmkench")
championSpellings.set("vel'koz", "velkoz")

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
        const champ = interaction.options.getString('champion')
        let role = interaction.options.getString('role')
        if (role == null) {
            role = ""
        }
        getCounters(interaction, champ, role)
        // await interaction.reply(`${counters}`);
    },
};

const getCounters = async (interaction, champion, role = "") => {

    let champ = champion
    if (championSpellings.has(champion)) {
        champ = championSpellings.get(champion)
    }
    console.log(champ)
    const browser = await puppeteer.launch();

    const url = `${baseURL}${champ}${BUILD}${role}`
    const page = await browser.newPage();
    console.log(url)

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
            champInfo.push(children[x].querySelector(".champion-face").firstChild.src)
            champInfo.push(children[x].querySelector(".win-rate").firstChild.textContent)
            counterList.push(champInfo)
        }
        console.log(counterList.toString())
        return counterList
    })
    browser.close()
    console.log(counters)
    text = formatResultText(counters, champ, role)
    interaction.reply(text)

}

function formatWinrate(stringPercentage) {
    winrate = (100.0 - (parseFloat(stringPercentage))).toString().concat("% winrate");
    return winrate;
}

function formatResultText(champArray, champion, role) {
    if (isChampArrayInvalid) {
        return champArray.concat(champion)
    }
    resultText = `counters for ${champion} ${role}:\n`;
    for (let x = 0; x < numCounters; x++) {
        resultText = resultText.concat(champArray[x][0]);
        resultText = resultText.concat(", ");
        resultText = resultText.concat(formatWinrate(champArray[x][2]));
        resultText = resultText.concat("\n");
    }
    return resultText;
}

function isChampArrayInvalid(champArray) {
    return champArray.includes(errorText)
}