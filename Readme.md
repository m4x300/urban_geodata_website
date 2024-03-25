# Urban Geodata Website

This projects provides a static webfrontend featuring a map viewer based on OL in order to display the contents of a geoserver instance.

## Developemnt

static website using eleventy, developement server startet 
```
npx @11ty/eleventy --serve
```

adding functionalities via npm install ()
`.eleventy.js` addPassthroughCopy

## Adding Maps

maps.json -> map.njk -> map.js


## Localization

The website is offered in german and english language.
All HTML tags containing text, should be repeated for both locales with the `lang`-attribute. Example:

```html
<h1 lang="de">Deutscher Titel</h1>
<h1 lang="en">English Title</h1>
```

The initial lanugage is determined by inspecting the `navigator.language` property. Users can switch the language by clicking a button.
The selected lanugage is stored in a cookie `udg.lang`.

## Deployment 

```
npx @11ty/eleventy --serve
```
 Upload contents of `_site` 
