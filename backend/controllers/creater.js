import puppeteer from "puppeteer";

const url = "https://www.accenture.com/in-en/careers/jobsearch?jk=&vw=0&is_rj=0";

const main = async () => {
    const browser = await puppeteer.launch({ headless: false }); // Set headless to false for debugging
    const page = await browser.newPage();

    try {
        await page.goto(url, { timeout: 60000 });
        await page.waitForSelector(".jobTitle", { timeout: 60000 });

        const allTitles = new Set();

        const scrapeTitles = async () => {
            const titles = await page.evaluate(() => {
                const titleElements = Array.from(document.querySelectorAll(".jobTitle"));
                return titleElements
                    .map(title => title.innerText.trim()) 
                    .filter(titleText => titleText.includes("Intern")); 
            });
            titles.forEach(title => allTitles.add(title)); 
        };

        await scrapeTitles();

        // Loop to handle pagination
        let hasNextPage = true;
        while (hasNextPage) {
            const nextPageLink = await page.$(".pagination li.active + li a");

            if (nextPageLink) {
                // Check if the next page link has the class name 'paginationItemLast'
                const isLastPaginationItem = await page.evaluate((link) => {
                    return link.classList.contains('paginationItemLast');
                }, nextPageLink);

                if (isLastPaginationItem) {
                    hasNextPage = false; // Stop the loop before clicking the 'paginationItemLast' link
                } else {
                    await nextPageLink.click();
                    await page.waitForNavigation({ waitUntil: "networkidle2" }); // Wait for the page to load completely
                    await scrapeTitles(); // Scrape titles from the new page
                }
            } else {
                hasNextPage = false;
            }
        }

        // Convert the Set back to an array, trim extra spaces, and number items for console log
        const uniqueTitles = Array.from(allTitles).map((title, index) => `${index + 1}. ${title}`);
        console.log("Intern Job Titles:");
        uniqueTitles.forEach(title => console.log(title));
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.error('Navigation timeout exceeded');
        } else {
            console.error('Navigation error:', error);
        }
    } finally {
        await browser.close();
    }
};

main();
