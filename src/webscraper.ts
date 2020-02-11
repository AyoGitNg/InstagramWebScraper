import { launch } from 'puppeteer'

type ScrappedData = {
  num_of_post?: string
  name?: string
  description?: string
  num_of_followers?: string
  num_following?: string
  images?: Array<any>
}

export const webScraper = async (instagramHandle: string) => {
  const url = 'https://www.instagram.com/' + instagramHandle + '/'
  const browser = await launch()

  const page = await browser.newPage()
  await page.goto(url)

  const isError = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.p-error')).length > 0
  })

  if (isError) {
    await browser.close()

    return null
  } else {
    const headers = await page.evaluate(() => {
      const headerNodeList = Array.from(
        // @ts-ignore
        document.querySelector('header section').childNodes
      )
      // @ts-ignore
      const nameNodeElement = headerNodeList[0].querySelector('h1')
      const name = nameNodeElement.innerText ? nameNodeElement.innerText : ''

      const numberOfPost = headerNodeList[1]
        // @ts-ignore
        .querySelectorAll('li')[0]
        .innerText.split(' ')[0]

      const numberOfFollowers = headerNodeList[1]
        // @ts-ignore
        .querySelectorAll('li')[1]
        .innerText.split(' ')[0]

      const numberOfFollowing = headerNodeList[1]
        // @ts-ignore
        .querySelectorAll('li')[2]
        .innerText.split(' ')[0]
      // @ts-ignore
      const descTitle = headerNodeList[2].querySelector('h1')
      // @ts-ignore
      const descLink = headerNodeList[2].querySelector('a')
      // @ts-ignore
      const descText = headerNodeList[2].querySelector('span')

      let descriptions = ''
      if (descTitle && descTitle.innerText) {
        descriptions = descriptions + ' ' + descTitle.innerText
      }

      if (descLink && descLink.innerText) {
        descriptions = descriptions + ' ' + descLink.innerText
      }

      if (descText && descText.innerText) {
        descriptions = descriptions + ' ' + descText.innerText
      }

      return {
        name,
        numberOfPost,
        numberOfFollowers,
        numberOfFollowing,
        descriptions
      }
    })

    const images = await page.evaluate(() => {
      return (
        Array.from(document.querySelectorAll('img.FFVAD'))
          .slice(0, 6)
          // @ts-ignore
          .map(e => e.src)
      )
    })

    const data: ScrappedData = {}
    data.num_of_followers = headers.numberOfFollowers
    data.num_following = headers.numberOfFollowing
    data.name = headers.name
    data.description = headers.descriptions
    data.num_of_post = headers.numberOfPost
    data.images = images

    await browser.close()

    return data
  }
}
