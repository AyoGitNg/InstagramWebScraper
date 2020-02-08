import * as cheerio from 'cheerio'
import { launch } from 'puppeteer'

type ScrappedData = {
  num_of_post?: string
  name?: string
  description?: string
  num_of_followers?: string
  num_following?: string
  images?: Array<any>
}

const getImagesIdAndURls = (imageSrcSetInDom: string) => {
  const imageSplit = imageSrcSetInDom.split(',')
  const currentImage: any = {}
  imageSplit.forEach(e => {
    const eachSplit = e.split(' ')
    if (eachSplit.length === 2) {
      currentImage[eachSplit[1]] = eachSplit[0]
    }
  })
  return currentImage
}

const scrapData = async (instagramHandle: string) => {
  const url = 'https://www.instagram.com/' + instagramHandle + '/'
  const browser = await launch()

  const page = await browser.newPage()
  await page.goto(url)
  const parsedHtml = await page.content()

  const $ = cheerio.load(parsedHtml)

  const error = $(
    'body > div > div.page.-cx-PRIVATE-Page__body.-cx-PRIVATE-Page__body__ > div > div'
  ).attr()

  if (
    error !== undefined &&
    error.class.split(' ').includes('error-container')
  ) {
    await browser.close()
    return undefined
  } else {
    const numberOfPost = $(
      '#react-root > section > main > div > header > section > ul > li:nth-child(1) > a > span'
    ).text()
    const name = $(
      '#react-root > section > main > div > header > section > div.-vDIg > h1'
    ).text()
    const description = $(
      '#react-root > section > main > div > header > section > div.-vDIg > span'
    ).text()
    const numberOfFollower = $(
      '#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span'
    ).attr('title')
    const followingNumber = $(
      '#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span'
    ).text()
    const firstImage = $(
      '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > a > div.eLAPa > div.KL4Bh > img'
    ).attr('srcset')
    const secondImage = $(
      '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > a > div > div.KL4Bh > img'
    ).attr('srcset')
    const thirdImage = $(
      '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > a > div.eLAPa > div.KL4Bh > img'
    ).attr('srcset')
    const fourthImage = $(
      '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > a > div.eLAPa > div.KL4Bh > img'
    ).attr('srcset')
    const fifthImage = $(
      '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > a > div.eLAPa > div.KL4Bh > img'
    ).attr('srcset')
    const sixthImage = $(
      '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > a > div.eLAPa > div.KL4Bh > img'
    ).attr('srcset')

    const result: ScrappedData = {}
    result.num_of_post = numberOfPost
    result.name = name
    result.description = description
    result.num_of_followers = numberOfFollower
    result.num_following = followingNumber
    result.images = []
    if (firstImage !== undefined)
      result.images.push(getImagesIdAndURls(firstImage))
    if (secondImage !== undefined)
      result.images.push(getImagesIdAndURls(secondImage))
    if (thirdImage !== undefined)
      result.images.push(getImagesIdAndURls(thirdImage))
    if (fourthImage !== undefined)
      result.images.push(getImagesIdAndURls(fourthImage))
    if (fifthImage !== undefined)
      result.images.push(getImagesIdAndURls(fifthImage))
    if (sixthImage !== undefined)
      result.images.push(getImagesIdAndURls(sixthImage))

    await browser.close()
    return result
  }
}

export default scrapData
