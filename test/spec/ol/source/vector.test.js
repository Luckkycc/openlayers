import _ol_events_ from '../../../../src/ol/events.js';
import _ol_Collection_ from '../../../../src/ol/Collection.js';
import _ol_Feature_ from '../../../../src/ol/Feature.js';
import _ol_Map_ from '../../../../src/ol/Map.js';
import _ol_View_ from '../../../../src/ol/View.js';
import _ol_geom_Point_ from '../../../../src/ol/geom/Point.js';
import _ol_geom_LineString_ from '../../../../src/ol/geom/LineString.js';
import _ol_layer_Vector_ from '../../../../src/ol/layer/Vector.js';
import _ol_loadingstrategy_ from '../../../../src/ol/loadingstrategy.js';
import _ol_proj_ from '../../../../src/ol/proj.js';
import _ol_source_Vector_ from '../../../../src/ol/source/Vector.js';


describe('ol.source.Vector', function() {

  var pointFeature;
  var infiniteExtent;
  beforeEach(function() {
    pointFeature = new _ol_Feature_(new _ol_geom_Point_([0, 0]));
    infiniteExtent = [-Infinity, -Infinity, Infinity, Infinity];
  });

  describe('when empty', function() {

    var vectorSource;
    beforeEach(function() {
      vectorSource = new _ol_source_Vector_();
    });

    describe('#forEachFeatureInExtent', function() {

      it('does not call the callback', function() {
        var f = sinon.spy();
        vectorSource.forEachFeatureInExtent(infiniteExtent, f);
        expect(f).not.to.be.called();
      });

    });

    describe('#getFeaturesInExtent', function() {

      it('returns an empty array', function() {
        var features = vectorSource.getFeaturesInExtent(infiniteExtent);
        expect(features).to.be.an(Array);
        expect(features).to.be.empty();
      });

    });

    describe('#isEmpty', function() {

      it('returns true', function() {
        expect(vectorSource.isEmpty()).to.be(true);
      });

    });

    describe('#addFeature', function() {

      it('can add a single point feature', function() {
        vectorSource.addFeature(pointFeature);
        var features = vectorSource.getFeaturesInExtent(infiniteExtent);
        expect(features).to.be.an(Array);
        expect(features).to.have.length(1);
        expect(features[0]).to.be(pointFeature);
      });

      it('fires a change event', function() {
        var listener = sinon.spy();
        _ol_events_.listen(vectorSource, 'change', listener);
        vectorSource.addFeature(pointFeature);
        expect(listener).to.be.called();
      });

      it('adds same id features only once', function() {
        var source = new _ol_source_Vector_();
        var feature1 = new _ol_Feature_();
        feature1.setId('1');
        var feature2 = new _ol_Feature_();
        feature2.setId('1');
        source.addFeature(feature1);
        source.addFeature(feature2);
        expect(source.getFeatures().length).to.be(1);
      });

    });

  });

  describe('when populated with 3 features', function() {

    var features = [];
    var vectorSource;
    beforeEach(function() {
      features.push(new _ol_Feature_(new _ol_geom_LineString_([[0, 0], [10, 10]])));
      features.push(new _ol_Feature_(new _ol_geom_Point_([0, 10])));
      features.push(new _ol_Feature_(new _ol_geom_Point_([10, 5])));
      vectorSource = new _ol_source_Vector_({
        features: features
      });
    });

    describe('#getClosestFeatureToCoordinate', function() {

      it('returns the expected feature', function() {
        var feature = vectorSource.getClosestFeatureToCoordinate([1, 9]);
        expect(feature).to.be(features[1]);
      });

      it('returns the expected feature when a filter is used', function() {
        var feature = vectorSource.getClosestFeatureToCoordinate([1, 9], function(feature) {
          return feature.getGeometry().getType() == 'LineString';
        });
        expect(feature).to.be(features[0]);
      });

    });

  });

  describe('when populated with 10 random points and a null', function() {

    var features;
    var vectorSource;
    beforeEach(function() {
      features = [];
      var i;
      for (i = 0; i < 10; ++i) {
        features[i] =
            new _ol_Feature_(new _ol_geom_Point_([Math.random(), Math.random()]));
      }
      features.push(new _ol_Feature_(null));
      vectorSource = new _ol_source_Vector_({
        features: features
      });
    });

    describe('#clear', function() {

      it('removes all features using fast path', function() {
        var changeSpy = sinon.spy();
        _ol_events_.listen(vectorSource, 'change', changeSpy);
        var removeFeatureSpy = sinon.spy();
        _ol_events_.listen(vectorSource, 'removefeature', removeFeatureSpy);
        var clearSourceSpy = sinon.spy();
        _ol_events_.listen(vectorSource, 'clear', clearSourceSpy);
        vectorSource.clear(true);
        expect(vectorSource.getFeatures()).to.eql([]);
        expect(vectorSource.isEmpty()).to.be(true);
        expect(changeSpy).to.be.called();
        expect(changeSpy.callCount).to.be(1);
        expect(removeFeatureSpy).not.to.be.called();
        expect(removeFeatureSpy.callCount).to.be(0);
        expect(clearSourceSpy).to.be.called();
        expect(clearSourceSpy.callCount).to.be(1);
      });

      it('removes all features using slow path', function() {
        var changeSpy = sinon.spy();
        _ol_events_.listen(vectorSource, 'change', changeSpy);
        var removeFeatureSpy = sinon.spy();
        _ol_events_.listen(vectorSource, 'removefeature', removeFeatureSpy);
        var clearSourceSpy = sinon.spy();
        _ol_events_.listen(vectorSource, 'clear', clearSourceSpy);
        vectorSource.clear();
        expect(vectorSource.getFeatures()).to.eql([]);
        expect(vectorSource.isEmpty()).to.be(true);
        expect(changeSpy).to.be.called();
        expect(changeSpy.callCount).to.be(1);
        expect(removeFeatureSpy).to.be.called();
        expect(removeFeatureSpy.callCount).to.be(features.length);
        expect(clearSourceSpy).to.be.called();
        expect(clearSourceSpy.callCount).to.be(1);
      });

    });

    describe('#forEachFeatureInExtent', function() {

      it('is called the expected number of times', function() {
        var f = sinon.spy();
        vectorSource.forEachFeatureInExtent(infiniteExtent, f);
        expect(f.callCount).to.be(10);
      });

      it('allows breaking out', function() {
        var count = 0;
        var result = vectorSource.forEachFeatureInExtent(infiniteExtent,
            function(f) {
              return ++count == 5;
            });
        expect(result).to.be(true);
        expect(count).to.be(5);
      });

    });

    describe('#getFeaturesInExtent', function() {

      it('returns the expected number of features', function() {
        expect(vectorSource.getFeaturesInExtent(infiniteExtent)).
            to.have.length(10);
      });

    });

    describe('#isEmpty', function() {

      it('returns false', function() {
        expect(vectorSource.isEmpty()).to.be(false);
      });

    });

    describe('#removeFeature', function() {

      it('works as expected', function() {
        var i;
        for (i = features.length - 1; i >= 0; --i) {
          vectorSource.removeFeature(features[i]);
          expect(vectorSource.getFeaturesInExtent(infiniteExtent)).
              have.length(i);
        }
      });

      it('fires a change event', function() {
        var listener = sinon.spy();
        _ol_events_.listen(vectorSource, 'change', listener);
        vectorSource.removeFeature(features[0]);
        expect(listener).to.be.called();
      });

    });

    describe('modifying a feature\'s geometry', function() {

      it('keeps the R-Tree index up to date', function() {
        expect(vectorSource.getFeaturesInExtent([0, 0, 1, 1])).
            to.have.length(10);
        features[0].getGeometry().setCoordinates([100, 100]);
        expect(vectorSource.getFeaturesInExtent([0, 0, 1, 1])).
            to.have.length(9);
        features[0].getGeometry().setCoordinates([0.5, 0.5]);
        expect(vectorSource.getFeaturesInExtent([0, 0, 1, 1])).
            to.have.length(10);
      });

    });

    describe('setting a features geometry', function() {

      it('keeps the R-Tree index up to date', function() {
        expect(vectorSource.getFeaturesInExtent([0, 0, 1, 1])).
            to.have.length(10);
        features[0].setGeometry(new _ol_geom_Point_([100, 100]));
        expect(vectorSource.getFeaturesInExtent([0, 0, 1, 1])).
            to.have.length(9);
      });

    });

  });

  describe('tracking changes to features', function() {

    var vectorSource;
    beforeEach(function() {
      vectorSource = new _ol_source_Vector_();
    });

    it('keeps its index up-to-date', function() {
      var feature = new _ol_Feature_(new _ol_geom_Point_([1, 1]));
      vectorSource.addFeature(feature);
      expect(vectorSource.getFeaturesInExtent([0, 0, 2, 2])).
          to.eql([feature]);
      feature.getGeometry().setCoordinates([3, 3]);
      expect(vectorSource.getFeaturesInExtent([0, 0, 2, 2])).
          to.be.empty();
      expect(vectorSource.getFeaturesInExtent([2, 2, 4, 4])).
          to.eql([feature]);
    });

    it('handles features with null geometries', function() {
      var feature = new _ol_Feature_(null);
      vectorSource.addFeature(feature);
      expect(vectorSource.getFeatures()).to.eql([feature]);
    });

    it('handles features with geometries changing from null', function() {
      var feature = new _ol_Feature_(null);
      vectorSource.addFeature(feature);
      expect(vectorSource.getFeatures()).to.eql([feature]);
      feature.setGeometry(new _ol_geom_Point_([1, 1]));
      expect(vectorSource.getFeaturesInExtent([0, 0, 2, 2])).
          to.eql([feature]);
      expect(vectorSource.getFeatures()).to.eql([feature]);
    });

    it('handles features with geometries changing to null', function() {
      var feature = new _ol_Feature_(new _ol_geom_Point_([1, 1]));
      vectorSource.addFeature(feature);
      expect(vectorSource.getFeatures()).to.eql([feature]);
      expect(vectorSource.getFeaturesInExtent([0, 0, 2, 2])).
          to.eql([feature]);
      feature.setGeometry(null);
      expect(vectorSource.getFeaturesInExtent([0, 0, 2, 2])).to.be.empty();
      expect(vectorSource.getFeatures()).to.eql([feature]);
    });

    it('fires a change event when setting a feature\'s property', function() {
      var feature = new _ol_Feature_(new _ol_geom_Point_([1, 1]));
      vectorSource.addFeature(feature);
      var listener = sinon.spy();
      _ol_events_.listen(vectorSource, 'change', listener);
      feature.set('foo', 'bar');
      expect(listener).to.be.called();
    });

    it('fires a changefeature event when updating a feature', function() {
      var feature = new _ol_Feature_(new _ol_geom_Point_([1, 1]));
      vectorSource.addFeature(feature);
      var listener = sinon.spy(function(event) {
        expect(event.feature).to.be(feature);
      });
      vectorSource.on('changefeature', listener);
      feature.setStyle(null);
      expect(listener).to.be.called();
    });

  });

  describe('#getFeatureById()', function() {
    var source;
    beforeEach(function() {
      source = new _ol_source_Vector_();
    });

    it('returns a feature by id', function() {
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      expect(source.getFeatureById('foo')).to.be(feature);
    });

    it('returns a feature by id (set after add)', function() {
      var feature = new _ol_Feature_();
      source.addFeature(feature);
      expect(source.getFeatureById('foo')).to.be(null);
      feature.setId('foo');
      expect(source.getFeatureById('foo')).to.be(feature);
    });

    it('returns null when no feature is found', function() {
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      expect(source.getFeatureById('bar')).to.be(null);
    });

    it('returns null after removing feature', function() {
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      expect(source.getFeatureById('foo')).to.be(feature);
      source.removeFeature(feature);
      expect(source.getFeatureById('foo')).to.be(null);
    });

    it('returns null after unsetting id', function() {
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      expect(source.getFeatureById('foo')).to.be(feature);
      feature.setId(undefined);
      expect(source.getFeatureById('foo')).to.be(null);
    });

    it('returns null after clear', function() {
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      expect(source.getFeatureById('foo')).to.be(feature);
      source.clear();
      expect(source.getFeatureById('foo')).to.be(null);
    });

    it('returns null when no features are indexed', function() {
      expect(source.getFeatureById('foo')).to.be(null);
      source.addFeature(new _ol_Feature_());
      expect(source.getFeatureById('foo')).to.be(null);
    });

    it('returns correct feature after add/remove/add', function() {
      expect(source.getFeatureById('foo')).to.be(null);
      var first = new _ol_Feature_();
      first.setId('foo');
      source.addFeature(first);
      expect(source.getFeatureById('foo')).to.be(first);
      source.removeFeature(first);
      expect(source.getFeatureById('foo')).to.be(null);
      var second = new _ol_Feature_();
      second.setId('foo');
      source.addFeature(second);
      expect(source.getFeatureById('foo')).to.be(second);
    });

    it('returns correct feature after add/change', function() {
      expect(source.getFeatureById('foo')).to.be(null);
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      expect(source.getFeatureById('foo')).to.be(feature);
      feature.setId('bar');
      expect(source.getFeatureById('foo')).to.be(null);
      expect(source.getFeatureById('bar')).to.be(feature);
    });

  });

  describe('#loadFeatures', function() {

    describe('with the "bbox" strategy', function() {


      it('requests the view extent plus render buffer', function(done) {
        var center = [-97.6114, 38.8403];
        var source = new _ol_source_Vector_({
          strategy: _ol_loadingstrategy_.bbox,
          loader: function(extent) {
            setTimeout(function() {
              var lonLatExtent = _ol_proj_.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
              expect(lonLatExtent[0]).to.roughlyEqual(-99.261474609, 1e-9);
              expect(lonLatExtent[2]).to.roughlyEqual(-95.965576171, 1e-9);
              done();
            }, 0);
          }
        });
        var div = document.createElement('div');
        div.style.width = div.style.height = '100px';
        document.body.appendChild(div);
        var map = new _ol_Map_({
          target: div,
          layers: [
            new _ol_layer_Vector_({
              source: source
            })
          ],
          view: new _ol_View_({
            center: _ol_proj_.fromLonLat(center),
            zoom: 7
          })
        });
        map.renderSync();
        map.setTarget(null);
        document.body.removeChild(div);
      });

    });

    describe('with no loader and the "all" strategy', function() {

      it('stores the infinity extent in the Rtree', function() {
        var source = new _ol_source_Vector_();
        source.loadFeatures([-10000, -10000, 10000, 10000], 1,
            _ol_proj_.get('EPSG:3857'));
        var loadedExtents = source.loadedExtentsRtree_.getAll();
        expect(loadedExtents).to.have.length(1);
        expect(loadedExtents[0].extent).to.eql(
            [-Infinity, -Infinity, Infinity, Infinity]);
      });
    });

    describe('with setLoader', function() {

      it('it will change the loader function', function() {
        var count1 = 0;
        var loader1 = function(bbox, resolution, projection) {
          count1++;
        };
        var count2 = 0;
        var loader2 = function(bbox, resolution, projection) {
          count2++;
        };
        var source = new _ol_source_Vector_({loader: loader1});
        source.loadFeatures([-10000, -10000, 10000, 10000], 1,
            _ol_proj_.get('EPSG:3857'));
        source.setLoader(loader2);
        source.clear();
        source.loadFeatures([-10000, -10000, 10000, 10000], 1,
            _ol_proj_.get('EPSG:3857'));
        expect(count1).to.eql(1);
        expect(count2).to.eql(1);
      });

      it('removes extents with #removeLoadedExtent()', function(done) {
        var source = new _ol_source_Vector_();
        source.setLoader(function(bbox, resolution, projection) {
          setTimeout(function() {
            expect(source.loadedExtentsRtree_.getAll()).to.have.length(1);
            source.removeLoadedExtent(bbox);
            expect(source.loadedExtentsRtree_.getAll()).to.have.length(0);
            done();
          }, 0);
        });
        source.loadFeatures([-10000, -10000, 10000, 10000], 1, _ol_proj_.get('EPSG:3857'));
      });
    });

  });

  describe('the feature id index', function() {
    var source;
    beforeEach(function() {
      source = new _ol_source_Vector_();
    });

    it('ignores features with the same id', function() {
      var feature = new _ol_Feature_();
      feature.setId('foo');
      source.addFeature(feature);
      var dupe = new _ol_Feature_();
      dupe.setId('foo');
      source.addFeature(dupe);
      expect(source.getFeatures()).to.have.length(1);
      expect(source.getFeatureById('foo')).to.be(feature);
    });

    it('allows changing feature and set the same id', function() {
      var foo = new _ol_Feature_();
      foo.setId('foo');
      source.addFeature(foo);
      var bar = new _ol_Feature_();
      bar.setId('bar');
      source.addFeature(bar);
      bar.setId('foo');
      expect(source.getFeatureById('foo')).to.be(bar);
    });

  });

  describe('the undefined feature id index', function() {
    var source;
    beforeEach(function() {
      source = new _ol_source_Vector_();
    });

    it('disallows adding the same feature twice', function() {
      var feature = new _ol_Feature_();
      source.addFeature(feature);
      expect(function() {
        source.addFeature(feature);
      }).to.throwException();
    });
  });

  describe('with useSpatialIndex set to false', function() {
    var source;
    beforeEach(function() {
      source = new _ol_source_Vector_({useSpatialIndex: false});
    });

    it('returns a features collection', function() {
      expect(source.getFeaturesCollection()).to.be.a(_ol_Collection_);
    });

    it('#forEachFeatureInExtent loops through all features', function() {
      source.addFeatures([new _ol_Feature_(), new _ol_Feature_()]);
      var spy = sinon.spy();
      source.forEachFeatureInExtent([0, 0, 0, 0], spy);
      expect(spy.callCount).to.be(2);
    });

  });

  describe('with a collection of features', function() {
    var collection, source;
    beforeEach(function() {
      source = new _ol_source_Vector_({
        useSpatialIndex: false
      });
      collection = source.getFeaturesCollection();
    });

    it('creates a features collection', function() {
      expect(source.getFeaturesCollection()).to.not.be(null);
    });

    it('adding/removing features keeps the collection in sync', function() {
      var feature = new _ol_Feature_();
      source.addFeature(feature);
      expect(collection.getLength()).to.be(1);
      source.removeFeature(feature);
      expect(collection.getLength()).to.be(0);
    });

    it('#clear() features keeps the collection in sync', function() {
      var feature = new _ol_Feature_();
      source.addFeatures([feature]);
      expect(collection.getLength()).to.be(1);
      source.clear();
      expect(collection.getLength()).to.be(0);
      source.addFeatures([feature]);
      expect(collection.getLength()).to.be(1);
      source.clear(true);
      expect(collection.getLength()).to.be(0);
    });

    it('keeps the source\'s features in sync with the collection', function() {
      var feature = new _ol_Feature_();
      collection.push(feature);
      expect(source.getFeatures().length).to.be(1);
      collection.remove(feature);
      expect(source.getFeatures().length).to.be(0);
      collection.extend([feature]);
      expect(source.getFeatures().length).to.be(1);
      collection.clear();
      expect(source.getFeatures().length).to.be(0);
    });

  });

  describe('with a collection of features plus spatial index', function() {
    var collection, source;
    beforeEach(function() {
      collection = new _ol_Collection_();
      source = new _ol_source_Vector_({
        features: collection
      });
    });

    it('#getFeaturesCollection returns the configured collection', function() {
      expect(source.getFeaturesCollection()).to.equal(collection);
    });

    it('adding/removing features keeps the collection in sync', function() {
      var feature = new _ol_Feature_();
      source.addFeature(feature);
      expect(collection.getLength()).to.be(1);
      source.removeFeature(feature);
      expect(collection.getLength()).to.be(0);
    });

    it('#clear() features keeps the collection in sync', function() {
      var feature = new _ol_Feature_();
      source.addFeatures([feature]);
      expect(collection.getLength()).to.be(1);
      source.clear();
      expect(collection.getLength()).to.be(0);
      source.addFeatures([feature]);
      expect(collection.getLength()).to.be(1);
      source.clear(true);
      expect(collection.getLength()).to.be(0);
    });

    it('keeps the source\'s features in sync with the collection', function() {
      var feature = new _ol_Feature_();
      collection.push(feature);
      expect(source.getFeatures().length).to.be(1);
      collection.remove(feature);
      expect(source.getFeatures().length).to.be(0);
      collection.extend([feature]);
      expect(source.getFeatures().length).to.be(1);
      collection.clear();
      expect(source.getFeatures().length).to.be(0);
    });

  });

});
