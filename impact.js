function ImpactGraph(root, width, height, dataLoc){
	//setup canvas
	root.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(20,20)");
	
	var imgURL = "http://192.168.0.3:8080";
	var dataLoc = dataLoc;
	var g = new dagreD3.Digraph();
    var duration = 500;
	var renderer = new dagreD3.Renderer();

    //set new draw method
    var renderer = new dagreD3.Renderer();
    var oldDrawNodes = renderer.drawNodes();
    renderer.drawNodes(function(graph, root) {
        var svgNodes = oldDrawNodes(graph, root);
        svgNodes.each(function(u) { d3.select(this).classed(graph.node(u).nodeclass, true); });
        return svgNodes;
    });

//    renderer.createNodes(function (graph, svg) {
//        var nodes = svg.selectAll("g .node")
//            .data(graph.nodes(), function(d, i) { return d; });
//        var enter = nodes.enter()
//            .append("g")
//            .style("opacity", 1e-6)
//            .attr("transform", function(d) {
//                var n = graph.node(d);
//                return "translate(" + n.y0 + "," + n.x0 + ")";
//            })
//            .on("click", onClick)
//            .classed("node", true);
//
//        var update = nodes
//            .transition()
//            .duration(duration)
//            .style("opacity", 1);
//
//        var exit = nodes.exit()
//            .remove();
//        return update;
//
//    });
//
//    renderer.createEdges(function(graph, svg) {
//        var edges = svg
//            .selectAll("g .edge")
//            .data(graph.edges(), function(d) {return d;});
//
//        var enter = edges.enter()
//            .insert("g", "*")
//            .classed("edge", true)
//            .attr("transform", "translate (" + width/2 + "," + height/2 + ") scale(0,0)")
//            .style("stroke-opacity", 1e-6);
//
//        var update = edges
//            .transition()
//            .duration(duration)
//            .attr("transform", "scale(1,1)")
//            .style("stroke-opacity", 1);
//
//        var exit = edges.exit()
//            .remove();
//
//        return enter;
//    } );

    var layout = dagreD3.layout()
						.nodeSep(40)
						.rankSep(100)
                        .rankDir("BT");
	
	this.update = update;



	function update(){
		d3.xml(dataLoc, function(error, xml) {
            domNodes = xml.getElementsByTagName("node");
            for(var i=0; i<domNodes.length; ++i){
                g.addNode(domNodes[i].getAttribute("id"), parseNode(domNodes[i]));
            }

            domEdges = xml.getElementsByTagName("edge");
            for(var i=0; i<domEdges.length; ++i){
                g.addEdge(domEdges[i].getAttribute("id"), domEdges[i].getAttribute("source"), domEdges[i].getAttribute("target"))
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

    function onClick(d) {
//        console.log(d);
//        var children = g.successors(d);
//        for (var i=0; i<children.length;++i) {
//            g.delNode(children[i]);
//        }
//        var edges = g.outEdges(d);
//        for (var i=0; i < edges.length;++i) {
//            g.delEdge(edges[i]);
//        }
//        drawGraph();
    }

    function parseNode(domElement){
        var node = {};
        node.id = domElement.getAttribute("id");

        var nodeData = domElement.getElementsByTagName("data");
        for(var i=0; i<nodeData.length; ++i){
            node[nodeData[i].getAttribute("key")] = nodeData[i].innerHTML;
        }

        node.label = '<div class="impactNode"><img src="' + imgURL +
            node.elementIcon + '" />' + node.PROP_name + '</div>';
        node.nodeclass = node.INTRINSIC_STATE_AVAILABILITY;
        alert(node.nodeclass);
        node.x0 = height/2;
        node.y0 = width/2;

        return node;
    }
}