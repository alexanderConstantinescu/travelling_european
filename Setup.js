function Setup(json) {
  this.json = json;
}

Setup.prototype = {
  jsonToMDim : function() {
    var mDim = [];
    for (var i = 0; i < this.json.length; i++) {
      var innerArray = [];
      for (var key in this.json[i]) {
        if (key !== 'Distance') {
          innerArray.push(this.json[i][key]);
        }
      }
      mDim.push(innerArray);
    }
    return mDim;
  },

  getIndices : function(){
    var indices = [];
    for (var i = 0; i < this.json.length; i++) {
      indices.push({'idx' : i, 'element' : this.json[i].Distance});
    }
    return indices;
  }
};