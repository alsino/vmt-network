// See example: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
// Disjoint Force-Directed Graph: https://observablehq.com/@d3/disjoint-force-directed-graph
// Beziers: https://observablehq.com/@rusackas/force-graph-with-bezier-links
// Node size based on # links: https://stackoverflow.com/questions/38173304/d3-javascript-network-how-to-parametrize-node-size-with-the-number-of-links
// Understanding force layout: http://jsdatav.is/visuals.html?id=11550728
// No label overlap: http://bl.ocks.org/MoritzStefaner/1377729
// Link distance variable: https://stackoverflow.com/questions/14937385/how-to-vary-distance-between-d3-nodes-in-force-layout


// ToDos
// Label overlap problem lösen: http://bl.ocks.org/MoritzStefaner/1377729
// Labels on hover farbe raus
// Art der Verbindung visualisieren
// machine learning foto erkennung
// Organische leichte Bewegung
// Bezier connections


let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg
.attr("viewBox", [-width / 2, -height / 2, width, height]);

    
let color = d3.scaleOrdinal(d3.schemeCategory20);

// let simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(100)) // distance is length of links
//     .force("charge", d3.forceManyBody())
//     .force("center", d3.forceCenter(width / 2, height / 2));


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

// var simulation = d3.forceSimulation().alphaDecay(0.03)
//                  .force("link", d3.forceLink().id(d => d.name)) // between nodes
//                  .force("charge",d3.forceManyBody().distanceMax(300))  // global force
//                 //  .force("x", d3.forceX().strength(0.115))
//                 //  .force("y", d3.forceY().strength(0.115));
//                  .force("attractForce",attractForce)
//                  .force("repelForce",repelForce);
                  
let simulation = d3.forceSimulation().alphaDecay(0.03)
    .force("charge", d3.forceManyBody().strength(-200))
    .force("link", d3.forceLink().id(d => d.name))
    .force("x", d3.forceX().strength(0.215))
    .force("y", d3.forceY().strength(0.215))
    .force("attractForce",attractForce)
    .force("repelForce",repelForce);




// DATEN IN JSONLINT GECHECKT?
// HIER DIE DATEN ÄNDERN -> DATUM AUSTAUSCHEN
d3.json("./data/september/artists_050919.json", function(error, graph) {
  if (error) throw error;

  console.log(graph);

  let link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      // .attr("stroke-width", function(d) { return Math.sqrt(d.value) * 0.1; })
      .attr("stroke-linecap", "round")
      // .style("stroke", d => linkColor(d));
      .style("stroke", d => linkColorDefault(d));
      // .style("stroke-opacity", d => linkColor(d));
      // .style("stroke-dasharray", function(d) { return d.value === 5 ? ("3, 3") : ("0, 0") } );

      

      // Find number of links
      graph.links.forEach(function(link){

        // initialize a new property on the node
        if (!link.source["linkCount"]) link.source["linkCount"] = 0; 
        if (!link.target["linkCount"]) link.target["linkCount"] = 0;
      
        // count it up
        link.source["linkCount"]++;
        link.target["linkCount"]++;   
        
        // console.log(link.source);
      });
      

  let node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g");

  // console.log(graph.nodes);

  // Circles
  node
    // .filter(function(d){ return d.discipline == 3;})
    .append("circle")
    .attr("r", 5)
    // .attr("r", function(d){
    //   return d.linkCount ? (d.linkCount * 20) : 10; //<-- some function to determine radius
    //   })
    .style("fill", "black")
    // .style("stroke", "black")
    // .style("fill", d => color(d.discipline))
    // Color links on hover
    .on("mouseover", d => highlightLinks(d))
    .on("mouseout", d => resetLinks(d))
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


  // // Diamonds
  // let diamond = d3.symbol()
  // .type(d3.symbolDiamond)
  // .size(100);

  // node
  //   .filter(function(d){ return d.discipline == 1; })
  //   .append('path')
  //   .attr('d', diamond)
  //   .attr("class", "triangle")
  //   .style("stroke", "black")
  //   .style("fill", "black")
  //   .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
  //   .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
  //   .call(d3.drag()
  //       .on("start", dragstarted)
  //       .on("drag", dragged)
  //       .on("end", dragended));


  // // Triangles
  // let tri = d3.symbol()
  // .type(d3.symbolTriangle)
  // .size(100);

  // node
  //   .filter(function(d){ return d.discipline == 7; })
  //   .append('path')
  //   .attr('d', tri)
  //   .attr("class", "triangle")
  //   .style("stroke", "black")
  //   .style("fill", "black")
  //   .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
  //   .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
  //   .call(d3.drag()
  //       .on("start", dragstarted)
  //       .on("drag", dragged)
  //       .on("end", dragended));

     
  // // Rectangles
  // let rectWidth = 8;

  // node
  //   .filter(function(d){ return d.discipline == 9; })
  //   .append("rect")
  //     .attr("width", rectWidth)
  //     .attr("height", rectWidth)
  //     .attr("x", -rectWidth / 2)
  //     .attr("y", -rectWidth / 2)
  //     // .attr("stroke", function(d) { return color(d.discipline); })
  //     // .attr("fill", function(d) { return color(d.discipline); })
  //     .attr("stroke", "black")
  //     .attr("fill", "black")
  //     .on("mouseover", function(d) {return d3.select(this).style("fill", "white")})
  //     .on("mouseout", function(d) {return d3.select(this).style("fill", "black")})
  //     .call(d3.drag()
  //         .on("start", dragstarted)
  //         .on("drag", dragged)
  //         .on("end", dragended));

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
      .on("mouseover", d => highlightLinks(d))
      .on("mouseout", d => resetLinks(d))
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


  function linkColorDefault(d) {
    switch(d.value) {
      case 5:
        return "rgba(0,0,255,0)";
        break;
      case 10:
        return "rgba(224, 224, 224,1)"
        break;
      case 15:
        return "rgba(224, 224, 224,1)";
        break;
      case 20:
        return "rgba(0,0,255,0)";
        break;
      case 25:
        return "rgba(224, 224, 224,1)"; //change
        break;
      case 30:
        return "rgba(0,0,255,0)";
        break;
      default:
        return "rgba(0,0,255,0)";
    }        
}


  function linkColor(d) {
          switch(d.value) {
            case 5:
              return "rgba(0,0,255,0)";
              break;
            case 10:
              return "rgba(255, 165,104,0.5)"
              break;
            case 15:
              return "rgba(0,0,255,0.02)";
              break;
            case 20:
              return "rgba(0,0,255,0)";
              break;
            case 25:
              return "rgba(0,0,255,0.5)"; //change
              break;
            case 30:
              return "rgba(0,0,255,0)";
              break;
            default:
              return "rgba(0,0,255,0)";
          }        
  }

  function highlightLinks(d) {
    link
      .style("stroke", function(l){
        if (d === l.source || d === l.target) {

          switch(l.value) {
            case 5:
              return "rgba(0,0,255,0)";
              break;
            case 10:
              return "rgba(255, 165,104,1)"
              break;
            case 15:
              return "rgba(0,0,255,1)";
              break;
            case 20:
              return "rgba(0,0,255,0)";
              break;
            case 25:
              return "rgba(0,0,255,1)"; //change
              break;
            case 30:
              return "rgba(0,0,255,0)";
              break;
            default:
              return "rgba(0,0,255,0)";
          }
        } else {
          switch(l.value) {
            case 5:
              return "rgba(0,0,255,0)";
              break;
            case 10:
              return "rgba(224, 224, 224,1)"
              break;
            case 15:
              return "rgba(224, 224, 224,1)";
              break;
            case 20:
              return "rgba(0,0,255,0)";
              break;
            case 25:
              return "rgba(224, 224, 224,1)"; //change
              break;
            case 30:
              return "rgba(0,0,255,0)";
              break;
            default:
              return "rgba(0,0,255,0)";
          }

          // return "rgba(224, 224, 224,1)"
        }
        })
  }
  
  function resetLinks(d) {

    console.log("out!");

    link
      .style("stroke", function(l){
        switch(l.value) {
          case 5:
            return "rgba(0,0,255,0)";
            break;
          case 10:
            return "rgba(224, 224, 224,1)"
            break;
          case 15:
            return "rgba(224, 224, 224,1)";
            break;
          case 20:
            return "rgba(0,0,255,0)";
            break;
          case 25:
            return "rgba(224, 224, 224,1)"; //change
            break;
          case 30:
            return "rgba(0,0,255,0)";
            break;
          default:
            return "rgba(0,0,255,0)";
        }        
      })

    // link
    // .style("stroke", "rgba(224, 224, 224,1)");

    // link
    //   .style("stroke", function(l){

    //       switch(l.value) {
    //         case 5:
    //           return "rgba(0,0,255,0.02)";
    //           break;
    //         case 10:
    //           // return "rgba(0,0,255,0.1)";
    //           // return "rgba(146, 146,239,0.3)"
    //           return "rgba(255, 165,104,1)"
    //           break;
    //         case 15:
    //           return "rgba(0,0,255,0.02)";
    //           break;
    //         case 20:
    //           return "rgba(0,0,255,0.02)";
    //           break;
    //         case 25:
    //           return "rgba(0,0,255,1)"; //change
    //           break;
    //         case 30:
    //           return "rgba(0,0,255,0.02)";
    //           break;
    //         default:
    //           return "rgba(0,0,255,0.02)";
        
    //     } 

        // })
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