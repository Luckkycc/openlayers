import _ol_Map_ from '../../../../src/ol/Map.js';
import _ol_View_ from '../../../../src/ol/View.js';
import _ol_VectorImageTile_ from '../../../../src/ol/VectorImageTile.js';
import _ol_VectorTile_ from '../../../../src/ol/VectorTile.js';
import _ol_format_MVT_ from '../../../../src/ol/format/MVT.js';
import _ol_layer_VectorTile_ from '../../../../src/ol/layer/VectorTile.js';
import _ol_proj_ from '../../../../src/ol/proj.js';
import _ol_source_VectorTile_ from '../../../../src/ol/source/VectorTile.js';
import _ol_tilegrid_ from '../../../../src/ol/tilegrid.js';
import _ol_tilegrid_TileGrid_ from '../../../../src/ol/tilegrid/TileGrid.js';

describe('ol.source.VectorTile', function() {

  var format = new _ol_format_MVT_();
  var source = new _ol_source_VectorTile_({
    format: format,
    tilePixelRatio: 8,
    url: 'spec/ol/data/{z}-{x}-{y}.vector.pbf'
  });
  var tile;

  describe('constructor', function() {
    it('sets the format on the instance', function() {
      expect(source.format_).to.equal(format);
    });

    it('uses ol.VectorTile as default tileClass', function() {
      expect(source.tileClass).to.equal(_ol_VectorTile_);
    });

    it('creates a 512 XYZ tilegrid by default', function() {
      var tileGrid = _ol_tilegrid_.createXYZ({tileSize: 512});
      expect(source.tileGrid.tileSize_).to.equal(tileGrid.tileSize_);
      expect(source.tileGrid.extent_).to.equal(tileGrid.extent_);
    });
  });

  describe('#getTile()', function() {
    it('creates a tile with the correct tile class', function() {
      tile = source.getTile(0, 0, 0, 1, _ol_proj_.get('EPSG:3857'));
      expect(tile).to.be.a(_ol_VectorImageTile_);
    });
    it('sets the correct tileCoord on the created tile', function() {
      expect(tile.getTileCoord()).to.eql([0, 0, 0]);
    });
    it('fetches tile from cache when requested again', function() {
      expect(source.getTile(0, 0, 0, 1, _ol_proj_.get('EPSG:3857')))
          .to.equal(tile);
    });
  });

  describe('#getTileGridForProjection', function() {
    it('creates a tile grid with the source tile grid\'s tile size', function() {
      var tileGrid = source.getTileGridForProjection(_ol_proj_.get('EPSG:3857'));
      expect(tileGrid.getTileSize(0)).to.be(512);
    });
  });

  describe('Tile load events', function() {
    it('triggers tileloadstart and tileloadend with ol.VectorTile', function(done) {
      tile = source.getTile(14, 8938, -5681, 1, _ol_proj_.get('EPSG:3857'));
      var started = false;
      source.on('tileloadstart', function() {
        started = true;
      });
      source.on('tileloadend', function(e) {
        expect(started).to.be(true);
        expect(e.tile).to.be.a(_ol_VectorTile_);
        expect(e.tile.getFeatures().length).to.be(1327);
        done();
      });
      tile.load();
    });
  });

  describe('different source and render tile grids', function() {

    var source, map, loaded, requested, target;

    beforeEach(function() {

      loaded = [];
      requested = 0;

      function tileUrlFunction(tileUrl) {
        ++requested;
        if (tileUrl.toString() == '6,27,55') {
          return tileUrl.join('/');
        }
      }

      function tileLoadFunction(tile, src) {
        tile.setLoader(function() {});
        loaded.push(src);
      }

      var extent = [665584.2026596286, 7033250.839875697, 667162.0221431496, 7035280.378636755];

      source = new _ol_source_VectorTile_({
        tileGrid: new _ol_tilegrid_TileGrid_({
          origin: [218128, 6126002],
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5]
        }),
        tileUrlFunction: tileUrlFunction,
        tileLoadFunction: tileLoadFunction
      });

      target = document.createElement('div');
      target.style.width = target.style.height = '100px';
      document.body.appendChild(target);

      map = new _ol_Map_({
        layers: [
          new _ol_layer_VectorTile_({
            extent: extent,
            source: source
          })
        ],
        target: target,
        view: new _ol_View_({
          zoom: 11,
          center: [666373.1624999996, 7034265.3572]
        })
      });

    });

    afterEach(function() {
      document.body.removeChild(target);
    });

    it('loads available tiles', function(done) {
      map.renderSync();
      setTimeout(function() {
        expect(requested).to.be.greaterThan(1);
        expect(loaded).to.eql(['6/27/55']);
        done();
      }, 0);
    });

  });

});
