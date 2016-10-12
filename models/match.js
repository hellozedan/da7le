/**
 * Created by ahmad on 06/06/2015.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var matchModel = new Schema({
	"match": {
		type: Schema.Types.Mixed,
		description: "match data"
	},
	"user_id": {
		type: Schema.Types.ObjectId,
		description: "match data"
	}

});

//this will expose the the "matchModel" we defined above under the name "match" to other JS files to use it under node.js
module.exports = mongoose.model('match', matchModel);