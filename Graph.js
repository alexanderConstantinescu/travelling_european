function Tree() {
  this.vertices = [];
}

Tree.prototype.findRoot = function() {

};

Tree.prototype.preOrder = function() {

};

Tree.prototype.dfs = function() {
  var visitedVertices = [], stack = [];
  var vertex = this.findRoot();
  var isVertexUnvisited = function(id) {return visitedVertices.indexOf(id) === -1;};
  return this.dfsWalk(visitedVertices, stack, vertex, isVertexUnvisited);
};

// DFS walk implementation with nearest neighbour visit
Tree.prototype.dfsWalk = function(visitedVertices, stack, vertex, isVertexUnvisited) {
  if (isVertexUnvisited(vertex)) {
    visitedVertices.push(vertex.id);
    stack.push(vertex.id);
  }

  var minimumCost = Infinity, nextVertex;

  for (var i = 0; i < vertex.edges.length; i++) {
    if (vertex.edges[i].cost < minimumCost && isVertexUnvisited(vertex.edges[i].id)) {
      minimumCost = vertex.edges[i].cost;
      nextVertex = vertex.edges[i].id;
    }
  }

  if (isVertexUnvisited(vertex.edges[i].id) && nextVertex !== undefined) {
    this.dfsWalk(visitedVertices, nextVertex);
  } else if (stack.length > 0) {
    stack.pop(vertex);
    this.dfsWalk(visitedVertices, stack[stack.length-1]);
  } else {
    return visitedVertices;
  }
};

Tree.prototype.computeWeight = function() {
  var weight;
  this.vertices.forEach(function(vertex) {
    vertex.edges.forEach(function(edge) {
      weight += edge.cost;
    });
  });
  return weight;
};

Tree.prototype.addVertex = function(vertex) {
  var foundVertex = this.vertices.filter(function(searchVertex){ return searchVertex.id === vertex.id; });
  if (foundVertex.length <= 0) {
    this.vertices.push(vertex);
    return vertex;
  }
  return foundVertex[0];
};

Tree.prototype.removeVertex = function(vertex) {
  if (this.vertices.indexOf(vertex) >= 0) {
    this.vertices.splice(foundVertexIdx, 1);
  }
};

Tree.prototype.hasEulerianCycle = function(){
  return this.vertices.every(function(vertex) {
    return (this.getVertexDegree(vertex) % 2) === 0;
  }.bind(this));
};

Tree.prototype.getVertexDegree = function(vertex) {
  return this.getOutDegree(vertex) + 1; // Add plus one for the in degree, as we are dealing with a tree.
};


Tree.prototype.getOutDegree = function(vertex) {
  var foundVertex = this.vertices.filter(function(searchVertex){ return searchVertex.id === vertex.id; });
  if (foundVertex.length > 0) {
    return foundVertex[0].edges.length;
  }
  throw new Error("Vertex: " + vertex + " is not included in the tree");
};


// ----------------------------------------------

function Vertex(id) {
  this.id = id;
  this.edges = [];
}

Vertice.prototype.addEdge = function(toId, cost) {
  this.edges.push({to : toId, cost: cost});
};

Vertice.prototype.removeEdge = function(id) {
  var removalEdge = this.edges.filter(function(edge){return edge.to === id; });
  if (removalEdge > 0) {
    this.edges.splice(this.edges.indexOf(removalEdge),1);
  }
};