import axios from "axios";
import { findOtp } from "./otp.js";

export const findOtpNumber = async () => {
  let runner = true;
  let val = null;
  while (runner) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let otp = await findOtp();
    console.log("otp", otp.otp);
    if (otp.otp !== 0) {
      val = otp.otp;
      runner = false;
    }
  }
  if (!runner) {
    return val;
  }
};

export function generateNewURL(searchQuery) {
  const baseURL =
    "https://www.instacart.com/store/razco-foods-supermarket/s?k=Electrolit+Cucumber+Lime";
  const encodedQuery = encodeURIComponent(searchQuery).replace(/%20/g, "+");
  return baseURL.replace(/(\?k=)[^&]+/, `$1${encodedQuery}`);
}

export async function getRawData(num) {
  try {
    console.log("page no.- ------", num);
    const rawdata = await axios.get(
      `http://147.182.229.247:3015/api/v1/row-product/get-all/pagination/5/${num}`
    );
    return rawdata?.data?.data;
  } catch (error) {
    console.log("error==========>>>>>>>", error);
  }
}

export async function postProductData(payload) {
  try {
    const response = await axios.post(
      "http://147.182.229.247/api/v1/product/upload/with-scraping",
      payload
    );
    console.log("respnse78888888============>>>>", response);
    return response;
  } catch (error) {
    console.log("error=======>>>>>>>>", error);
  }
}

export function getRandomWebsites() {
  const websites = [
    "https://www.instacart.com/store/sprouts/storefront",
    "https://www.instacart.com/store/?categoryFilter=homeTabForYou",
    "https://www.instacart.com/store/aldi/storefront",
    "https://www.instacart.com/store/costco/storefront",
    "https://www.instacart.com/store/cvs/storefront",
    "https://www.instacart.com/store/kroger/storefront",
    "https://www.instacart.com/store/loblaw/storefront",
    "https://www.instacart.com/store/publix/storefront",
    "https://www.instacart.com/store/sams-club/storefront",
    "https://www.instacart.com/store/wegmans/storefront",
    "https://www.instacart.com/store/heb/storefront",
    "https://www.instacart.com/store/safeway/storefront",
    "https://www.instacart.com/store/shoprite/storefront",
    "https://www.instacart.com/store/meijer/storefront",
    "https://www.instacart.com/store/stop-shop/storefront",
    "https://www.instacart.com/store/giant-food/storefront",
    "https://www.instacart.com/store/rite-aid/storefront",
    "https://www.instacart.com/store/petco/storefront",
    "https://www.instacart.com/store/sephora/storefront",
    "https://www.instacart.com/store/big-lots/storefront",
  ];

  // Shuffle array and pick 3 random links
  const randomWebsites = websites.sort(() => Math.random() - 0.5).slice(0, 3);

  return randomWebsites;
}
