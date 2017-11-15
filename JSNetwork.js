function NeuralNetwork() {
	this.input = [];
	this.hidden1 = [];
	this.hidden2 = [];
	this.output = [];
	this.nodesReferences = [];
	this.connections = [];

	this.score = 0;
	this._nextNodeId = 1;
	
	this.addInput = function(node) {
		node.id = this._nextNodeId;
		node.multiplier = 1;
		this._nextNodeId++;
		this.input.push(node);
		this.nodesReferences[node.id] = node;
		
		return node.id;
	}
	
	this.addHidden1 = function(node) {
		node.id = this._nextNodeId;
		this._nextNodeId++;
		this.hidden1.push(node);
		this.nodesReferences[node.id] = node;
		
		return node.id;
	}

	this.addHidden2 = function(node) {
		node.id = this._nextNodeId;
		this._nextNodeId++;
		this.hidden2.push(node);
		this.nodesReferences[node.id] = node;
		
		return node.id;
	}
	
	this.addOutput = function(node) {
		node.id = this._nextNodeId;
		node.multiplier = 1;
		this._nextNodeId++;
		this.output.push(node);
		this.nodesReferences[node.id] = node;
		
		return node.id;
	}
	
	this.addConnection = function(connection) {
		var exists = false;
		this.connections.forEach(function(existantConnection, index) {
			if(connection.inputNode == existantConnection.inputNode && connection.outputNode == existantConnection.outputNode)
				exists = true;
		});

		if(exists)
			return false;

		this.connections.push(connection);
		return true;
	}
	
	this.removeConnection = function(index) {
		this.connections.splice(index, 1);
	}
	
	this.activate = function(inputActivation) {
		var self = this;
		
		// Resetamos os nos
		this.nodesReferences.forEach(function(node, index) {
			node.value = 0;
		});
		
		// Ativamos os inputs
		this.input.forEach(function(inputNode, index) {
			inputNode.value = inputActivation[index];
		});
		
		// Resolvemos as conexoes
		this.connections.forEach(function(connection, index) {
			self.nodesReferences[ connection.outputNode ].value += self.nodesReferences[ connection.inputNode ].value * connection.multiplier;
			
			// Squishify
			self.nodesReferences[ connection.outputNode ].value = (2 / (1 + Math.pow(Math.E, -self.nodesReferences[ connection.outputNode ].value))) - 1;
		});
		
		// Retornamos a saida
		returnValues = [];
		this.output.forEach(function(outputNode, index) {
			returnValues.push(outputNode.value);
		});
		
		return returnValues;
	}
	
	this.drawToCanvas = function(canvas) {
		var self = this;
		var context = canvas.getContext("2d");
		var yPos = 30;
		
		context.fillStyle='#FFFFFF';
	        context.fillRect(0,0,canvas.width,canvas.height);
		context.font = "11px Arial";

		inputNodeX = 60;
		hidden1NodeX = 250;
		hidden2NodeX = 430;
		outputNodeX = 620;
		
		// Draw inputs
		this.input.forEach(function(inputNode, index) {
			var color = Math.abs(Math.round(inputNode.value * 255));
			var colorString = color.toString(16);
			if(colorString.length == 1)
				colorString = "0" + colorString;
			
			if(inputNode.value >= 0) {
				context.fillStyle = "#0000" + colorString;
			} else {
				context.fillStyle = "#"+ colorString + "0000";
			}

			context.beginPath();
			context.arc(inputNodeX, yPos, 10, 0, 2 * Math.PI, false);
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#444444';
			context.stroke();

			context.fillText(inputNode.value, inputNodeX+20,yPos+5);

			if(inputNode.label != "")
				context.fillText(inputNode.label,0,yPos+5);
			
			inputNode.canvasX = inputNodeX;
			inputNode.canvasY = yPos;
			
			yPos += 30;
		});
		
		// Draw hidden 1
		var yPos = 30;
		this.hidden1.forEach(function(hiddenNode, index) {
			var color = Math.abs(Math.round(hiddenNode.value * 255));
			var colorString = color.toString(16);
			if(colorString.length == 1)
				colorString = "0" + colorString;
			
			if(hiddenNode.value >= 0) {
				context.fillStyle = "#0000" + colorString;
			} else {
				context.fillStyle = "#"+ colorString + "0000";
			}
			
			context.beginPath();
			context.arc(hidden1NodeX, yPos, 10, 0, 2 * Math.PI, false);
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#444444';
			context.stroke();

			context.fillText(hiddenNode.value,hidden1NodeX+20,yPos+5);
			
			hiddenNode.canvasX = hidden1NodeX;
			hiddenNode.canvasY = yPos;
			
			yPos += 30;
		});

		// Draw hidden 2
		var yPos = 30;
		this.hidden2.forEach(function(hiddenNode, index) {
			var color = Math.abs(Math.round(hiddenNode.value * 255));
			var colorString = color.toString(16);
			if(colorString.length == 1)
				colorString = "0" + colorString;
			
			if(hiddenNode.value >= 0) {
				context.fillStyle = "#0000" + colorString;
			} else {
				context.fillStyle = "#"+ colorString + "0000";
			}
			
			context.beginPath();
			context.arc(hidden2NodeX, yPos, 10, 0, 2 * Math.PI, false);
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#444444';
			context.stroke();

			context.fillText(hiddenNode.value,hidden2NodeX+20,yPos+5);
			
			hiddenNode.canvasX = hidden2NodeX;
			hiddenNode.canvasY = yPos;
			
			yPos += 30;
		});
		
		// Draw output
		var yPos = 30;
		
		this.output.forEach(function(outputNode, index) {
			var color = Math.abs(Math.round(outputNode.value * 255));
			var colorString = color.toString(16);
			if(colorString.length == 1)
				colorString = "0" + colorString;
			
			if(outputNode.value >= 0) {
				context.fillStyle = "#0000" +colorString;
			} else {
				context.fillStyle = "#"+ colorString + "0000";
			}
			
			context.beginPath();
			context.arc(outputNodeX, yPos, 10, 0, 2 * Math.PI, false);
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#444444';
			context.stroke();

			context.font = "11px Arial";
			context.fillText(outputNode.value,outputNodeX+20,yPos+5);

			if(outputNode.label != "") {
				context.font = "25px Arial";
				context.fillText(outputNode.label,outputNodeX-40,yPos+5);
			}
			
			outputNode.canvasX = outputNodeX;
			outputNode.canvasY = yPos;
			
			yPos += 30;
		});
		
		// Draw connections
		this.connections.forEach(function(connection, index) {
			context.beginPath();
			context.moveTo(self.nodesReferences[connection.inputNode].canvasX,self.nodesReferences[connection.inputNode].canvasY);
			context.lineTo(self.nodesReferences[connection.outputNode].canvasX,self.nodesReferences[connection.outputNode].canvasY);
			context.stroke();
		});
	}
}

function Node(label) {
	this.label = label;
	if(this.label == undefined)
		this.label = "";

	this.id = 0;
	this.value = 0;
	
	this.canvasX = 0;
	this.canvasY = 0;
}

function Connection(inputNode, outputNode, multiplier) {
	this.inputNode = inputNode;
	this.outputNode = outputNode;
	this.multiplier = multiplier;
}
