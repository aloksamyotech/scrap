import puppeteer from "puppeteer";
import {
  findOtpNumber,
  generateNewURL,
  getRandomWebsites,
  getRawData,
  postProductData,
} from "../helper/helper.js";
import { Auth } from "../helper/model.js";
import { extractImageUrls } from "../helper/test.js";
import { response } from "express";
export async function scrapeInstacart(searchURL) {
  console.log(`🚀 Launching Puppeteer to scrape: ${searchURL}`);
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    page.setDefaultNavigationTimeout(60000);
    const newScrap = async (num) => {
      const values = await getRawData(num);
      let results = [];
      var productDivs
      for (const searchItem of values) {
        var screpUrl = generateNewURL(searchItem?.item_name_extended);
        console.log("screpUrl", screpUrl)
        console.log(`🌍 Navigating to: ${screpUrl}`);
      
        while (screpUrl.split("+").length > 2) {
          console.log("imaurl===========>>>", screpUrl)
          productDivs = await findImageUrl(page, screpUrl, searchItem);
          if (productDivs.length) break
          console.log("productDivs:", productDivs);
          screpUrl = screpUrl.split("+").slice(0, -1).join("+");
        }
        const imageUrls = extractImageUrls(productDivs);
        results.push({
          _id: searchItem?._id,
          image_urls: imageUrls.slice(0, 2),
          isralavent: false,
        });
        console.log("results========>>>", results);
      }

      let result = results.filter((product) => product.image_urls?.length > 0);
      if (result.length > 0) {
        const respnse = await postProductData(result);
        console.log("response==========>>>>", respnse);
      }
    };
    let num = 3800;

    while (true) {
      // await dummyScrap()
      await newScrap(num);
      num++;
    }
  } catch (error) {
    console.error("❌ Error during scraping:", error);
  } finally {
    console.log("🔴 Closing Puppeteer...");
    await Auth.updateOne({ otp: 0 });

  }
}


  const findImageUrl = async (page, screpUrl, searchItem) => {
  await page.goto(screpUrl);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(
    `🔍 Looking for product images inside div.e-ec1gba for "${searchItem}"`
  );
  const productDivs = await page.evaluate(() => {
    let productContainers = document.querySelectorAll("div.e-ec1gba");
    return Array.from(productContainers).map((div) => div.outerHTML);
  });

  return productDivs

}
