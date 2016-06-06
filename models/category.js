/**
 * Created by ahmad on 06/06/2016.
 */
/**
 * Created by Joe on 06/06/2015.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var categoryModel = new Schema({
	"name": {
		type: String
	}
	//"ts":{
	//	type: Date,
	//    default: Date.now,
	//    description: "Timestamp of the track date/time"
	//},
});

module.exports= mongoose.model('Category', categoryModel);
