// See example: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
// Disjoint Force-Directed Graph: https://observablehq.com/@d3/disjoint-force-directed-graph
// Beziers: https://observablehq.com/@rusackas/force-graph-with-bezier-links


// ToDos
// 1. Dreiecke malen
// 2. Bezier connections
// 3. Unvernetzte besser darstellen
// 4. Github bei Steph installieren
// 5. Kleiner Intro-Text


var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

let color = d3.scaleOrdinal(d3.schemeCategory20);

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(300)) // distance is length of links
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

// let simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(d => d.name))
//     .force("charge", d3.forceManyBody())
//     .force("x", d3.forceX())
//     .force("y", d3.forceY());

d3.json("./data/artists.json", function(error, graph) {
  if (error) throw error;

  let link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value) * 1; })
      .attr("stroke-linecap", "round");
      // .style("stroke-dasharray", function(d) { return d.value === 5 ? ("3, 3") : ("0, 0") } );


  let node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")
    
  // let circles = node.append("circle")
  //     .attr("r", 5)
  //     .attr("fill", function(d) { return color(d.discipline); })
  //     .call(d3.drag()
  //         .on("start", dragstarted)
  //         .on("drag", dragged)
  //         .on("end", dragended));

  let rects = node.append("rect")
        .attr("width", 5)
        .attr("height", 20)
        .attr("x", -5)
        .attr("y", -5)
        .attr("stroke", function(d) { return color(d.discipline); })
        .attr("fill", function(d) { return color(d.discipline); })
        .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
        .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

  // node.append('path')
  //       .attr("d", d3.symbolTriangle())
  //       .attr("transform", function(d) { return "translate(" + 100 + "," + 100 + ")"; })
  //       .style("fill", "red");

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

// value
// 0 -  kein Kontakt
// 5 -  bekannt. aber nicht näher
// 10 - gemeinsam ausgestellt/ aufgetreten
// 15 - gemeinsam residency/Programm
// 20 - gemeinsam kollaboriert


// discipline
// 1-  installation
// 2 - performance
// 3 - painting/ drawing
// 4 - photography
// 5 - collage
// 6 - sculpture
// 7 - sound/ music
// 8 - poetry
// 9 - film
