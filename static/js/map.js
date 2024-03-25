/* wms Object is defined for each map in maps.json and inkected into map.njk

"wms": {
      "bounds":  [x0, y0, x1, y1],
      "layer": "stadtverfall:1903",
      "backdrop": "basemap" | "osm"
  }
*/



var layers = [
  new ol.layer.Tile({
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
  })
]

var BACKDROPS = {
  "basemap": [
    new ol.layer.Tile({
      'title': 'basemap.at Orthofoto',
      'type': 'base',
      source: new ol.source.XYZ({
        attributions: '<a href="https://basemap.at">basemap.at</a>',
        url: 'https://maps1.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg'
      })
    }),
    new ol.layer.Tile({
      'title': 'basemap.at',
      'type': 'base',
      source: new ol.source.XYZ({
        attributions: '<a href="https://basemap.at">basemap.at</a>',
        url: 'https://maps1.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png'
      })
    })
  ],
  "osm": [
    new ol.layer.Tile({
      'title': 'OSM',
      'type': 'base',
      source: new ol.source.OSM({
        // attributions: '<a href="https://openstreetmap.org/copyright">OpenStreetMap</a>', uncomment to override default attribution
      })
    })
  ]
}

if (wms.backdrop in BACKDROPS) { // ist
  layers.unshift(new ol.layer.Group({
    title: 'Base maps',
    layers: BACKDROPS[wms.backdrop],
  }))
}

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

// add layerSwitcher if we have multiple base maps
if (layers[0] instanceof ol.layer.Group && layers[0].getLayers().getLength() > 1) {
  const layerSwitcher = new ol.control.LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group',
    // activationMode: 'click'
  });
  map.addControl(layerSwitcher);
}

/*
*    B L E N D E R
*/
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
  layers[layers.length - 1].setOpacity(parseFloat(percent));
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


function storeSetting(settingKey, value) {
  localStorage.setItem('ugd.' + settingKey, value)
}
function getSetting(settingKey, defaultValue) {
  const key = 'ugd.' + settingKey
  return (key in localStorage)
    ? localStorage.getItem('ugd.' + settingKey)
    : defaultValue
}
