function TSP(costMatrix){
  this.costMatrix = costMatrix;
}

TSP.prototype = {

  // ---Construction Heuristics---

  // Random solution
  initRandomSolution : function(startNode) {
    var randomSolution = function(distances) {return distances[Math.floor(Math.random()*distances.length)].distance;};
    return this.greedySolve(startNode, randomSolution);
  },

  // Greedy constructive solution
  initNearestNeighbourSolution : function(startNode){
    var nearestNeighborSolution = function(tempDistances) {return Math.min.apply(Math, tempDistances.map(function(dist){ return dist.distance;}));};
    return this.greedySolve(startNode, nearestNeighborSolution);
  },

  initTwiceAroundTheTreeSolution : function(eulerianCircuit){

  },

  initChristofidesSolution : function(){

  },

  initBranchAndBoundSolution : function(){

  },

  generateEulerianCircuit : function (minimumSpanningTree) {
    var reversedSpanningTree = this.reverseArray(minimumSpanningTree);
    reversedSpanningTree.splice(0,1);
    return Array.prototype.concat.apply([], [minimumSpanningTree, reversedSpanningTree]);
  },

  reverseArray : function (arrayInput) {
    var ret = [];
    for(var i = arrayInput.length-1; i >= 0; i--) {
        ret.push(arrayInput[i]);
    }
    return ret;
  },

  generateMinimumSpanningTree : function(){
    // Implementation of the Prim's algorithm
    var minimumSpanningTree = [], possibleEdges = [];
    var minVal = Infinity, I = Infinity, J = Infinity;

    for (var i = 0; i < this.costMatrix.length; i++) {
      possibleEdges.push(i);
      for (var j = 0; j < this.costMatrix[i].length; j++) {
        if (this.costMatrix[i][j] < minVal) {
          minVal = this.costMatrix[i][j];
          I = i;
          J = j;
        }
      }
    }

    minimumSpanningTree = [I, J];
    possibleEdges.splice(possibleEdges.indexOf(I),1);
    possibleEdges.splice(possibleEdges.indexOf(J),1);
    minVal = Infinity;
    var tree_length = possibleEdges.length;

    for (var unused = 0; unused < tree_length; unused++) {
      for (var e = 0; e < minimumSpanningTree.length; e++) {
        for (var p = 0; p < possibleEdges.length; p++) {
          if (this.costMatrix[minimumSpanningTree[e]][possibleEdges[p]] < minVal) {
            minVal = this.costMatrix[minimumSpanningTree[e]][possibleEdges[p]];
            E = minimumSpanningTree[e];
            P = possibleEdges[p];
          }
        }
      }
      minVal = Infinity;
      minimumSpanningTree.push(P);
      possibleEdges.splice(possibleEdges.indexOf(P),1);
    }

    return minimumSpanningTree;
  },

  greedySolve : function(startNode, cb){
    var solution = [];
    solution.push(startNode);
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
    // Implementation of !(n-1)
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
      if (i+1 === solution.length) {
        cost += this.costMatrix[solution[i]][solution[0]];
      } else{
        cost += this.costMatrix[solution[i]][solution[i+1]];
      }
    }
    return cost;
  }
};