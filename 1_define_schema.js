// Define Schema to MongoDB

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({ 
	Name: {type:String, index:1, requirea:true, unique:true},
	Id: {type:String, index:1, unique:true, required: true},
	url: {type:String},
	Color: {type:String}
}, {collection: 'Pictures'});

var User = mongoose.model('User', userSchema); 

module.exports = User;