/**
 * Created by ashraf on 19/06/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var messageModel = new Schema({
    "senderUser":{
    	 type: Schema.Types.ObjectId, 
    	 ref: 'User'  // can be system
    },
    "receiverUser":{
	   	 type: Schema.Types.ObjectId, 
	   	 ref: 'User' 
    },
//    
//    "previousMessage":{
//	   	 type: Schema.Types.ObjectId, 
//	   	 ref: 'Message' 
//    },
//    "nextMessage":{
//	   	 type: Schema.Types.ObjectId, 
//	   	 ref: 'Message' 
//    },
//    "title":{
//        type:String,
//        description: "Title of the message"
//    },
    "content":{
        type:String,
        description: "Content of the message"
	},
    "isRead":{
        type:Boolean,
    	default: false,
        description: "was read by the receiver?"
	},
    "visibleTime":{
    	type: Date,
        default: Date.now,
        description: "Timestamp of the visible time and date"
    },
    "expireTime":{
    	type: Date,
        default: Date.now,
        description: "Timestamp of the expiration time and date"
    },
    "addedTime":{
    	type: Date,
        default: Date.now,
        description: "Timestamp of the addition time and date"
    },
//    "addedBy":{
//        type:String,
//        description: "userid of the adder (or system)"
//    },
    "type":{
        type:String,
        description: "type of the message",
        default: "normal",
        enum: [
            "normal",
            "newevent",
            "participate",
            "ad",
            "friendRequest"
        ]
    },
    "customFields":
  	[{
  		type: Schema.Types.Mixed, 
  		"description": "Array of patricipating users",
	}]
 
});


//this will expose the the "messageModel" we defined above under the name "Message" to other JS files to use it under node.js
module.exports= mongoose.model('Message', messageModel);