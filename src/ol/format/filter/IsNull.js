/**
 * @module ol/format/filter/IsNull
 */
import {inherits} from '../../index.js';
import _ol_format_filter_Comparison_ from '../filter/Comparison.js';

/**
 * @classdesc
 * Represents a `<PropertyIsNull>` comparison operator.
 *
 * @constructor
 * @param {!string} propertyName Name of the context property to compare.
 * @extends {ol.format.filter.Comparison}
 * @api
 */
var _ol_format_filter_IsNull_ = function(propertyName) {
  _ol_format_filter_Comparison_.call(this, 'PropertyIsNull', propertyName);
};

inherits(_ol_format_filter_IsNull_, _ol_format_filter_Comparison_);
export default _ol_format_filter_IsNull_;
