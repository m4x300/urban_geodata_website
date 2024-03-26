# Urban Geodata Website

This projects provides a static webfrontend featuring a map viewer based on OL in order to display the contents of a geoserver instance.

## Developemnt

static website using eleventy, developement server started with

```
npx @11ty/eleventy --serve
```

Static resources, which should be shipped with the site, need to be configured in `.eleventy.js` with the
`addPassthroughCopy` command.

## Adding Maps

maps.json -> map.njk -> map.js

The available maps are listed in `_data/maps.json`.

The template `map.njk` iterates over those maps and generates a HTML file for each of them. The rendered HTML
includes the configuration for the map (WMS URL, map extent, base layer). It also includes the form controls for transparency, selected map layers, etc.

Finally, the JavaScript file `maps.js` instantiates the OpenLayers map in the browser depending on the config in HTML file.

## Localization

The website is offered in german and english language.
All HTML tags containing text, should be repeated for both locales with the `lang`-attribute. Example:

```html
<h1 lang="de">Deutscher Titel</h1>
<h1 lang="en">English Title</h1>
```

The initial lanugage is determined by inspecting the `navigator.language` property. Users can switch the language by clicking a button.
The selected lanugage is stored in localStorage with the key `udg.lang`.

## Deployment 

Build:
```
npx @11ty/eleventy
```
 Upload contents of `_site` 
