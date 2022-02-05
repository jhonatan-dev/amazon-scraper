const puppeteer = require('puppeteer');
const elasticSearch = require('./elastic-search/elastic')
const asin = require('./get-asin')

const SEARCH_URL = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=(KEYWORD)&page=(PAGE)"
const PRODUCT_URL = "https://www.amazon.com/dp/(ASIN)"
const PAGE_LIMIT = 1
search_fields = [
    "iphone",
    // "mobile",
    // "beauty",
    // "hair",
    // "apple",
    // "macbook",
    // "calcukator",
    // "pen",
    // "glass",
    // "note 8",
    // "samsung",
    // "wallet",
    // "watch"
]

const SEARCH_RESULT_SELECTOR = '#s-results-list-atf > li'
const PRODUCT_TITLE_SELECTOR = "#productTitle"


async function getDriver() {
    var browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    return browser
}

async function getProduct(asin) {
    var browser = await getDriver()
    var page = await browser.newPage()
    url = PRODUCT_URL + asin

    await page.goto(url)

    let productTitle = await page.evaluate((sel) => {
        var ele = document.querySelector(sel)
        return ele ? ele.innerHTML : null
    }, PRODUCT_TITLE_SELECTOR)
    
    var data = {
        index: 'amazon',
        id: asin,
        type: 'product-title',
        body: {
            "asin": asin,
            "title": productTitle
        }
    }

    elasticSearch.insertOne(data).then((resp) => {
    })

    browser.close()
}

async function scrapeSearch(url, starting, ending) {
    var browser = await getDriver()
    var page = await browser.newPage()
    await page.goto(url)

    try {
        let asins = await page.evaluate((sel) => {
            const lis = Array.from(document.querySelectorAll('#s-results-list-atf > li'))
            return lis.map(li => li.getAttribute('data-asin'))
        }, '#atfResults')
        for(var j=0; j<asins.length; j++) {
            asin = asins[j]
            await getProduct(asin)
        }
    } catch(err) {
        console.log(err)
    }
    browser.close()
}

async function giveASearch(searchText) {
    for(var page=1; page<=PAGE_LIMIT; page++) {
        url = SEARCH_URL.replace("(PAGE)", page)
        url = url.replace("(KEYWORD)", searchText)

        await scrapeSearch(url, (page-1)*30, page*30)
    }
}


async function solve() {
    process.setMaxListeners(0)
    for(var i=0; i<1000000; i++) {
        getProduct(asin())
    }
    // search_fields.forEach(src => {
    //     giveASearch(src)
    // });
}

solve();