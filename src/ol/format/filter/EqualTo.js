/**
 * @module ol/format/filter/EqualTo
 */
import {inherits} from '../../index.js';
import _ol_format_filter_ComparisonBinary_ from '../filter/ComparisonBinary.js';

/**
 * @classdesc
 * Represents a `<PropertyIsEqualTo>` comparison operator.
 *
 * @constructor
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!(string|number)} expression The value to compare.
 * @param {boolean=} opt_matchCase Case-sensitive?
 * @extends {ol.format.filter.ComparisonBinary}
 * @api
 */
var _ol_format_filter_EqualTo_ = function(propertyName, expression, opt_matchCase) {
  _ol_format_filter_ComparisonBinary_.call(this, 'PropertyIsEqualTo', propertyName, expression, opt_matchCase);
};

inherits(_ol_format_filter_EqualTo_, _ol_format_filter_ComparisonBinary_);
export default _ol_format_filter_EqualTo_;
