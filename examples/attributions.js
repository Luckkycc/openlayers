import _ol_Map_ from '../src/ol/Map.js';
import _ol_View_ from '../src/ol/View.js';
import _ol_control_ from '../src/ol/control.js';
import _ol_control_Attribution_ from '../src/ol/control/Attribution.js';
import _ol_layer_Tile_ from '../src/ol/layer/Tile.js';
import _ol_source_OSM_ from '../src/ol/source/OSM.js';

var attribution = new _ol_control_Attribution_({
  collapsible: false
});
var map = new _ol_Map_({
  layers: [
    new _ol_layer_Tile_({
      source: new _ol_source_OSM_()
    })
  ],
  controls: _ol_control_.defaults({attribution: false}).extend([attribution]),
  target: 'map',
  view: new _ol_View_({
    center: [0, 0],
    zoom: 2
  })
});

function checkSize() {
  var small = map.getSize()[0] < 600;
  attribution.setCollapsible(small);
  attribution.setCollapsed(small);
}

window.addEventListener('resize', checkSize);
checkSize();
