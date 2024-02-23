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

var map = new ol.Map({
  target: 'map',
  layers: layers,
  renderer: 'canvas',
  view: new ol.View(),
});

map.getView().fit(wms.bounds, map.getSize());

// add layerSwitcher if we have multiple base maps
if(layers[0] instanceof ol.layer.Group && layers[0].getLayers().getLength() > 1) {
  const layerSwitcher = new ol.control.LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group'
  });
  map.addControl(layerSwitcher);
}

/*
*    B L E N D E R
*/
var multiplyToggle = document.getElementById('ovl-multiply');

function onMultiplyChange() {
  var on = multiplyToggle.checked;
  if (on) {
    changeBlendMode('multiply');
  } else {
    changeBlendMode('source-over');
  }
}
multiplyToggle.addEventListener('change', onMultiplyChange);
map.once('rendercomplete', onMultiplyChange);

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

var ovlSlider = document.getElementById("ovl-trans");
ovlSlider.addEventListener('change', function () {
  layers[layers.length - 1].setOpacity(this.value / 100);
}, {
  passive: true
})
