import _ol_format_XSD_ from '../../../../src/ol/format/XSD.js';


describe('ol.format.XSD', function() {

  describe('readDateTime', function() {
    it('can handle non-Zulu time zones', function() {
      var node = document.createElement('time');
      node.textContent = '2016-07-12T15:00:00+03:00';
      expect(new Date(_ol_format_XSD_.readDateTime(node) * 1000).toISOString()).to.eql('2016-07-12T12:00:00.000Z');
    });

  });

});
