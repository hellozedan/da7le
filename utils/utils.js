var Utils = {};
Utils.randomIntInc = function(low, high) {
	    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = Utils;