import _ol_Map_ from '../src/ol/Map.js';
import _ol_View_ from '../src/ol/View.js';
import _ol_interaction_ from '../src/ol/interaction.js';
import _ol_interaction_MouseWheelZoom_ from '../src/ol/interaction/MouseWheelZoom.js';
import _ol_layer_Tile_ from '../src/ol/layer/Tile.js';
import _ol_source_OSM_ from '../src/ol/source/OSM.js';


var map = new _ol_Map_({
  interactions: _ol_interaction_.defaults({mouseWheelZoom: false}).extend([
    new _ol_interaction_MouseWheelZoom_({
      constrainResolution: true // force zooming to a integer zoom
    })
  ]),
  layers: [
    new _ol_layer_Tile_({
      source: new _ol_source_OSM_()
    })
  ],
  target: 'map',
  view: new _ol_View_({
    center: [0, 0],
    zoom: 2
  })
});
