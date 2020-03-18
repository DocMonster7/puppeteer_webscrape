const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async() => {
    try {
        // open the headless browser

        // enter url in page
        for (k = 97; k < 123; k++) {
            //convert the char code to string (Alphabets)
            var str = String.fromCharCode(k);
            //print the result in console

            if (k == 113 || k == 117 || k == 120 || k == 121 || k == 122) {
                continue
            }
            // if (k != 113 || k != 117 || k != 120 || k != 121 || k != 122) {
            console.log(str);
            var browser = await puppeteer.launch({
                headless: false
            });
            // open a new page
            var page = await browser.newPage();
            await page.goto(`https://www.dioceseofmangalore.com/index.php/diocesan-priests/` + str, {
                waitUntil: 'load',
                timeout: 0
            });

            await page.setViewport({
                width: 1200,
                height: 800
            });


            await page.waitForSelector("div.span12");

            var news = await page.evaluate(() => {
                var titleNodeList = document.querySelectorAll(`[itemprop=name] a`);

                var image = document.querySelectorAll("table.tab_special1")
                console.log(image.length)
                var titleLinkArray = [];
                for (var i = 0; i < titleNodeList.length; i++) {
                    // var feestruct = checkthedata(feescourse[i])
                    // console.log(feescourse[i])
                    titleLinkArray[i] = ({
                        name: titleNodeList[i].innerText.trim(),
                        profile_url: titleNodeList[i].href.trim(),
                        Table_details: image[i].innerHTML.trim(),
                        // course: course[i].innerText.trim(),

                    });
                }
                return titleLinkArray
            });
            // console.log(news);


            await browser.close();
            // Writing the news inside a json file
            fs.appendFile("priest.json", JSON.stringify(news), function(err) {
                if (err) throw err;
                console.log("Saved!");
            });
            console.log(success("Browser Closed"));
            // }
        }




    } catch (err) {
        // Catch and display errors
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"));
    }
})();

// function checkthedata(data) {
//     console.log(data)
//     return 1
// }