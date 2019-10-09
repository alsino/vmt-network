// ToDos:
// 1. Fotos für alle Künstler
// 2. Links für alle Künstler
// 3. Links einfärben nach Art der Verbindung
// 4. Texte und Infos rein

// Helpful Links
// - Symbole: https://bl.ocks.org/d3indepth/bae221df69af953fb06351e1391e89a0
// - Forces: https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03


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


// SELECTOR
// let select = d3.select("body")
//   .append("div")
//   .append("select")
//   .attr("class", "selector")
//   .on("change", () => {
//     console.log(select.property("value"));
//   })

//  select.selectAll("option")
//  .data(symbolTypes)
//  .enter()
//  .append("option")
//  .text((d) => d.name)

// select.property("value", symbolTypes[0].name);


let legend = d3.select(".wrapper")
  .append("div")
  .attr("class", "legend");


let tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


d3.json("./data/october/artists_071019.json", function (error, graph) {
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
    .force("y", d3.forceY().strength(0.315))
    .force("attractForce", attractForce)
    .force("repelForce", repelForce);


  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  let link = svg.selectAll('line')
    .data(graph.links)
    .enter().append('line');

  link
    .attr('class', 'links')
    // .style("stroke", "rgba(224, 224, 224,1)")
    .style("stroke", "rgba(0, 5, 255, 0.1)")
  // .style("stroke", (d) => {d.value == 10 ? "red" : "green"  })
  // .style('stroke', o => (o.value == 10 ? "#F76906" : "#1CDE7E"));
  // .style('stroke', o => (o.value == 10 ? "rgba(247,105,6,0.2)" : "rgba(28,222,126,0.2)"));
  // // .on('mouseover.tooltip', function(d) {
  // //   	tooltip.transition()
  // //     	.duration(300)
  // //     	.style("opacity", .8);
  // //   	tooltip.html("Source:"+ d.source.name + 
  // //                  "<p/>Target:" + d.target.name +
  // //                 "<p/>Strength:"  + d.value)
  // //     	.style("left", (d3.event.pageX) + "px")
  // //     	.style("top", (d3.event.pageY + 10) + "px");
  // // 	})
  // // 	.on("mouseout.tooltip", function() {
  // //     tooltip.transition()
  // //       .duration(100)
  // //       .style("opacity", 0);
  // //   })
  // 	.on('mouseout.fade', fade(1))
  //   .on("mousemove", function() {
  //     tooltip.style("left", (d3.event.pageX) + "px")
  //       .style("top", (d3.event.pageY + 10) + "px");
  //   });


  let node = svg.selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .attr('class', 'nodes')
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));



  function tooltipContent(d) {
    // All information
    return `Name: ${d.name} <br> 
    Disziplin: ${d.discipline} <br> 
    Gender: ${d.gender} <br> 
    Birth Year: ${d.birthYear} <br> 
    Birth Country: ${d.birthCountry} <br> 
    Birth Town: ${d.birthTown} <br>
    <img src="./assets/img/mask.png">
    `
    // Just image
    // return `<img src="./assets/img/mask.png">`
  }

  let symbolSize = 70;
  let symbolRadius = 7;

  let symbolGenerator = d3.symbol()
    .size(symbolSize);

  // TODO: REDUCE NUMBER OF CATEGORIES - We only have 7 different symbols
  let symbolTypes = [
    {"discipline": 1,"name": "installation","symbol": 'symbolCircle'},
    {"discipline": 2,"name": "performance","symbol": 'symbolCross'},
    {"discipline": 3,"name": "painting / drawing / graphic / illustration","symbol": 'symbolDiamond'},
    {"discipline": 4,"name": "photography","symbol": 'symbolSquare'},
    {"discipline": 5,"name": "collage","symbol": 'symbolStar'},
    {"discipline": 6,"name": "sculpture","symbol": 'symbolTriangle'},
    {"discipline": 7,"name": "music / sound","symbol": 'symbolWye'},
    {"discipline": 8,"name": "Discipline 8","symbol": 'symbolCircle'},
    {"discipline": 9,"name": "Discipline 9","symbol": 'symbolCircle'},
    {"discipline": 10,"name": "Discipline 10","symbol": 'symbolCircle'},
  ]

  node
    .append('path')
    .attr('r', symbolRadius)
    .attr('d', function (d) {
      if (d.discipline && d.discipline < 11) {
        symbolGenerator
          .type(d3[symbolTypes[d.discipline - 1].symbol]);
        return symbolGenerator();
      }
    })
    // .style("fill", function(d) { return color(d.discipline);}) 
    // .style("fill", "black")
    .on('mouseover.tooltip', function (d) {
      tooltip.transition()
        .duration(300)
        .style("opacity", 1);
      tooltip.html(tooltipContent(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    })
    .on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function () {
      tooltip.transition()
        .duration(100)
        .style("opacity", 0);
    })
    .on('mouseout.fade', fade(1))
    .on("mousemove", function () {
      tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    })
    .on('dblclick', releasenode)
    .on('click', openArtistPage)


  // Labels
  let lables = node.append("text")
    .text(function (d) {
      return d.name;
    })
    .attr('x', 6)
    .attr('y', 3)
    .on('mouseover.tooltip', function (d) {
      tooltip.transition()
        .duration(300)
        .style("opacity", 1);
      tooltip.html(tooltipContent(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    })
    .on('mouseover.fade', fade(0.1))
    .on("mouseout.tooltip", function () {
      tooltip.transition()
        .duration(100)
        .style("opacity", 0);
    })
    .on('mouseout.fade', fade(1))
    .on("mousemove", function () {
      tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
    })
    .on('dblclick', releasenode)
    .on('click', openArtistPage)

 

  // LEGEND
  let legendItem = legend.selectAll("div")
    .data(symbolTypes)
    .enter()
    .append("div")
    .attr("class", "legendItem")
    .on("mouseover.legend", (d) => {
      highlight(d.discipline, 0.1)
    })

  let legendSymbol = legendItem.append("div")
    .append("svg")
    .attr("class", "legendSymbol")
    .append('path')
    .attr('d', function (d) {
      if (d.discipline && d.discipline < 11) {
        symbolGenerator
          .type(d3[symbolTypes[d.discipline - 1].symbol]);
        return symbolGenerator();
      }
    }).attr('transform', 'translate(10, 10)');

  let legendDescription = legendItem.append("div").text((d) => d.name)


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

  function openArtistPage(artistID) {
    window.open(`https://visitmytent.com/?p=${graph.nodes[0].profileID}`, '_blank')
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


      if (opacity != 1) {
        link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity / 2));
        // link.style('stroke', o => (o.value == 10 ? "#F76906" : "#1CDE7E"));
      } else {
        link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      }
      // link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity / 2));
    };
  }

  function highlight(discipline, opacity) {
    node.style('stroke-opacity', function (o) {
      // console.log(o, discipline)
      const thisOpacity = o.discipline == discipline ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });






  }



  let sequentialScale = d3.scaleOrdinal(d3.schemeSet3)
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);



})