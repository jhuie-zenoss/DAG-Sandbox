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
    var duration = 1500;
	var renderer = new dagreD3.Renderer();
    //set new draw method
    oldDrawNode = renderer.drawNode();
    renderer.drawNode(function(graph, u, svg) {
        oldDrawNode(graph, u, svg);
        svg.classed(graph.node(u).states.AVAILABILITY.state, true);
    });

    renderer.createNodes(function (graph, svg) {
        var nodes = svg.selectAll("g .node")
            .data(graph.nodes());
        var enter = nodes.enter()
            .append("g")
            .style("opacity", 1e-6)
            .attr("transform", function(d) {
                var n = graph.node(d);
                return "translate(" + n.y0 + "," + n.x0 + ")";
            })
            .classed("node", true);

        var update = nodes
            .transition()
            .duration(duration)
            .style("opacity", 1);
        return update;

    });

    renderer.createEdges(function(graph, svg) {
        var edges = svg
            .selectAll("g .edge")
            .data(graph.edges());

        var enter = edges
            .enter()
            .insert("g", "*")
            .classed("edge", true)
            .attr("transform", "translate (" + width/2 + "," + height/2 + ") scale(0,0)")
            .style("stroke-opacity", 1e-6);

        var update = edges
            .transition()
            .duration(duration)
            .attr("transform", "scale(1,1)")
            .style("stroke-opacity", 1);

        return enter;
    } );
    var layout = dagreD3.layout()
						.nodeSep(40)
						.rankSep(100);
	
	this.update = update;



	function update(){
		d3.json(dataLoc, function(error, json) {
			nodes = d3.entries(json.nodes);
			edges = json.edges;

			for(var i=0; i < nodes.length; ++i){
				myNode = nodes[i].value;
				myNode['label'] = '<div class="impactNode"><img src="' + imgURL +
                    myNode.elementIcon + '" />' + myNode.name + '</div>';
                myNode.x0 = height/2;
                myNode.y0 = width/2;
		        g.addNode(nodes[i].key, myNode);
		    }
			
			for(var i=0; i < edges.length; ++i){
				g.addEdge(edges[i].id, edges[i].to, edges[i].from);
		    }
		    
		    drawGraph();
		});
	}
	
	function drawGraph(){

		
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