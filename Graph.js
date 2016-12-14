function Tree() {
  this.vertices = [];
}

Tree.prototype.dfsWalk = function() {
  // body...
};

Tree.prototype.preOrderWalk = function() {
  // body...
};

Tree.prototype.postOrderWalk = function() {
  // body...
};

Tree.prototype.buildPath = function() {
  // body...
};

Tree.prototype.computeWeight = function() {
  var weight;
  this.vertices.forEach(function(vertice) {
    vertices.edges.forEach(function(edge) {
      weight += edge.cost;
    });
  });
  return weight;
};

Tree.prototype.addVertice = function(vertice) {
  var foundVertice = this.vertices.filter(function(searchVertice){ return searchVertice.id === vertice.id; });
  if (foundVertice.length <= 0) {
    this.vertices.push(vertice);
    return vertice;
  }
  return foundVertice[0];
};


// ----------------------------------------------

function Vertice(id) {
  this.id = id;
  this.edges = [];
}

Vertice.prototype.addEdge = function(toId, cost) {
  this.edges.push({to : toId, cost: cost});
};

Vertice.prototype.removeEdge = function(id) {
  var removalEdge = this.edges.filter(function(edge){return edge.to == id; });
  this.edges.splice(this.edges.indexOf(removalEdge),1);
};