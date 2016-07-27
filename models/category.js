/**
 * Created by ahmad on 06/06/2016.
 */
/**
 * Created by Joe on 06/06/2015.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var categoryModel = new Schema({
	name: {
		type: String
	},
	image_url: {
		type: String
	}
});

module.exports= mongoose.model('Category', categoryModel);
