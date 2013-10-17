function ImpactGraph(root, width, height, dataLoc){
	//setup canvas
	root.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(20,20)");
	
	var imgURL = "http://192.168.0.4:8080";
	var dataLoc = dataLoc;
	var g = new dagreD3.Digraph();
	var renderer = new dagreD3.Renderer();
	var layout = dagreD3.layout()
						.nodeSep(40)
						.rankSep(100);
	
	this.update = update;
	
	function update(){
		d3.json(dataLoc, function(json, error) {
			nodes = d3.entries(json.nodes);
			edges = json.edges;

			for(var i=0; i < nodes.length; ++i){
				myNode = nodes[i].value;
				myNode['label'] = '<div class="impactNode"><img src="' + imgURL + myNode.elementIcon + '" />' + myNode.name + '</div>';
		        g.addNode(nodes[i].key, myNode);
		    }
			
			for(var i=0; i < edges.length; ++i){
				g.addEdge(edges[i].id, edges[i].to, edges[i].from);
		    }
		    
		    drawGraph();
		});
	}
	
	function drawGraph(){
		//set new draw method
		oldDrawNode = renderer.drawNode();
		renderer.drawNode(function(graph, u, svg) {
		    oldDrawNode(graph, u, svg);
		    svg.classed(graph.node(u).states.AVAILABILITY.state, true);
		});
		
	    // Cleanup old graph
	    var svg = d3.select("svg");   
	    renderer.layout(layout).run(g, svg.select("g"));

		 // Add zoom behavior
		 svg.call(d3.behavior.zoom().on("zoom", function() {
		   svg.select("g")
		      .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
		 }));
	}
}