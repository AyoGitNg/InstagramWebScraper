import { webScraper } from '../src/webscraper'

//const validInstagramHandle = 'leomessi'
const validInstagramHandle = 'cristiano'

const inValidInstagramHandle = 'dssods'

describe('ScrapData Test', () => {
  it('works if valid instagramHandle is passed', async () => {
    const result = await webScraper(validInstagramHandle)

    expect(result).toBeDefined()
    if (result) {
      expect(result.num_of_post).toBeDefined()
      expect(result.description).toBeDefined()
      expect(result.images).toBeDefined()
      expect(result.name).toBeDefined()
      expect(result.num_following).toBeDefined()

      expect(result.num_of_followers).toBeDefined()
    }
  })

  it('fails if invalid instagramHandle is passed', async () => {
    const result = await webScraper(inValidInstagramHandle)
    expect(result).toBeNull()
  })
})
