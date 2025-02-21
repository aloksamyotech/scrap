import puppeteer from "puppeteer";
import {
  findOtpNumber,
  generateNewURL,
  getRawData,
  postProductData,
} from "../helper/helper.js";
import { Auth } from "../helper/model.js";
import { extractImageUrls } from "../helper/test.js";
import { response } from "express";
export async function scrapeInstacart(searchURL) {
  console.log(`🚀 Launching Puppeteer to scrape: ${searchURL}`);

  const browser = await puppeteer.launch({
    headless: false,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    console.log("🌍 Navigating to page...");
    await page.goto(searchURL, { waitUntil: "networkidle2" });
    console.log("✅ Page loaded successfully, waiting for 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // **Find and fill the email input field**
    const emailInputSelector = 'input[type="email"], input[name="email"]';
    await page.waitForSelector(emailInputSelector, {
      visible: true,
      timeout: 10000,
    });
    console.log("✅ Email input field found. Entering email...");
    await page.type(emailInputSelector, "royalfreshhoney01@gmail.com", {
      delay: 100,
    });
    console.log("✅ Email entered successfully!");

    // **Find and click the "Continue" button**
    const continueButtonSelector = "button.e-wy1wd6";
    await page.waitForSelector(continueButtonSelector, {
      visible: true,
      timeout: 500,
    });

    console.log("✅ 'Continue' button found. Clicking it...");
    await page.click(continueButtonSelector);
    console.log("✅ Clicked 'Continue' button successfully!");

    // **Wait for OTP input field**
    // const otpInputSelector = 'input[name="code"], input.e-1bgzfaj'; // Using name & class
    // await page.waitForSelector(otpInputSelector);

    // // **Retrieve OTP**
    // let otp = await findOtpNumber();
    // await new Promise(resolve => setTimeout(resolve, 3000));
    // otp = String(otp); // Ensure OTP is a string
    // console.log("📩 Received OTP:", otp);
    // await page.type(otpInputSelector, otp, { delay: 100 });
    // console.log("✅ OTP entered successfully!");
    // await new Promise(resolve => setTimeout(resolve, 10000));
    await new Promise((resolve) => setTimeout(resolve, 100000));
    var num = 50;

    while (true) {
      // const page = await browser.newPage();
      // await page.setViewport({ width: 1280, height: 800 });
      console.log("hiii");
      const values = await getRawData(num);
      console.log("values========>>>>>>>>>>>>>>>>", values);
      let results = [];

      for (const searchItem of values) {
        let screpUrl = generateNewURL(searchItem?.item_name_extended);
        console.log(`🌍 Navigating to: ${screpUrl}`);
        await page.goto(screpUrl);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.log(
          `🔍 Looking for product images inside div.e-ec1gba for "${searchItem}"`
        );
        const productDivs = await page.evaluate(() => {
          let productContainers = document.querySelectorAll("div.e-ec1gba");
          return Array.from(productContainers).map((div) => div.outerHTML);
        });
        const imageUrls = extractImageUrls(productDivs);
        results.push({
          _id: searchItem?._id,
          image_urls: imageUrls.slice(0, 2),
          isralavent: false,
        });

        console.log("results========>>>", results);
      }
      num++;

      const respnse = await postProductData(results);
      console.log("response==========>>>>", respnse);
      // results.map(async (item) => {
      //     console.log("item===========>>>>", item)
      //     await postProductData(item)
      // })
      // await browser.close();
    }

    // (async () => {
    //     while (true) {
    //         let browser;
    //         try {
    //             browser = await puppeteer.launch({ headless: false }); // Start fresh browser instance
    //             const page = await browser.newPage();
    //             await page.setViewport({ width: 1280, height: 800 });

    //             const values = await getRawData();
    //             console.log("values========>>>>>>>>>>>>>>>>", values);
    //             let results = [];

    //             for (const searchItem of values) {
    //                 try {
    //                     let screpUrl = generateNewURL(searchItem?.item_name_extended);
    //                     console.log(`🌍 Navigating to: ${screpUrl}`);
    //                     await page.goto(screpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    //                     await new Promise(resolve => setTimeout(resolve, 5000)); // Reduce wait time

    //                     console.log(`🔍 Looking for product images inside div.e-ec1gba for "${searchItem}"`);
    //                     const productDivs = await page.evaluate(() => {
    //                         let productContainers = document.querySelectorAll('div.e-ec1gba');
    //                         return Array.from(productContainers).map(div => div.outerHTML);
    //                     });

    //                     const imageUrls = extractImageUrls(productDivs);
    //                     results.push({
    //                         _id: searchItem?._id,
    //                         image_urls: imageUrls.slice(0, 2),
    //                         isralavent: false
    //                     });

    //                     console.log("results========>>>", results);
    //                 } catch (pageError) {
    //                     console.error(`❌ Error processing ${searchItem?.item_name_extended}:`, pageError);
    //                 } finally {
    //                     await page.close(); // Always close page after processing
    //                 }
    //             }

    //             const response = await postProductData(results);
    //             console.log("response==========>>>>", response);
    //         } catch (error) {
    //             console.error("❌ Error during scraping:", error);
    //         } finally {
    //             if (browser) {
    //                 await browser.close(); // Ensure browser is closed even on failure
    //                 console.log("🔴 Closing Puppeteer...");
    //             }
    //         }

    //         console.log("⏳ Restarting scraping in 10 seconds...");
    //         await new Promise(resolve => setTimeout(resolve, 10000)); // Add delay before restarting
    //     }
    // })();
  } catch (error) {
    console.error("❌ Error during scraping:", error);
  } finally {
    console.log("🔴 Closing Puppeteer...");
    await Auth.updateOne({ otp: 0 });
    await browser.close();
  }
}

// import puppeteer from "puppeteer";
// import { findOtpNumber, generateNewURL, getRawData, postProductData } from "../helper/helper.js";
// import { Auth } from "../helper/model.js";
// import { extractImageUrls } from "../helper/test.js";
// import { response } from "express";
// export async function scrapeInstacart(searchURL) {
//     console.log(`🚀 Launching Puppeteer to scrape: ${searchURL}`);

//     const browser = await puppeteer.launch({
//         headless: false,
//     });

//     try {
//         const page = await browser.newPage();
//         await page.setViewport({ width: 1280, height: 800 });
//         while (true) {
//             const values = await getRawData()
//             console.log("values========>>>>>>>>>>>>>>>>", values)
//             let results = []

//             for (const searchItem of values) {
//                 let screpUrl = generateNewURL(searchItem?.item_name_extended);
//                 console.log(`🌍 Navigating to: ${screpUrl}`);
//                 await page.goto(screpUrl);
//                 await new Promise(resolve => setTimeout(resolve, 10000));
//                 console.log(`🔍 Looking for product images inside div.e-ec1gba for "${searchItem}"`);
//                 const productDivs = await page.evaluate(() => {
//                     let productContainers = document.querySelectorAll('div.e-ec1gba');
//                     return Array.from(productContainers).map(div => div.outerHTML);
//                 });
//                 const imageUrls = extractImageUrls(productDivs)
//                 results.push({
//                     _id: searchItem?._id,
//                     image_urls: imageUrls.slice(0, 2),
//                     isralavent: false
//                 })
//                 console.log("results========>>>", results)
//             }

//             let result = results.filter((product) => product.image_urls?.length > 0)
//             if (result.length > 0) {
//                 const respnse = await postProductData(result)
//                 console.log("response==========>>>>", respnse)
//             }

//         }
//     } catch (error) {
//         console.error("❌ Error during scraping:", error);
//     } finally {
//         console.log("🔴 Closing Puppeteer...");
//         await Auth.updateOne({ otp: 0 })
//         await browser.close();
//     }
// }
