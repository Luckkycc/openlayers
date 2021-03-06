import _ol_Feature_ from '../../../../src/ol/Feature.js';
import _ol_geom_Point_ from '../../../../src/ol/geom/Point.js';
import _ol_geom_MultiPoint_ from '../../../../src/ol/geom/MultiPoint.js';
import _ol_Map_ from '../../../../src/ol/Map.js';
import _ol_View_ from '../../../../src/ol/View.js';
import _ol_layer_Vector_ from '../../../../src/ol/layer/Vector.js';
import _ol_source_Vector_ from '../../../../src/ol/source/Vector.js';
import _ol_style_Circle_ from '../../../../src/ol/style/Circle.js';
import _ol_style_Fill_ from '../../../../src/ol/style/Fill.js';
import _ol_style_Style_ from '../../../../src/ol/style/Style.js';
import _ol_style_Stroke_ from '../../../../src/ol/style/Stroke.js';


describe('ol.rendering.style.Circle', function() {

  var map, vectorSource;

  function createMap(renderer) {
    vectorSource = new _ol_source_Vector_();
    var vectorLayer = new _ol_layer_Vector_({
      source: vectorSource
    });

    map = new _ol_Map_({
      pixelRatio: 1,
      target: createMapDiv(50, 50),
      renderer: renderer,
      layers: [vectorLayer],
      view: new _ol_View_({
        projection: 'EPSG:4326',
        center: [0, 0],
        resolution: 1
      })
    });
  }

  afterEach(function() {
    if (map) {
      disposeMap(map);
      map = null;
    }
  });

  describe('#render', function() {

    function createFeatures(multi) {
      var feature;
      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[-20, 18]]) : new _ol_geom_Point_([-20, 18])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 2,
          fill: new _ol_style_Fill_({
            color: '#91E339'
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[-10, 18]]) : new _ol_geom_Point_([-10, 18])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 4,
          fill: new _ol_style_Fill_({
            color: '#5447E6'
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[4, 18]]) : new _ol_geom_Point_([4, 18])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 6,
          fill: new _ol_style_Fill_({
            color: '#92A8A6'
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[-20, 3]]) : new _ol_geom_Point_([-20, 3])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 2,
          fill: new _ol_style_Fill_({
            color: '#91E339'
          }),
          stroke: new _ol_style_Stroke_({
            color: '#000000',
            width: 1
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[-10, 3]]) : new _ol_geom_Point_([-10, 3])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 4,
          fill: new _ol_style_Fill_({
            color: '#5447E6'
          }),
          stroke: new _ol_style_Stroke_({
            color: '#000000',
            width: 2
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[4, 3]]) : new _ol_geom_Point_([4, 3])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 6,
          fill: new _ol_style_Fill_({
            color: '#92A8A6'
          }),
          stroke: new _ol_style_Stroke_({
            color: '#000000',
            width: 3
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[-20, -15]]) : new _ol_geom_Point_([-20, -15])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 2,
          stroke: new _ol_style_Stroke_({
            color: '#256308',
            width: 1
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[-10, -15]]) : new _ol_geom_Point_([-10, -15])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 4,
          fill: new _ol_style_Fill_({
            color: 'rgba(0, 0, 255, 0.3)'
          }),
          stroke: new _ol_style_Stroke_({
            color: '#256308',
            width: 2
          })
        })
      }));
      vectorSource.addFeature(feature);

      feature = new _ol_Feature_({
        geometry: multi ? new _ol_geom_MultiPoint_([[4, -15]]) : new _ol_geom_Point_([4, -15])
      });
      feature.setStyle(new _ol_style_Style_({
        image: new _ol_style_Circle_({
          radius: 6,
          fill: new _ol_style_Fill_({
            color: 'rgba(235, 45, 70, 0.6)'
          }),
          stroke: new _ol_style_Stroke_({
            color: '#256308',
            width: 3
          })
        })
      }));
      vectorSource.addFeature(feature);
    }

    it('renders point geometries', function(done) {
      createMap('canvas');
      createFeatures();
      expectResemble(map, 'rendering/ol/style/expected/circle-canvas.png',
          8.0, done);
    });

    it('renders multipoint geometries', function(done) {
      createMap('canvas');
      createFeatures(true);
      expectResemble(map, 'rendering/ol/style/expected/circle-canvas.png',
          8.0, done);
    });

    where('WebGL').it('tests the WebGL renderer', function(done) {
      assertWebGL();
      createMap('webgl');
      createFeatures();
      expectResemble(map, 'rendering/ol/style/expected/circle-webgl.png',
          8.0, done);
    });
  });
});
