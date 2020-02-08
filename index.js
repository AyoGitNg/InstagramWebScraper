const cheerio = require('cheerio');

const puppeteer = require('puppeteer');
const url = 'https://www.instagram.com/leomessi/';

const getImagesIdAndURls = (imageSrcSetInDom) => {
    const imageSplit  = imageSrcSetInDom.split(',');
    const currentImage = {};
    imageSplit.forEach(e => {
        const eachSplit = e.split(' ');
        if(eachSplit.length === 2){
            currentImage[eachSplit[1]] = eachSplit[0];
        }
    });
    return currentImage;
};

const scrapData =  async (url) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);
    const parsedHtml = await page.content();

    const $ = cheerio.load(parsedHtml);
    const numberOfPost = $('#react-root > section > main > div > header > section > ul > li:nth-child(1) > a > span').text();
    const name = $('#react-root > section > main > div > header > section > div.-vDIg > h1').text();
    const description = $('#react-root > section > main > div > header > section > div.-vDIg > span').text();
    const numberOfFollower = $('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span').attr('title');
    const followingNumber = $('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span').text();
    const firstImage = $('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div.KL4Bh > img').attr('srcset');

    const secondImage = $('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > a > div > div.KL4Bh > img').attr('srcset');

    const thirdImage = $('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > a > div.eLAPa > div.KL4Bh > img').attr('srcset');
    const fourthImage = $('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > a > div.eLAPa > div.KL4Bh > img').attr('srcset');
    const fifthImage = $('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > a > div.eLAPa > div.KL4Bh > img').attr('srcset');
    const sixthImage = $('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > a > div.eLAPa > div.KL4Bh > img').attr('srcset');

    const result = {};
    result.num_of_post = numberOfPost;
    result.name = name;
    result.description = description;
    result.num_of_followers = numberOfFollower;
    result.num_following = followingNumber;
    result.images = [];
    result.images.push(getImagesIdAndURls(firstImage));
    result.images.push(getImagesIdAndURls(secondImage));
    result.images.push(getImagesIdAndURls(thirdImage));
    result.images.push(getImagesIdAndURls(fourthImage));
    result.images.push(getImagesIdAndURls(fifthImage));
    result.images.push(getImagesIdAndURls(sixthImage));

    console.log(result);

    await browser.close();

    return result;
};

(scrapData(url));
