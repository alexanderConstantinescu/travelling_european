function TSP(costMatrix){
  this.costMatrix = costMatrix;
}

TSP.prototype = {

  // ---Construction Heuristics---

  // Random solution
  computeRandomSolution : function(startNode) {
    var randomSolution = function(distances) {return distances[Math.floor(Math.random()*distances.length)].distance;};
    return this.greedySolve(startNode, randomSolution);
  },

  // Greedy constructive solution
  computeNearestNeighbourSolution : function(startNode){
    var nearestNeighborSolution = function(tempDistances) {return Math.min.apply(Math, tempDistances.map(function(dist){ return dist.distance;}));};
    return this.greedySolve(startNode, nearestNeighborSolution);
  },

  computeTwiceAroundTheTreeSolution : function(){
    var eulerianCircuit = tsp.generateEulerianCircuit();
    var treeSolution = [], solutionCost = Infinity, possibleTreeSolution = [];

    var pivotIndex = Math.floor(eulerianCircuit.length / 2);
    for (var i = 0; i < pivotIndex; i++) {
      for (var j = 0; j < eulerianCircuit.length; j++) {
        if ((i === 0 || i !== j) && possibleTreeSolution.indexOf(eulerianCircuit[j]) === -1){
          possibleTreeSolution.push(eulerianCircuit[j]);
        }
      }
      var posssibleSolutionCost = this.computeCost(possibleTreeSolution);
      if (posssibleSolutionCost < solutionCost) {
        solutionCost = posssibleSolutionCost;
        treeSolution = possibleTreeSolution;
        possibleTreeSolution = [];
      }
    }
    return treeSolution;
  },

  computeChristofidesSolution : function(){

  },

  computeBranchAndBoundSolution : function(){

  },

  generateEulerianCircuit : function () {
    var minimumSpanningTree = this.generateMinimumSpanningTree();
    var minimumSpanningPath = minimumSpanningTree.postOrderWalk(); // Or pre-order walk, heck maybe even a DFS
    var reversedSpanningTreePath = this.reverseArray(minimumSpanningPath);
    reversedSpanningTreePath.splice(0,1);
    return Array.prototype.concat.apply([], [minimumSpanningTree, reversedSpanningTree]);
  },

  reverseArray : function (arrayInput) {
    var ret = [];
    for(var i = arrayInput.length-1; i >= 0; i--) {
        ret.push(arrayInput[i]);
    }
    return ret;
  },

  // Implementation of the Prim's algorithm
  generateMinimumSpanningTree : function(){

    var minimumSpanningTree = new Tree();
    var possibleVertices = [];
    var minVal = Infinity, I, J, E, P;

    for (var i = 0; i < this.costMatrix.length; i++) {
      possibleVertices.push(i);
      for (var j = 0; j < this.costMatrix[i].length; j++) {
        if (this.costMatrix[i][j] < minVal) {
          minVal = this.costMatrix[i][j];
          I = i;
          J = j;
        }
      }
    }

    var Ivertice = minimumSpanningTree.addVertice(new Vertice(I));
    var Jvertice = minimumSpanningTree.addVertice(new Vertice(J));
    Ivertice.addEdge(Jvertice, minVal);

    possibleVertices.splice(possibleVertices.indexOf(I),1);
    possibleVertices.splice(possibleVertices.indexOf(J),1);
    minVal = Infinity;

    var treeLength = possibleVertices.length;
    for (var unused = 0; unused < treeLength; unused++) {
      for (var v = 0; v < minimumSpanningTree.vertices.length; v++) {
        for (var p = 0; p < possibleVertices.length; p++) {
          if (this.costMatrix[minimumSpanningTree.vertices[v].id][possibleVertices[p]] < minVal) {
            minVal = this.costMatrix[minimumSpanningTree.vertices[v].id][possibleVertices[p]];
            E = minimumSpanningTree.vertices[v].id;
            P = possibleVertices[p];
          }
        }
      }
      var Evertice = minimumSpanningTree.addVertice(new Vertice(E));
      var Pvertice = minimumSpanningTree.addVertice(new Vertice(P));
      Evertice.addEdge(Pvertice, minVal);
      minVal = Infinity;
      possibleVertices.splice(possibleVertices.indexOf(P),1);
    }

    return minimumSpanningTree;
  },


  greedySolve : function(startNode, cb){
    var greedySolution = [], cost = Infinity;
    if (startNode !== undefined) {
      greedySolution = this.greedyTraverseGraph(startNode, cb);
    } else {
      for (var solutionStartNode = 0; solutionStartNode < this.costMatrix.length; solutionStartNode++) {
        var tmpSolution = this.greedyTraverseGraph(solutionStartNode, cb);
        var tmpCost = this.computeCost(tmpSolution);
        if (tmpCost < cost) {
          greedySolution = tmpSolution;
          cost = tmpCost;
        }
      }
    }
    return greedySolution;
  },

  greedyTraverseGraph : function(startNode, cb){
    var solution = [startNode];
    for (var row = 0; row < this.costMatrix.length - 1; row++) {
      var tempDistances = [];
      for (var column = 0; column < this.costMatrix[startNode].length; column++) {
        if (startNode !== column && solution.indexOf(column) === -1) {
          tempDistances.push({distance : this.costMatrix[startNode][column], id : column});
        }
      }
      var distElement = cb(tempDistances);
      var nodeElement = tempDistances.filter(function(distanceElement){ return distanceElement.distance === distElement;})[0];
      solution.push(nodeElement.id);
      startNode = nodeElement.id;
    }
    solution.push(solution[0]);
    return solution;
  },

  // ---Improvement Heuristics---
  computeNeighborSolution : function(solution) {
    var newSolution = JSON.parse(JSON.stringify(solution));
    return this.randomGeneralThreePairSwap(newSolution);
  },

  randomAdjacentPairSwap : function(solution){
    var swapNode = Math.round(Math.random() * (solution.length - 1));
    if (Math.round(Math.random())) {
      if (swapNode === solution.length - 1) { this.generalPairWiseSwap(solution, swapNode, 0); }
      else { this.adjacentForwardPairWise(solution, swapNode); }
    } else {
      if (swapNode === 0) {this.generalPairWiseSwap(solution, swapNode, solution.length - 1); }
      else { this.adjacentBackwardPairWise(solution, swapNode); }
    }
    return solution;
  },

  randomAdjacentThreePairSwap : function(solution){
   // TODO
  },

  randomGeneralPairSwap : function(solution){
    var swapNode1 = Math.round(Math.random() * (solution.length - 1));
    var swapNode2 = Math.round(Math.random() * (solution.length - 1));
    if (swapNode1 !== swapNode2) {
      this.generalPairWiseSwap(solution, swapNode1, swapNode2);
    } else {
      this.randomGeneralPairSwap(solution);
    }
    return solution;
  },

  randomGeneralThreePairSwap : function(solution){
    var swapNode1 = Math.round(Math.random() * (solution.length - 1));
    var swapNode2 = Math.round(Math.random() * (solution.length - 1));
    var swapNode3 = Math.round(Math.random() * (solution.length - 1));
    if (swapNode1 !== swapNode2 && swapNode2 !== swapNode3 && swapNode1 !== swapNode3) {
      this.generalPairWiseSwap(solution, swapNode1, swapNode2);
      this.generalPairWiseSwap(solution, swapNode2, swapNode3);
    } else {
      this.randomGeneralThreePairSwap(solution);
    }
    return solution;
  },

  adjacentThreeOptSwap : function(solution, swapNode){
    this.adjacentForwardPairWise(solution, swapNode);
    this.adjacentBackwardPairWise(solution, swapNode);
  },

  adjacentForwardPairWise : function(solution, swapNode){
    this.swap(solution, swapNode, swapNode+1);
  },

  adjacentBackwardPairWise : function(solution, swapNode){
    this.swap(solution, swapNode, swapNode-1);
  },

  generalPairWiseSwap : function(solution, sourceNode, targetNode){
    this.swap(solution, sourceNode, targetNode);
  },

  swap : function(solution, sourceNode, targetNode){
    var temp = solution[sourceNode];
    solution[sourceNode] = solution[targetNode];
    solution[targetNode] = temp;
  },

  getAmountOfPossibleSolutions : function() {
    // Implementation of (n-1)!
    var solutionAmount = 1;
    for (var i = 1; i <= this.costMatrix.length - 1; i++) {
      solutionAmount = solutionAmount*i;
    }
    return solutionAmount;
  },

  computeSearchSpace : function() {
    // TODO ... or TO-NEVER-DO?
  },

  computeCost : function(solution) {
    var cost = 0;
    for (var i = 0; i < solution.length; i++) {
      if (i+1 !== solution.length) {
        cost += this.costMatrix[solution[i]][solution[i+1]];
      }
    }
    return cost;
  }
};