function SimulatedAnnealing(problem){
  this.problem = problem;
  this.T = 1.0;
  this.T_min = 0.000001;
  this.alpha = 0.99;
}

SimulatedAnnealing.prototype = {

  anneal : function(solution){
    var metaData = {executionTimeSeconds: null, totalIterations: null};
    var start = Date.now();
    var iterations = 0;
    var old_cost = this.problem.computeCost(solution);
    while (this.T > this.T_min){
      i = 1;
      while (i <= Math.floor(Math.log(this.problem.getAmountOfPossibleSolutions()) * 10)) {
        var new_solution = this.problem.computeNeighborSolution(solution);
        var new_cost = this.problem.computeCost(new_solution);
        var isAccepted = this.acceptanceProbability(old_cost, new_cost) > Math.random();
        if (isAccepted) {
          solution = new_solution;
          old_cost = new_cost;
        }
        ++i;
      }
      iterations += i;
      this.T = this.T * this.alpha;
    }
    metaData.executionTimeSeconds = (Date.now() - start) / 1000;
    metaData.totalIterations = iterations;
    return {solution : solution, cost: old_cost, metaData : metaData};
  },

  acceptanceProbability : function(old_cost, new_cost){
    return Math.exp((old_cost - new_cost) / this.T);
  }

};