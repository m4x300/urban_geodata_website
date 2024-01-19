

var format = 'image/png';

var BACKDROPS = {
  "basemap": [
    new ol.layer.Tile({
      'title': 'basemap.at Orthofoto',
      'type': 'base',
      'opacity': 1.000000,
      source: new ol.source.XYZ({
        attributions: '<a href="">basemap.at</a>',
        url: 'https://maps1.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg'
      })
    }),
    new ol.layer.Tile({
      'title': 'basemap.at',
      'type': 'base',
      'opacity': 1.000000,
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
      'opacity': 1.000000,
      source: new ol.source.OSM({
      })
    })
  ]
}

var tiled = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    //ratio: 1,
    url: wms.url,
    params: {
      'FORMAT': format,
      'VERSION': '1.1.0',
      //"STYLES": '',
      "LAYERS": wms.layer,
      "TILED": "true",
      //"exceptions": 'application/vnd.ogc.se_inimage',
    }
  }),
  opacity: 1.000000,
});

var layers = [
  tiled,
]

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

const layerSwitcher = new ol.control.LayerSwitcher({
  reverse: true,
  groupSelectStyle: 'group'
});
map.addControl(layerSwitcher);

map.getView().fit(wms.bounds, map.getSize());

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
