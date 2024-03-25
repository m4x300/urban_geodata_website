/* wms Object is defined for each map in maps.json and inkected into map.njk

"wms": {
      "bounds":  [x0, y0, x1, y1],
      "layer": "stadtverfall:Stadtverfall und Stadterneuerung in Wien 1986 - 1989",
      "vector": "stadtverfall:wien_stadtverfall",
      "backdrop": "basemap" | "osm"
  }
*/

var vectorLayer =  wms.vector ? new ol.layer.Tile({
  source: new ol.source.TileWMS({
    //ratio: 1,
    url: 'https://geo.isr.oeaw.ac.at/geoserver/stadtverfall/wms?',
    params: {
      'FORMAT': 'image/png',
      'VERSION': '1.1.0',
      //"STYLES": '',
      "LAYERS": wms.vector,
      "TILED": true,
      //"exceptions": 'application/vnd.ogc.se_inimage',
    }
  }),
  opacity: 1.000000,
}) : undefined

var historicLayer = wms.layer ? new ol.layer.Tile({
  source: new ol.source.TileWMS({
    //ratio: 1,
    url: 'https://geo.isr.oeaw.ac.at/geoserver/stadtverfall/wms?',
    params: {
      'FORMAT': 'image/png',
      'VERSION': '1.1.0',
      //"STYLES": '',
      "LAYERS": wms.layer,
      "TILED": true,
      //"exceptions": 'application/vnd.ogc.se_inimage',
    }
  }),
  opacity: 1.000000,
}) : undefined


var BACKDROPS = {
  basemap: new ol.layer.Tile({
    'title': 'basemap.at',
    'type': 'base',
    source: new ol.source.XYZ({
      attributions: '<a href="https://basemap.at">basemap.at</a>',
      url: 'https://maps1.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png'
    }),
    visible: false,
  }),
  basemapOrtho: new ol.layer.Tile({
    'title': 'basemap.at Orthofoto',
    'type': 'base',
    source: new ol.source.XYZ({
      attributions: '<a href="https://basemap.at">basemap.at</a>',
      url: 'https://maps1.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg'
    }),
    visible: false,
  }),
  osm: new ol.layer.Tile({
    'title': 'OSM',
    'type': 'base',
    source: new ol.source.OSM({
      // attributions: '<a href="https://openstreetmap.org/copyright">OpenStreetMap</a>', uncomment to override default attribution
    }),
    visible: false,
  })
}


var layers = [
  BACKDROPS.basemap,
  BACKDROPS.basemapOrtho,
  BACKDROPS.osm,
  historicLayer,
  vectorLayer,
]

var attribution = new ol.control.Attribution({
  collapsible: false,
})

var map = new ol.Map({
  target: 'map',
  layers: layers,
  controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
  renderer: 'canvas',
  view: new ol.View(),
});

map.getView().fit(wms.bounds, map.getSize());


/** Settings utilities */
function storeSetting(settingKey, value) {
  localStorage.setItem('ugd.' + settingKey, value)
}
function getSetting(settingKey, defaultValue) {
  const key = 'ugd.' + settingKey
  return (key in localStorage)
    ? localStorage.getItem('ugd.' + settingKey)
    : defaultValue
}

/* Blend mode */
var multiplyToggle = document.getElementById('ovl-multiply');

function onMultiplyChange() {
  var blendmode = multiplyToggle.checked
    ? 'multiply'
    : 'source-over'
  changeBlendMode(blendmode);
  storeSetting('blendmode', blendmode);
}
multiplyToggle.addEventListener('change', onMultiplyChange);
map.once('rendercomplete', () => changeBlendMode(getSetting('blendmode')));
multiplyToggle.checked = getSetting('blendmode') === 'multiply'

function changeBlendMode(mode) {
  var canvas = document.getElementById(map.getTarget()).querySelector('canvas');
  var context = canvas.getContext("2d");
  var fn = function () {
    context.globalCompositeOperation = mode
  }
  map.on('precompose', fn);
  map.on('postcompose', fn);
  map.render();
}

/** Transparency */
function setOpacity(percent) {
  historicLayer.setOpacity(parseFloat(percent));
}
var ovlSlider = document.getElementById("ovl-trans");
ovlSlider.addEventListener('input', function () {
  const percent = this.value / 100
  setOpacity(percent)
  storeSetting('opacity', percent)
}, {
  passive: true
})
setOpacity(getSetting('opacity', 1))
ovlSlider.value = getSetting('opacity', 1) * 100

/** Base layers */
var backdropRadios = document.querySelectorAll('input[name="backdrop"]')
for(var backdropRadio of backdropRadios) {
  BACKDROPS[backdropRadio.value].setVisible(backdropRadio.checked)

  backdropRadio.addEventListener('change', function() {
    var layer = BACKDROPS[this.value]
    layer.setVisible(true)
    Object.entries(BACKDROPS).forEach(([key, value]) => {
      if (key !== this.value) {
        value.setVisible(false)
      }
    })
  })
}

/** Vektorisierung "GIS-Layer" */
var vectorToggle = document.getElementById('ovl-vector')
if(vectorToggle && vectorLayer) {
  function onVectorChange() {
    var showVector = vectorToggle.checked
    vectorLayer.setVisible(showVector)
    storeSetting('showVector', showVector)
  }
  vectorToggle.addEventListener('change', onVectorChange);
  map.once('rendercomplete', () => changeBlendMode(getSetting('showVector')));
  vectorToggle.checked = getSetting('showVector') === true
  vectorLayer.setVisible(vectorToggle.checked)
}
