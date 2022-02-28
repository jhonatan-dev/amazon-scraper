# Project Title

A simple scrapper to scrape data using distributed system

## Getting Started

Used 200 GOOGLE Compute Engine to scrape  
n1-standard-2 (2 vCPU, 7.5 GB) - 0.0950$/hour - 19$/hour (for 200 vCPU)  
  
For Scraping I have used a [script](https://gist.github.com/dipta007/90d42b34053782227d87fed0d377395c) which will execute from GC console. It will create 200 engines in a few minutes, then the start up script will install all the dependencies and each one will call the function to scrape 50 products from the 10000 products(Given in the previous task). Here I have used BFS type technique to iterate the products, for each product I have collected all the similar products ASIN from that page and scrape them later.
## Built With

* [NodeJS](https://nodejs.org/en/) - The core language
* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome for NodeJS
