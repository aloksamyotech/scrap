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
        "https://www.walmart.com/",
        "https://www.target.com/",
        "https://www.kroger.com/",
        "https://www.publix.com/",
        "https://www.costco.com/",
        "https://www.samsclub.com/",
        "https://www.aldi.us/",
        "https://www.wholefoodsmarket.com/",
        "https://www.traderjoes.com/",
        "https://www.sprouts.com/",
        "https://www.shoprite.com/",
        "https://www.safeway.com/",
        "https://www.wegmans.com/",
        "https://www.heb.com/",
        "https://www.meijer.com/",
        "https://www.stopandshop.com/",
        "https://www.gianteagle.com/",
        "https://www.freshdirect.com/",
        "https://www.foodlion.com/",
        "https://www.harris-teeter.com/",
        "https://www.amazon.com/",
        "https://www.ebay.com/",
        "https://www.etsy.com/",
        "https://www.alibaba.com/",
        "https://www.flipkart.com/",
        "https://www.rakuten.com/",
        "https://www.newegg.com/",
        "https://www.bestbuy.com/",
        "https://www.overstock.com/",
        "https://www.macys.com/",
        "https://www.kohls.com/",
        "https://www.nordstrom.com/",
        "https://www.zappos.com/",
        "https://www.homedepot.com/",
        "https://www.lowes.com/",
        "https://www.wayfair.com/",
        "https://www.ikea.com/us/en/",
        "https://www.staples.com/",
        "https://www.officedepot.com/",
        "https://www.michaels.com/",
        "https://www.hobbylobby.com/",
        "https://www.walgreens.com/",
        "https://www.cvs.com/",
        "https://www.riteaid.com/",
        "https://www.petco.com/",
        "https://www.petsmart.com/",
        "https://www.chewy.com/",
        "https://www.sephora.com/",
        "https://www.ulta.com/",
        "https://www.bathandbodyworks.com/",
        "https://www.victoriassecret.com/",
        "https://www.hollisterco.com/",
        "https://www.abercrombie.com/",
        "https://www.ae.com/",
        "https://www.urbanoutfitters.com/",
        "https://www.forever21.com/",
        "https://www.hm.com/",
        "https://www.zara.com/",
        "https://www.gucci.com/",
        "https://www.prada.com/",
        "https://www.louisvuitton.com/",
        "https://www.dior.com/",
        "https://www.fendi.com/",
        "https://www.hermes.com/",
        "https://www.rolex.com/",
        "https://www.cartier.com/",
        "https://www.tiffany.com/",
        "https://www.jcrew.com/",
        "https://www.brooksbrothers.com/",
        "https://www.lululemon.com/",
        "https://www.nike.com/",
        "https://www.adidas.com/",
        "https://www.puma.com/",
        "https://www.newbalance.com/",
        "https://www.reebok.com/",
        "https://www.underarmour.com/",
        "https://www.columbia.com/",
        "https://www.northface.com/",
        "https://www.patagonia.com/",
        "https://www.levi.com/",
        "https://www.wrangler.com/",
        "https://www.gap.com/",
        "https://www.oldnavy.com/",
        "https://www.bananarepublic.com/",
        "https://www.uniqlo.com/",
        "https://www.superdry.com/",
        "https://www.landsend.com/",
        "https://www.ralphlauren.com/",
        "https://www.calvinklein.us/",
        "https://www.tommy.com/",
        "https://www.burberry.com/",
        "https://www.versace.com/",
        "https://www.armani.com/",
        "https://www.michaelkors.com/",
        "https://www.toryburch.com/",
        "https://www.katespade.com/",
        "https://www.coach.com/",
        "https://www.fossil.com/",
        "https://www.timberland.com/",
        "https://www.docmartens.com/",
        "https://www.clarks.com/",
        "https://www.skechers.com/",
        "https://www.crocs.com/",
        "https://www.ugg.com/",
        "https://www.journeys.com/",
        "https://www.vans.com/",
        "https://www.converse.com/",
        "https://www.birkenstock.com/",
        "https://www.redwingshoes.com/",
        "https://www.keenfootwear.com/",
        "https://www.merrell.com/",
        "https://www.teva.com/",
        "https://www.columbia.com/",
        "https://www.mountainhardwear.com/",
        "https://www.arcteryx.com/",
        "https://www.salomon.com/",
        "https://www.marmot.com/",
        "https://www.backcountry.com/",
        "https://www.rei.com/",
        "https://www.cabelas.com/",
        "https://www.basspro.com/",
        "https://www.dickssportinggoods.com/",
        "https://www.sportsauthority.com/",
        "https://www.academy.com/",
        "https://www.finishline.com/",
        "https://www.eastbay.com/",
        "https://www.footlocker.com/",
        "https://www.champssports.com/",
        "https://www.sportchek.ca/",
        "https://www.decathlon.com/",
        "https://www.thermoworks.com/",
        "https://www.williams-sonoma.com/",
        "https://www.crateandbarrel.com/",
        "https://www.potterybarn.com/",
        "https://www.wayfair.com/",
        "https://www.ashleyfurniture.com/",
        "https://www.rooms-to-go.com/",
        "https://www.ethanallen.com/",
        "https://www.cb2.com/",
        "https://www.article.com/",
        "https://www.westelm.com/",
        "https://www.serenaandlily.com/",
        "https://www.ikea.com/",
        "https://www.homedepot.com/",
        "https://www.lowes.com/",
        "https://www.menards.com/",
        "https://www.tractorsupply.com/",
        "https://www.acehardware.com/",
        "https://www.harborfreight.com/",
        "https://www.toolsdirect.com/",
        "https://www.zoro.com/",
        "https://www.northerntool.com/",
        "https://www.autozone.com/",
        "https://www.oreillyauto.com/",
        "https://www.rockauto.com/",
        "https://www.napaonline.com/",
        "https://www.advanceautoparts.com/",
        "https://www.pepboys.com/",
        "https://www.tirerack.com/",
        "https://www.discounttire.com/",
        "https://www.carid.com/",
        "https://www.wayfair.com/",
        "https://www.michaels.com/",
        "https://www.hobbylobby.com/",
        "https://www.joann.com/",
        "https://www.fabric.com/",
        "https://www.anniescatalog.com/",
        "https://www.craftsy.com/",
        "https://www.blitsy.com/",
        "https://www.art.com/",
        "https://www.dickblick.com/",
        "https://www.jerrysartarama.com/",
        "https://www.utrechtart.com/",
        "https://www.rookwood.com/",
        "https://www.etsy.com/"
    ];


    // Shuffle array and pick 3 random links
    const randomWebsites = websites.sort(() => Math.random() - 0.5).slice(0, 3);

    return randomWebsites;
}
