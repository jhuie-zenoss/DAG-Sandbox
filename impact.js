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
	
	//generate a JS Object from XML
	function generateNode(e){
	    var myNode = {"depth": 0, "depthIndex": 0, "states":{}};
	    for(var i=0; i < e.attributes.length; ++i){
	        var attrib = e.attributes[i];
	        myNode[attrib.name] = attrib.value;
	    }
	    
	    stateNodes = e.getElementsByTagName("states")[0].childNodes;
	    for(var i=0; i < stateNodes.length; ++i){
	        if(stateNodes[i].nodeType == 1){
	      	  myNode["states"][stateNodes[i].nodeName] = {};
	            for(var j=0; j < stateNodes[i].attributes.length; ++j){
	                var attrib = stateNodes[i].attributes[j];
	                myNode['states'][stateNodes[i].nodeName][attrib.name] = attrib.value;
	            }
	        }
	    }
	    
	    myNode['label'] = '<div class="impactNode"><img src="' + imgURL + myNode.elementIcon + '" />' + myNode.name + '</div>';
	    
	    return myNode;
	}

	//generate an Edge Object from XML
	function generateLink(e){
	    var myLink = {};
	    myLink["source"] = g.node(e.getAttribute("from"));
	    myLink["target"] = g.node(e.getAttribute("to"));
	    return myLink;
	}
}