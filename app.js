const { connected } = require('process');
const puppeteer = require('puppeteer');

async function getEbirdResults () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://ebird.org/alert/rba/CA-ON");
    let results = await page.evaluate(() => {
        let scrapedObservations = Array.from(document.querySelectorAll(".Observation"));
        let species = scrapedObservations.map(scrapedObservation => {
            let observation = {};
            observation.id = scrapedObservation.getAttribute("id");
            observation.speciesName = scrapedObservation
                .children[0]
                .children[0]
                .children[0]
                .children[0]
                .textContent;
            observation.speciesCode = scrapedObservation
                .children[0]
                .children[0]
                .children[0]
                .getAttribute("data-species-code");
            let numObserved = scrapedObservation
                .children[1]
                .children[0]
                .textContent;
            observation.numObserved = Number(numObserved.substring(numObserved.lastIndexOf(' ') + 1));
            let dateElement = scrapedObservation
                .children[3]
                .children[0]
                .children[0]
                .children[0]
                .children[1]
                .children[1]
            observation.date = dateElement.textContent;
            observation.link = "https://ebird.org" + dateElement.getAttribute("href");
            let locationElement = scrapedObservation
                .children[3]
                .children[0]
                .children[1]
                .children[0]
                .children[1]
                .children[1];
            observation.locationName = locationElement.textContent;
            observation.mapLink = locationElement.getAttribute("href");
            observation.observer = scrapedObservation
                .children[3]
                .children[0]
                .children[2]
                .children[0]
                .children[1]
                .children[1]
                .textContent;
            return observation;            
        })
        return species;
    });
    browser.close();
    return results;
}

getEbirdResults().then(content => {
    content.forEach(item => console.log(item));
    
});