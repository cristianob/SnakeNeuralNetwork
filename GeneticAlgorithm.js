function getIntRandom(from, to) {
	return Math.floor((Math.random() * (to - from + 1)) + from);
}

function getFloatRandom(from, to) {
	return Math.random() * (to - from + 1) + from;
}

function GeneticAlgorithm(initialNetwork) {
	this.lastGenNetwork = initialNetwork;
	
	this.activeGeneration = 1;
	this.activeNetwork = jQuery.extend(true, {}, initialNetwork);
	this.activeNetworkMutations = 0;
	this.generationNetworks = [this.activeNetwork];

	this.maxScore = 0;
	
	this.mutate = function() {
		// Adicionar ligação, hidden, remover ligação ou remover hidden?
		var action = getIntRandom(1,10);
		
		if(action >= 1 && action <= 9) { // Adicionar ligação
			var where = getIntRandom(1, 3); // 1 - Input para Hidden1, 2 - Hidden1 para Hidden2, 3 - Hidden2 para Output
			
			if(where == 1) {
				var inputLenght = this.activeNetwork.input.length;
				var hiddenLenght = this.activeNetwork.hidden1.length;
				
				if(hiddenLenght == 0) {
					this.mutate();
					return;
				}
				
				startNode = getIntRandom(0, inputLenght - 1);
				endNode   = getIntRandom(0, hiddenLenght - 1);
				
				var newMultiplier = getFloatRandom(-1,1);
				if(!this.activeNetwork.addConnection(new Connection(this.activeNetwork.input[startNode].id, this.activeNetwork.hidden1[endNode].id, newMultiplier))){
					this.mutate();
					return;
				}
			} else if(where == 2) {
				var hidden1Lenght = this.activeNetwork.hidden1.length;
				var hidden2Lenght = this.activeNetwork.hidden2.length;
				
				if(hiddenLenght == 0) {
					this.mutate();
					return;
				}
				
				startNode = getIntRandom(0, hidden1Lenght - 1);
				endNode   = getIntRandom(0, hidden2Lenght - 1);
				
				var newMultiplier = getFloatRandom(-1,1);
				if(!this.activeNetwork.addConnection(new Connection(this.activeNetwork.hidden1[startNode].id, this.activeNetwork.hidden2[endNode].id, newMultiplier))){
					this.mutate();
					return;
				}
			} else {
				var hidden2Lenght = this.activeNetwork.hidden2.length;
				var outputLenght = this.activeNetwork.output.length;
		
				startNode = getIntRandom(0, hidden2Lenght - 1);
				endNode   = getIntRandom(0, outputLenght - 1);
				
				var newMultiplier = getFloatRandom(-1,1);
				if(!this.activeNetwork.addConnection(new Connection(this.activeNetwork.hidden2[startNode].id, this.activeNetwork.output[endNode].id, newMultiplier))){
					this.mutate();
					return;
				}
			}
		} else if(action == 10) { // Remover ligação
			var connectionsLenght = this.activeNetwork.connections.length;
			var deleteNode = getIntRandom(0, connectionsLenght - 1);
			this.activeNetwork.removeConnection(deleteNode);
		}
	}
	
	this.naturalSelection = function() {
		this.activeNetworkMutations++;

		if(this.activeNetwork.score > this.maxScore)
			this.maxScore = this.activeNetwork.score;

		if(this.activeNetworkMutations == 10) {
			if(this.generationNetworks.length == 10) {
				var maxScore = 0;
				var winnerNetwork;
				this.generationNetworks.forEach(function(network, index) {
					if(network.score > maxScore) {
						winnerNetwork = network;
						maxScore = network.score;
					}
				});
				
				this.lastGenNetwork = winnerNetwork;
				this.generationNetworks = [winnerNetwork];
			}
			
			this.activeNetwork = jQuery.extend(true, {}, this.lastGenNetwork);
			this.activeNetworkMutations = 0;
			this.activeGeneration++;

			this.generationNetworks.push(this.activeNetwork);
		}
		
		this.mutate();
	}
	
	this.getActiveNetwork = function() {
		return this.activeNetwork;
	}

}
