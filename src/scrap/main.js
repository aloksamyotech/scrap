import puppeteer from "puppeteer";
import { findOtpNumber, generateNewURL, getRandomWebsites, getRawData, postProductData } from "../helper/helper.js";
import { Auth } from "../helper/model.js";
import { extractImageUrls } from "../helper/test.js";
import { response } from "express";
export async function scrapeInstacart(searchURL) {
    console.log(`🚀 Launching Puppeteer to scrape: ${searchURL}`);

    try {
        // puppeteer.use(StealthPlugin());

        const browser = await puppeteer.launch({
            headless: false,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled"
            ]
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        // await page.setDefaultNavigationTimeout(60000); 

        // await page.goto(searchURL, { waitUntil: "networkidle2" });
        // console.log("✅ Page loaded successfully, waiting for 5 seconds...");
        // await new Promise(resolve => setTimeout(resolve, 5000));
        // // **Find and fill the email input field**
        // const emailInputSelector = 'input[type="email"], input[name="email"]';
        // await page.waitForSelector(emailInputSelector, { visible: true, timeout: 10000 });
        // console.log("✅ Email input field found. Entering email...");
        // await page.type(emailInputSelector, "royalfreshhoney01@gmail.com", { delay: 100 });
        // console.log("✅ Email entered successfully!");

        // // **Find and click the "Continue" button**
        // const continueButtonSelector = 'button.e-wy1wd6';
        // await page.waitForSelector(continueButtonSelector, { visible: true, timeout: 500 });

        // console.log("✅ 'Continue' button found. Clicking it...");
        // await page.click(continueButtonSelector);
        // console.log("✅ Clicked 'Continue' button successfully!");

        // await new Promise(resolve => setTimeout(resolve, 100000));

        
        const dummyScrap = async () => {
            const dummyPages = getRandomWebsites();
            for (const item of dummyPages) {
                try {
                    console.log(`🌍 Navigating to: ${item}`);
                    await page.goto(item, { waitUntil: "domcontentloaded", timeout: 60000 });
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } catch (error) {
                    console.warn(`⚠️ Warning: Skipping ${item} due to timeout.`);
                }
            }
        };

        const newScrap = async () => {
            const values = await getRawData()
            let results = []
            for (const searchItem of values) {
                let screpUrl = generateNewURL(searchItem?.item_name_extended);
                console.log(`🌍 Navigating to: ${screpUrl}`);
              // Disable cache before navigation
// await page.setCacheEnabled(false);

// // Clear cookies
// await page.deleteCookie(...(await page.cookies()));

// // Use DevTools Protocol to clear browser cache and cookies
// const client = await page.target().createCDPSession();
// await client.send("Network.clearBrowserCache");
// await client.send("Network.clearBrowserCookies");

// // Mock sessionStorage and localStorage to prevent security error
// await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(window, 'sessionStorage', {
//         get: () => ({
//             clear: () => console.log("SessionStorage cleared (mocked)"),
//         }),
//     });

//     Object.defineProperty(window, 'localStorage', {
//         get: () => ({
//             clear: () => console.log("LocalStorage cleared (mocked)"),
//         }),
//     });
// });
                // localStorage.clear()
                // sessionStorage.clear()
                await page.goto(screpUrl);
                await new Promise(resolve => setTimeout(resolve, 10000));
                console.log(`🔍 Looking for product images inside div.e-ec1gba for "${searchItem}"`);
                const productDivs = await page.evaluate(() => {
                    let productContainers = document.querySelectorAll('div.e-ec1gba');
                    return Array.from(productContainers).map(div => div.outerHTML);
                });
                const imageUrls = extractImageUrls(productDivs)
                results.push({
                    _id: searchItem?._id,
                    image_urls: imageUrls.slice(0, 2),
                    isralavent: false
                })
                console.log("results========>>>", results)
            }

            let result = results.filter((product) => product.image_urls?.length > 0)
            if (result.length > 0) {
                const respnse = await postProductData(result)
                console.log("response==========>>>>", respnse)
            }
        }

        while (true) {
            // await dummyScrap()
            await newScrap()
        }


    } catch (error) {
        console.error("❌ Error during scraping:", error);
    } finally {
        console.log("🔴 Closing Puppeteer...");
        await Auth.updateOne({ otp: 0 })
        // await browser.close();
    }
}

