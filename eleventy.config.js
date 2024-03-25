export default function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy({"static": "."});
   
    eleventyConfig.addPassthroughCopy("node_modules/ol/dist/ol.js");
    eleventyConfig.addPassthroughCopy("node_modules/ol/ol.css");
  };
