/**
 * Created by Joe on 8/7/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var friendshipModel = new Schema({
    "friend1":{type:Schema.Types.ObjectId,ref: 'User'},
    "friend2":{type:Schema.Types.ObjectId,ref: 'User'},
    "connFb":{type:Boolean,default:false},
    "connLi":{type:Boolean,default:false}
});

module.exports= mongoose.model('Friendship', friendshipModel);