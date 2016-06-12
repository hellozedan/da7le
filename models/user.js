/**
 * Created by ahmad on 06/06/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({
    "fbUserId":{type:String,required: true},
    "fbToken":{type:String,required: true},
    "token":{type:String},
    "notification_token":{type:String,required: true},
    "first_name":{type:String},
    "last_name":{type:String},
    create_date: { type: Date, default: Date.now, required: true },
    fbPhotoUrl : {type:String},
    fbCoverPhotoUrl: {type:String},
    gender : {type:String},
    fireToken:{type:String},
    isNeedLogin:{type:Boolean}
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