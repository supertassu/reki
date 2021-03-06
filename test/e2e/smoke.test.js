import puppeteer from 'puppeteer'
import { waitForText } from './utils.js'

const BASE_URL = `http://localhost:${process.env.PORT}`

describe('REKI', () =>
  it('should show a login button', async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()

    await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
    await waitForText('Kirjaudu', page)

    await browser.close()
  }))
