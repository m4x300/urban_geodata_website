module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("js/map.js");
   
    eleventyConfig.addPassthroughCopy("node_modules/ol/dist/ol.js");
    eleventyConfig.addPassthroughCopy("node_modules/ol/ol.css");
  };