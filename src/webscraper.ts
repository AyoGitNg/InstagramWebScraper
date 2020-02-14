import * as cheerio from 'cheerio'
import * as rp from 'request-promise'

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
  const html = await rp(url).catch(err => {
    return null
  })

  if (html !== null) {
    const $ = cheerio.load(html)

    const sharedDataArr = $('script')
      .get()
      .filter(e => e.children.length > 0)
      .filter(e => e.children[0].data.startsWith('window._sharedData'))

    if (sharedDataArr.length > 0) {
      const firstLeftCurlyIndex = sharedDataArr[0].children[0].data.indexOf('{')
      const lastRightCurlyIndex =
        sharedDataArr[0].children[0].data.lastIndexOf('}') + 1

      const sharedData = sharedDataArr[0].children[0].data.substring(
        firstLeftCurlyIndex,
        lastRightCurlyIndex
      )
      const dataInJson = JSON.parse(sharedData)

      const userData = dataInJson.entry_data.ProfilePage[0].graphql.user

      const data: ScrappedData = {}
      data.num_of_followers = userData.edge_followed_by.count
      data.num_following = userData.edge_follow.count
      data.name = userData.full_name
      data.description = userData.biography
      data.num_of_post = userData.edge_owner_to_timeline_media.count
      data.images = userData.edge_owner_to_timeline_media.edges
        .slice(0, 6)
        // @ts-ignore
        .map(e => e.node.display_url)

      return data
    } else {
      return null
    }
  } else {
    return null
  }
}
