import _ol_Map_ from '../src/ol/Map.js';
import _ol_View_ from '../src/ol/View.js';
import _ol_format_WMTSCapabilities_ from '../src/ol/format/WMTSCapabilities.js';
import _ol_layer_Tile_ from '../src/ol/layer/Tile.js';
import _ol_source_OSM_ from '../src/ol/source/OSM.js';
import _ol_source_WMTS_ from '../src/ol/source/WMTS.js';

var parser = new _ol_format_WMTSCapabilities_();
var map;

fetch('data/WMTSCapabilities.xml').then(function(response) {
  return response.text();
}).then(function(text) {
  var result = parser.read(text);
  var options = _ol_source_WMTS_.optionsFromCapabilities(result, {
    layer: 'layer-7328',
    matrixSet: 'EPSG:3857'
  });

  map = new _ol_Map_({
    layers: [
      new _ol_layer_Tile_({
        source: new _ol_source_OSM_(),
        opacity: 0.7
      }),
      new _ol_layer_Tile_({
        opacity: 1,
        source: new _ol_source_WMTS_(/** @type {!olx.source.WMTSOptions} */ (options))
      })
    ],
    target: 'map',
    view: new _ol_View_({
      center: [19412406.33, -5050500.21],
      zoom: 5
    })
  });
});
