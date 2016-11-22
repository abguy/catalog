# Products catalog

Welcome to the Products catalog project!

It is my experiment with [Flux application architecture](https://facebook.github.io/flux/).

**Warning!**
Please note that this project was implemented in early 2015. It is outdated. 
JS world changed significantly since that time.

## Other goals

* Try [HTML5 pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history);
* Try Node.js ORMs with [Sequelize](https://github.com/sequelize/sequelize);
* Rendering with [Jade](http://jade-lang.com/).

# Initial task

Please build a small Node.js application, that shows a shop page displaying products from a catalog.

## Features

* A user should be able to browse a catalog of products, with image, name and item price displayed.
* Products should be grouped into categories. Store should have a filtering capability to filter by a certain category. There are many products and many categories. Each product can belong to multiple categories. Each category can have multiple products.
* Products should belong to a merchant. There are many products and many merchants. Each merchant can have multiple products. Each product can belong to only one merchant.
* Store should be paginated, showing 4 items in a row, 3 rows, with a total of 12 items per page.

# Results

You can find the results at [online demo](http://23.236.50.55:9090/).

# How to setup

Before start of the application please check "config/config.json", then execute:

    npm install
    npm run setup
    npm start

## Some Notes

* You shouldn't use Node.js server directly in production. It is better to use something like [Nginx](http://nginx.org/), [PM2](https://github.com/Unitech/pm2) or [forever project](https://github.com/foreverjs/forever) on your production server.
