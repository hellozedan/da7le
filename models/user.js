/**
 * Created by ahmad on 06/06/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({
    "userName":{type:String},
    "password":{type:String},
    "token":{type:String}
    //"token":{type:String},
    //"lastLocationCoords": {
    //    type: [Number],
    //    index: "2d"
    //},
    //"fbId":{type:String},
    //"gender":{type:String},
    //"fbPhotoUrl":{type:String},
    //"fbToken":{type:String},
    //"fbFriends":{type:Schema.Types.Mixed},
    //"friends":{type:[Schema.Types.Mixed],ref: 'Friendship' },
    //"title":{
    //    type:String,
    //    description: "Title of the user"
    //},
    //"description":{
    //    type:String,
    //    description: "Brief description about the event"
    //},
    //"addedTime":{
    //    type: Date,
    //    default: Date.now,
    //    description: "Timestamp of the addition time and date"
    //},
    //"name":{type:String}
    //,
    //"lastName":{type:String},
    //"email":{type:String}
    //,
    //"token":{type:String},
    //"lastLocationCoords": {
    //    type: [Number],
    //    index: "2d"
    //},
    //"fbId":{type:String},
    //"gender":{type:String},
    //"fbPhotoUrl":{type:String},
    //"fbToken":{type:String},
    //"fbFriends":{type:Schema.Types.Mixed},
    //"friends":{type:[Schema.Types.Mixed],ref: 'Friendship' },
    //"title":{
    //    type:String,
    //    description: "Title of the event"
    //},
    //"description":{
    //    type:String,
    //    description: "Brief description about the event"
    //},
    //"addedTime":{
    //    type: Date,
    //    default: Date.now,
    //    description: "Timestamp of the addition time and date"
    //}
});

module.exports= mongoose.model('User', userModel);