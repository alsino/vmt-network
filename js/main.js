// See example: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
// Disjoint Force-Directed Graph: https://observablehq.com/@d3/disjoint-force-directed-graph
// Beziers: https://observablehq.com/@rusackas/force-graph-with-bezier-links
// Draw triangles: https://stackoverflow.com/questions/43174396/how-to-draw-the-triangle-symbol/43174450
// Other shapes: https://bl.ocks.org/feyderm/4d143591b66725aed0f1855444752fd9


// ToDos
// Bezier connections
// Unvernetzte besser darstellen
// Github bei Steph installieren
// Kleiner Intro-Text


let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let color = d3.scaleOrdinal(d3.schemeCategory20);

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(100)) // distance is length of links
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

// let simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(d => d.name).distance(500))
//     .force("charge", d3.forceManyBody())
//     .force("center", d3.forceCenter(width / 2, height / 2))
//     .force("x", d3.forceX())
//     .force("y", d3.forceY());

d3.json("./data/artists_140819.json", function(error, graph) {
  if (error) throw error;

  let link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value) * 0.1; })
      .attr("stroke-linecap", "round");
      // .style("stroke-dasharray", function(d) { return d.value === 5 ? ("3, 3") : ("0, 0") } );

  let node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g");

  console.log(graph.nodes);

  // Circles
  node
    .filter(function(d){ return d.discipline == 3;})
    .append("circle")
    .attr("r", 5)
    .attr("fill", "black")
    .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
    .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


  // Diamonds
  let diamond = d3.symbol()
  .type(d3.symbolDiamond)
  .size(100);

  node
    .filter(function(d){ return d.discipline == 1; })
    .append('path')
    .attr('d', diamond)
    .attr("class", "triangle")
    .style("stroke", "white")
    .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
    .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


  // Triangles
  let tri = d3.symbol()
  .type(d3.symbolTriangle)
  .size(100);

  node
    .filter(function(d){ return d.discipline == 7; })
    .append('path')
    .attr('d', tri)
    .attr("class", "triangle")
    .style("stroke", "white")
    .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
    .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

     
  // Rectangles
  let rectWidth = 8;

  node
    .filter(function(d){ return d.discipline == 9; })
    .append("rect")
      .attr("width", rectWidth)
      .attr("height", rectWidth)
      .attr("x", -rectWidth / 2)
      .attr("y", -rectWidth / 2)
      // .attr("stroke", function(d) { return color(d.discipline); })
      // .attr("fill", function(d) { return color(d.discipline); })
      .attr("stroke", "white")
      .attr("fill", "black")
      .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
      .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  // Labels
  let lables = node.append("text")
      .text(function(d) {
        return d.name;
      })
      .attr('x', 6)
      .attr('y', 3)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

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
  d.fx = null;
  d.fy = null;
}


// Kommentare:
// ----------

// LATEST
// discipline
// 1 - installation
// 2 - performance
// 3 - painting / drawing/graphic
// 4 - photography
// 5 - collage
// 6 - sculpture
// 7 - music / sound
// 8 - writing
// 9 - film
//10 – conceptual art / mixed media
//11 – generative art


// connections

// A /  0: no contact 
// B /  5: I know her/him, but not closer
// C / 10: We’ve exhibited together / We’ve been on stage together
// D / 15: We’ve been together in a residency / program
// E / 20: I’ve been in her/his studio
// F / 25: We’ve collaborated on a project / art piece 
// G / 30: We know each other / We are friends 
