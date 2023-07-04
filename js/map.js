
var projection = new ol.proj.Projection({
    code: 'EPSG:23700',
    units: 'm',
    global: false
});
var format = 'image/png';

var untiled = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      ratio: 1,
      url: wms.url,
      params: {'FORMAT': format,
               'VERSION': '1.1.1',  
            "STYLES": '',
            "LAYERS": wms.layer,
            "exceptions": 'application/vnd.ogc.se_inimage',
      }
    })
});

var map = new ol.Map({
  target: 'map',
  layers: [
    untiled,
  ],
  view: new ol.View({
    projection: projection
    //center: [445007.5846, 316262.159],
    //zoom: 2,
  }),
});

map.getView().fit(wms.bounds, map.getSize());
