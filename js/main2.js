let color = d3.scaleOrdinal(d3.schemeSet3);
color(0);
  color(1);
  color(2);
  color(3);
  color(4);
  color(5);
  color(6);
  color(7);
  color(8);
  color(9);
  color(10);



let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg
.attr("viewBox", [-width / 2, -height / 2, width, height]);


let tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
  
  
d3.json("./data/october/artists_071019.json", function(error, graph) {
  if (error) throw error;

  function distance(link) {
    // return 1 / Math.min(count(link.source), count(link.target));
    return -100;
  }
  
  function strength(link) {
    // return 1 / Math.min(count(link.source), count(link.target));
    return -200;
  }
  
  let attractForce = d3.forceManyBody().strength(20).distanceMax(500)
                       .distanceMin(100);
  let repelForce = d3.forceManyBody().strength(-200).distanceMax(500)
                     .distanceMin(100);
               
  // Simulation -> Einzelne an den Rand
  let simulation = d3.forceSimulation().alphaDecay(0.03)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("link", d3.forceLink().id(d => d.name))
      .force("x", d3.forceX().strength(0.315))
      .force("y", d3.forceY().strength(0.415))
      .force("attractForce",attractForce)
      .force("repelForce",repelForce);


  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  const R = 5;

 
  let link = svg.selectAll('line')
    .data(graph.links)
    .enter().append('line');

  link  
    .attr('class', 'links')
    .style("stroke", "rgba(224, 224, 224,1)")
  	// .on('mouseover.tooltip', function(d) {
    //   	tooltip.transition()
    //     	.duration(300)
    //     	.style("opacity", .8);
    //   	tooltip.html("Source:"+ d.source.name + 
    //                  "<p/>Target:" + d.target.name +
    //                 "<p/>Strength:"  + d.value)
    //     	.style("left", (d3.event.pageX) + "px")
    //     	.style("top", (d3.event.pageY + 10) + "px");
    // 	})
    // 	.on("mouseout.tooltip", function() {
	  //     tooltip.transition()
	  //       .duration(100)
	  //       .style("opacity", 0);
	  //   })
  		.on('mouseout.fade', fade(1))
	    .on("mousemove", function() {
	      tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 10) + "px");
	    });
;

  let node = svg.selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .attr('class', 'nodes')
    .call(d3.drag()
    	.on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  

  function tooltipContent(d){
    // return `Name: ${d.name} <br> 
    // Disziplin: ${d.discipline} <br> 
    // Gender: ${d.gender} <br> 
    // Birth Year: ${d.birthYear} <br> 
    // Birth Country: ${d.birthCountry} <br> 
    // Birth Town: ${d.birthTown} <br>
    // <img src="./assets/img/mask.png">
    // `

    return `<img src="./assets/img/mask.png">`
    
  }

  node.append('circle')
    .attr('r', R)
    // .attr("fill", function(d) { return color(d.discipline);}) 	
    .attr("fill", "black") 
    .on('mouseover.tooltip', function(d) {
      	tooltip.transition()
        	.duration(300)
        	.style("opacity", 1);
      	tooltip.html(tooltipContent(d))
        	.style("left", (d3.event.pageX) + "px")
        	.style("top", (d3.event.pageY + 10) + "px");
    	})
  	.on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function() {
        tooltip.transition()
	        .duration(100)
	        .style("opacity", 0);
	    })
  	.on('mouseout.fade', fade(1))
	    .on("mousemove", function() {
	      tooltip.style("left", (d3.event.pageX) + "px")
	        .style("top", (d3.event.pageY + 10) + "px");
	    })
    .on('dblclick',releasenode)
    

  // Labels
  let lables = node.append("text")
  .text(function(d) {
    return d.name;
  })
  .style("font-size", (d) => {
    // console.log(d);
    // return d.linkCount * 20;
  })
  .attr('x', 6)
  .attr('y', 3)
  // .on("mouseover", d => highlightLinks(d))
  // .on("mouseout", d => resetLinks(d))
  .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  function ticked() {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('transform', d => `translate(${d.x},${d.y})`);
  }

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  //d.fx = null;
  //d.fy = null;
}
function releasenode(d) {
    d.fx = null;
    d.fy = null;
}
  
  const linkedByIndex = {};
  graph.links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

  function fade(opacity) {
    return d => {
      node.style('stroke-opacity', function (o) {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        this.setAttribute('fill-opacity', thisOpacity);
        return thisOpacity;
      });

      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

    };
  }
  let sequentialScale = d3.scaleOrdinal(d3.schemeSet3)
  .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
})