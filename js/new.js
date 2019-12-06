let disciplineSelected = false;

let svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

svg
  .attr("viewBox", [-width / 2, -height / 2, width, height]);

let g = svg.append("g")
    .attr("class", "network");

let linkCont = g.append("g").attr("class", "links");
let nodeCont = g.append("g").attr("class", "nodes");

// Legend setup
let sidebar = d3.select(".wrapper")
  .append("div")
  .attr("class", "sidebar")



// Legend setup
let legendDiscipline = sidebar.append("div").attr("class", "legend-discipline");
let legendConnections = sidebar.append("div").attr("class", "legend-connections");
let legendArtists = sidebar.append("div").attr("class", "legend-artists");


// 1. Legend Disciplines
let headingDisciplines = legendDiscipline
    .append("div")
    .attr("class", "legend-heading")
    .text("Diciplines");

let legend = legendDiscipline
    .append("div")
    .attr("class", "legend");

// 2. Legend Connections
let headingConnection = legendConnections
    .append("div")
    .attr("class", "legend-heading")
    .text("Type of Connection");

// 3. Legend Links
let legendLinks = legendConnections
    .append("div")
    .attr("class", "legend-links");

let headingArtists = legendArtists
    .append("div")
    .attr("class", "legend-heading")
    .text("Select Artist");

// 4. Select setup
let select = legendArtists.append("select")
  .attr("class", "selector");

// 5. Tooltip setup
let tooltip = sidebar
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);


d3.json("./data/november/artists_191101.json", function (error, graph) {
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
  const simulation = d3.forceSimulation().alphaDecay(0.03)
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

  let link = linkCont.selectAll('line')
    .data(graph.links)
    .enter().append('line');

  link
    .attr('class', 'link')
    // .style("stroke", "rgba(0, 5, 255, 0.1)")
    .style("stroke", (d, i, nodes) => linkColor(d));

    

  let node = nodeCont.selectAll('.node')
    // .data(graph.nodes)
    // .enter().append('g')
    // .attr('class', 'node')
    // .call(d3.drag()
    //   .on("start", dragstarted)
    //   .on("drag", dragged)
    //   .on("end", dragended));

  updateData(graph.nodes);



  function tooltipContent(d) {
    let questions = d.questions; 
    let disciplines = [];
    let discipline = ``;


    // Get discipline name from settings.js
    d.discipline.forEach((item) => {
      for(var i = 0; i < symbolTypes.length; i++) {
        if(symbolTypes[i].discipline === item) {
          let disciplineName = symbolTypes[i].name
          disciplines.push(disciplineName);
        }
      } 
    })

    // Create a div for each discipline
      disciplines.forEach((item) => {
        return discipline += `<div class="tooltip-discipline">${item}</div>`
      })


    if (d.birthYear != 0) {

      if(questions) {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div class="tooltip-birth">Born ${d.birthYear} in ${d.birthTown}, ${d.birthCountry}</div>
            <div>Studio in ${d.studioLocation}</div>
            <br>
            <div>${d.questions.why}</div>
            <br>
            <div>Works from ${d.questions.workHours}</div>
            <div>Listens to ${d.questions.music}</div>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`
  
      } else {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div class="tooltip-birth">Born ${d.birthYear} in ${d.birthTown}, ${d.birthCountry}</div>
            <div>Studio in ${d.studioLocation}</div>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`
  
      }

    } else {

      if(questions) {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div>Studio in ${d.studioLocation}</div>
            <br>
            <div>${d.questions.why}</div>
            <br>
            <div>Works from ${d.questions.workHours}</div>
            <div>Listens to ${d.questions.music}</div>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`
  
      } else {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div>Studio in ${d.studioLocation}</div>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`
  
      }

    }
  }

  const symbolSize = 70;
  const symbolRadius = 7;
  const symbolGenerator = d3.symbol()
    .size(symbolSize);


  // node
  //   .append('path')
  //   .attr('r', symbolRadius)
  //   .attr('d', function (d) {
  //     if (d.discipline[0] && d.discipline[0] < 11) {
  //       symbolGenerator
  //         .type(d3[symbolTypes[d.discipline[0] - 1].symbol]);
  //       return symbolGenerator();
  //     }
  //   })
  //   .on('mouseover.tooltip', function (d) {
  //     showTooltip(d);
  //   })
  //   .on("mouseout.tooltip", function () {
  //     hideTooltip();
  //   })
  //   .on("mousemove", function () {
  //     // tooltip.style("left", (d3.event.pageX) + "px")
  //     //   .style("top", (d3.event.pageY + 10) + "px");
  //   })
  //   .on('dblclick', releasenode)
  //   .on('click', openArtistPage)


  // // Labels
  // let label = node.append("text")
  //   .text(function (d) {
  //     return d.name;
  //   })
  //   .attr('x', 6)
  //   .attr('y', 3)
  //   .on('mouseover.fade', (d, i, nodes) => {
  //     fade(d, i, nodes, 0.1, "capitalize");
  //   })
  //   .on('mouseout.fade', (d, i, nodes) => {
  //     fade(d, i, nodes, 1, "capitalize");
  //   })
  //   .on('mouseover.tooltip', (d) => { showTooltip(d);})
  //   .on("mouseout.tooltip", function () {
  //     label.style("fill", "black");
  //     hideTooltip();
  //   })
  //   .on('dblclick', releasenode)
  //   .on('click', (d) => openArtistPage(d.profileID))

  
  let legendItemSelected = false;
  
  // Legend Disciplines
  let legendItem = legend.selectAll("div")
    .data(symbolTypes)
    .enter()
    .append("div")
    .attr("class", "legendItem")
    .on("click", function(d) {

      for (let i = 0; i < symbolTypes.length; i++) {
        let element = symbolTypes[i].selected;
        element = false;
      }

      d.selected = true;
      disciplineSelected = true;

      if (disciplineSelected) {
        d3.selectAll(".legendItem").classed("legendItem-active", false);
        d3.select(this).classed("legendItem-active", true);
        filterDisciplines(d.discipline, 0.1);
      }
    })

    // Reset all disciplines on svg click
    d3.select("svg").on("click", function() {

      for (let i = 0; i < symbolTypes.length; i++) {
        let element = symbolTypes[i].selected;
        element = false;
      }
      // resetDisciplines();
      hideTooltip();
    });


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


  // Legend Link Types
  let linkTypeItem = legendLinks.selectAll("div")
    .data(linkTypes)
    .enter()
    .append("div")
    .attr("class", "legendItem")
    .on("click", (d)=> {
      // console.log(d.value);
      filterLinks(d.value, 0.1);
      // fade(d, i, nodes, 0.1, "capitalize");
    })

    let legendTypeSymbol = linkTypeItem
      .append("div")
      .attr("class", "legendTypeItem")
      .style("background-color", (d) => d.color);
      
    let legendTypeDescr = linkTypeItem
      .append("div")
      .attr("class", "legendTypeDescr")
      .text((d) => d.type)

    // console.log(linkTypes);

  // Artist Selector
  let selectOption = select.selectAll("option")
    .data(graph.nodes)
    .enter()
    .append("option")
    .text((d) => d.name)
    .attr("value", (d) => d.name)
    // .property("selected", (d) => d.name == "Jörg-Uwe Albig")

    select.on("change", function(){
      let artistName = select.property("value");
      filterArtist(artistName, 0.1);
    })



  // Add zoom capabilities 
  let zoom_handler = d3.zoom()
    .on("zoom", zoom_actions);

  zoom_handler(svg);   

  //Zoom functions 
  function zoom_actions(){
    g.attr("transform", d3.event.transform)
  }

  // Utility functions

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
    if(artistID != 0) {
      window.open(`https://visitmytent.com/?p=${artistID}`, '_blank')
    }
  }


  const linkedByIndex = {};
  graph.links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }


  function fade(d, i, nodes, opacity, fontStyle) {
    d3.select(nodes[i]).style("fill", "#0000ff");
    d3.select(nodes[i]).style("text-transform", fontStyle);

    

    let op = opacity;

    node.style('stroke-opacity', function (o) {
      const thisOpacity = isConnected(d, o) ? 1 : op;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });

    if (op != 1) {
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : op / 2));
      // link.style('stroke', o => (o.value == 10 ? "#F76906" : "#1CDE7E"));
    } else {
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : op));
    }    
  }

  function filterDisciplines(discipline, opacity) {
    node.style('stroke-opacity', function (o) {
      const thisOpacity = o.discipline == discipline ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });
  }

  function filterLinks(linkType, opacity) {

  let op = opacity;
  let selectedLinks;
  let selectedNodes = [];

   selectedLinks = graph.links.filter(function(o){
      return o.value == linkType;
    })

    selectedLinks.forEach((item) => {
      // Check if node is already in selectedNodes array
      if(selectedNodes.indexOf(item.source) === -1 || selectedNodes.indexOf(item.target) === -1) {
        selectedNodes.push(item.source);
        selectedNodes.push(item.target);
      }
    })

    console.log(selectedNodes);

    updateData(selectedNodes);

    link.style('stroke-opacity', function (l) {
      const thisOpacity = l.value == linkType ? 1 : op;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });

  }


  function updateData(data){
    // https://www.d3indepth.com/enterexit/

    const symbolSize = 70;
    const symbolRadius = 7;
    const symbolGenerator = d3.symbol()
    .size(symbolSize);
    
    let u = d3.select('.nodes').selectAll("node")
    // .data(data, function(d) {
    //   return d
    // })
    .data(data)
  
    u.enter()
    .append('g')
    .attr('class', 'node')
    .append('path')
    .merge(u)
    .attr('r', symbolRadius)
    .attr('d', function (d) {
      if (d.discipline[0] && d.discipline[0] < 11) {
        symbolGenerator
          .type(d3[symbolTypes[d.discipline[0] - 1].symbol]);
        return symbolGenerator();
      }
    })

    let label = u.append("text")
    .text(function (d) {
      return d.name;
    })
    .attr('x', 6)
    .attr('y', 3)
    .on('mouseover.fade', (d, i, nodes) => {
      fade(d, i, nodes, 0.1, "capitalize");
    })
    .on('mouseout.fade', (d, i, nodes) => {
      fade(d, i, nodes, 1, "capitalize");
    })
    .on('mouseover.tooltip', (d) => { showTooltip(d);})
    .on("mouseout.tooltip", function () {
      label.style("fill", "black");
      hideTooltip();
    })
    .on('dblclick', releasenode)
    .on('click', (d) => openArtistPage(d.profileID))

    u.exit().remove();
  }


  function resetDisciplines() {
    disciplineSelected = false;
    console.log(disciplineSelected);
    d3.selectAll(".legendItem").classed("legendItem-active", false);

    node.style('stroke-opacity', function (o) {
      const thisOpacity = 1
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });
  }

  function filterArtist(artist, opacity) {
    let selectedArtist = graph.nodes.filter(function(item){
      return item.name == artist
    })
    selectedArtist = selectedArtist[0];
    showTooltip(selectedArtist);

    node.style('stroke-opacity', function (o) {
      const thisOpacity = isConnected(selectedArtist, o) ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });

    

    if (opacity != 1) {
      link.style('stroke-opacity', o => (o.source === selectedArtist || o.target === selectedArtist ? 1 : opacity / 2));
      label.style("fill", (l) => ( l === selectedArtist ? "#0000ff" : "black" ));
    } else {
      link.style('stroke-opacity', o => (o.source === selectedArtist || o.target === selectedArtist ? 1 : opacity));
    }
}


  function linkColor(d) {
    switch(d.value) {
      case 5: return "rgba(0,0,255,0)"; break;
      case 10: return  "rgba(0, 5, 255, 0.3)"; break;
      case 15: return "rgba(0,255,0,0.3)"; break;
      case 20: return "rgba(0,0,255,0)"; break;
      case 25: return "rgba(255,0,0,0.3)"; break;
      case 30: return "rgba(0,0,0,0)"; break;
      default: return "rgba(0,0,0,0)";
    }        
}

    function showTooltip(d){
      tooltip.transition()
      .duration(300)
      .style("opacity", 1);

      tooltip.html(tooltipContent(d))
      // .style("left", (d3.event.pageX) + "px")
      // .style("top", (d3.event.pageY + 10) + "px");
    }

    function hideTooltip(){
      tooltip.transition()
          .duration(100)
          .style("opacity", 0);
    }


  let sequentialScale = d3.scaleOrdinal(d3.schemeSet3)
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

})