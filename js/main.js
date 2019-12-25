let disciplineSelected = false;
let darkMode = false;

let svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

let viewOffesetX = 100;

svg
  .attr("viewBox", [-width / 2 - viewOffesetX, -height / 2, width, height]);

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
// let headingDisciplines = legendDiscipline
//     .append("div")
//     .attr("class", "legend-heading")
//     .text("Main Discipline");

let legend = legendDiscipline
    .append("div")
    .attr("class", "legend");

// 2. Legend Connections
// let headingConnection = legendConnections
//     .append("div")
//     .attr("class", "legend-heading")
//     .text("Type of Connection");

// 3. Legend Links
let legendLinks = legendConnections
    .append("div")
    .attr("class", "legend-links");

// let headingArtists = legendArtists
//     .append("div")
//     .attr("class", "legend-heading")
//     .text(`Select one of ${n} artists`);



  d3.json("./data/december/artists_191223.json").then(function(graph) {

    let headingArtists = legendArtists
    .append("div")
    .attr("class", "legend-heading")
    .text(`Select one of ${graph.nodes.length} artists`);

    // 4. Select setup
    let select = legendArtists.append("select")
      .attr("class", "selector");

    // 5. Tooltip setup
    let tooltip = sidebar
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

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

    
    // Find number of links
    graph.links.forEach(function(link){

      // initialize a new property on the node
      if (!link.source["linkCount"]) link.source["linkCount"] = 0; 
      if (!link.target["linkCount"]) link.target["linkCount"] = 0;

      // count it up
      link.source["linkCount"]++;
      link.target["linkCount"]++;   
    });

    let mostLinks = graph.nodes.map((item) => {
      if(!item.linkCount) {item.linkCount = 0;} 
      return item;
    })


    mostLinks.sort(function(a, b) {
      return b.linkCount - a.linkCount;
  });

    // console.log(graph.nodes);


  let node = nodeCont.selectAll('.node')
    .data(graph.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));


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


    if (d.birthYear != null) {

      if(questions)  {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div class="tooltip-birth">Born ${d.birthYear} in ${d.birthTown}, ${d.birthCountry}</div>
            <div>Studio in ${d.studioVisit}</div>
            <br>
            <div>${d.questions.why}</div>
            <br>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`

        // return toolTipInfo[0].content
        // console.log(toolTipInfo)
  
      } else {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div class="tooltip-birth">Born ${d.birthYear} in ${d.birthTown}, ${d.birthCountry}</div>
            <div>Studio in ${d.studioVisit}</div>
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
            <div>Studio in ${d.studioVisit}</div>
            <br>
            <div>${d.questions.why}</div>
            <br>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`
  
      } else {
        // All information
        return `<div class="tooltip-info">
          <div class="tooltip-info-inner">
            <div class="tooltip-name">${d.name}</div>
            ${discipline}
            <div>Studio in ${d.studioVisit}</div>
          </div>
        </div>
        <img class="tooltip-img" src="./assets/img/${d.imageUrl}">`
  
      }

    }
  }

  const symbolSizeLegend = 70;
  const symbolRadius = 7;
  const symbolGenerator = d3.symbol();

  function getNodeSize(node, defaultSize){
    return node == 0 ? Math.sqrt(defaultSize / Math.PI * 1) : Math.sqrt(defaultSize / Math.PI * node);
  }

  let textScale = d3.scaleLinear()
                  .domain([0, 63])
                  .range([10, 20]);


  node
  .on('mouseover.fade', (d, i, nodes) => {
    fade(d, i, nodes, 0.1, "0000FF", true);
   })
   .on('mouseover.tooltip', function (d) {
    showTooltip(d);
  })
   .on('mouseout.fade', (d, i, nodes) => {
     fade(d, i, nodes, 1, "black", false);
   })
  .on("mouseout.tooltip", function () {
    // node.style("fill", "black");
    hideTooltip();
  })
  .on('dblclick', releasenode)
  .on('click', (d) => openArtistPage(d.profileID))
    .append('path')
    .attr('d', function (d) {
      if (d.discipline[0] && d.discipline[0] < 11) {
        symbolGenerator
          .type(d3[symbolTypes[d.discipline[0]].symbol])
          .size(getNodeSize(d.linkCount, 2000));
        return symbolGenerator();
      }
    })
    


  //Labels
  let label = node.append("text")
    .text(function (d) {
      return d.name;
    })
    // .style("font-size", 12)
    .attr('class', "label")
    .attr('x', 9)
    .attr('y', 3)
    .on('dblclick', releasenode)
    .on('click', (d) => openArtistPage(d.profileID))

  
  let legendItemSelected = false;

  
  
  // Legend Disciplines
  let legendItem = legend.selectAll("div")
    .data(symbolTypes, d => d)
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
      if (d.discipline) {
        symbolGenerator
          .type(d3[symbolTypes[d.discipline].symbol])
          .size(symbolSizeLegend);
        return symbolGenerator();
      }})
    .attr('transform', 'translate(10, 10)');

  let legendDescription = legendItem
    .append("div")
    .text(d => d.name)
 
  let linkTypeselected = false;

  // Legend Link Types
  let linkTypeItem = legendLinks.selectAll("div")
    .data(linkTypes)
    .enter()
    .append("div")
    .attr("class", "legendItemLinks")
    .on("click", (d, i, nodes)=> {

      

      linkTypeselected = true;

      if (linkTypeselected) {
        d3.selectAll(".legendItemLinks").classed("legendItem-active", false);
        d3.select(nodes[i]).classed("legendItem-active", true);
        filterLinks(d, d.value, 0.1);
      }
    })

    let firstLegendItem = legendItem.filter(function (d, i) { return i === 0;} )
        firstLegendItem.classed("legendItem-active", true)

    let firstlinkTypeItem = linkTypeItem.filter(function (d, i) { return i === 0;} )
        firstlinkTypeItem.classed("legendItem-active", true)

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
    let zoom = d3.event.transform;
    let zoomLevel = d3.event.transform.k;
    g.attr("transform", d3.event.transform)
    console.log(zoomLevel);

    if (zoomLevel > 1.1) {
      d3.selectAll('.label').style('display', 'block');
    } else {
      d3.selectAll('.label').style('display', 'none');
    }




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


  function fade(d, i, nodes, opacity, fillColor, isActive) {

    d3.select(nodes[i]).style("fill", fillColor); // Highlight node on hover
    d3.select(nodes[i]).select(".label").style("fill", fillColor); // Highlight node label on hover

    let op = opacity;

    node.style('stroke-opacity', function (o) {
      const thisOpacity = isConnected(d, o) ? 1 : op;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });

    if (isActive){
      label.style('display', function (o) {
        visibilityMode = isConnected(d, o) ? "block" : "none";
        return visibilityMode;
      })
    } else {
      label.style('display', "none")
    }

    
    if (op != 1) {
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : op));
      // link.style('stroke', o => (o.value == 10 ? "#F76906" : "#1CDE7E"));
    } else {
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : op));
    } 
    
  }

  function filterDisciplines(discipline, opacity) {
    node.style('stroke-opacity', function (o) {
      const thisOpacity = o.discipline[0] == discipline || o.discipline[1] == discipline  ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });
  }

  function filterLinks(d, linkType, opacity) {

  let op = opacity;
  let selectedLinks;
  let selectedNodes = [];

   selectedLinks = graph.links.filter(function(o){

    if (linkType == 0) { 
      return graph.links 
    } else { 
      return o.value == linkType;  
    }
  })

    selectedLinks.forEach((item) => {
      // Check if node is already in selectedNodes array
      if(selectedNodes.indexOf(item.source) === -1 || selectedNodes.indexOf(item.target) === -1) {
        selectedNodes.push(item.source);
        selectedNodes.push(item.target);
      }
    })

    const result = [];
    const map = new Map();
    for (const item of selectedNodes) {
        if(!map.has(item.name)){
            map.set(item.name, true);    // set any value to Map
            result.push({
                name: item.name,
                birthCountry: item.birthCountry,
                birthTown: item.birthTown,
                birthYear: item.birthYear,
                discipline: item.discipline,
                gender: item.gender,
                imageUrl: item.imageUrl,
                index: item.index,
                linkCount: item.linkCount,
                profileID: item.profileID,
                studioVisit: item.studioVisit,
                questions: item.questions,
                vx: item.vx,
                vy: item.vy,
                x: item.x,
                y: item.y
            });
        }
    }
    

    link.style('stroke-opacity', function (l) {

      let thisOpacity;

      if (linkType == 0) {
        thisOpacity = 1;
      } else {
        thisOpacity = l.value == linkType ? 1 : op;
      }

      // console.log(linkType);

      
      return thisOpacity;
    
    });   

    update(result);
  }

  function update(data) {
    // https://www.d3indepth.com/enterexit/
    // https://fabiofranchino.com/blog/the-new-d3.js-join-method-is-awesome-for-t/

    // d3.select('svg')
    // .selectAll('rect')
    // .data(data)
    // .join('rect')
    // .style('fill', 'red')
    // .attr('width', d => d.value)
    // .attr('height', 20)
    // .attr('y', (d, i) => i*20)


    // let u = d3.select('.nodes')
    // .selectAll('g')
    // .data(data, d => d)
    // .join("g")
    // .attr('class', 'node')
    
    
    let u = d3.select('.nodes')
      .selectAll('g')
      .data(data, function(d) {
        // console.log(d);
        return d;
      });
  
    let node = u.enter()
      .append('g')
      .attr('class', 'node')
      // .call(d3.drag()
      // .on("start", dragstarted)
      // .on("drag", dragged)
      // .on("end", dragended))

    node
      .append('path')
      .attr('r', symbolRadius)
      .attr('d', function (d) {
        // console.log(d);
        if (d.discipline[0] && d.discipline[0] < 11) {
          symbolGenerator
            .type(d3[symbolTypes[d.discipline[0]].symbol])
            .size(getNodeSize(d.linkCount, 2000));
          return symbolGenerator();
        }
      })
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .merge(u);

      u.exit().remove();

    node
      .append('text')
      .text(function (d) {
        return d.name;
      })
      .attr('x', 9)
      .attr('y', 3)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('mouseover.fade', (d, i, nodes) => {
        fade(d, i, nodes, 0.1);
      })
      .on('mouseout.fade', (d, i, nodes) => {
        fade(d, i, nodes, 1);
        update(data);
      })
      .on('mouseover.tooltip', (d) => { showTooltip(d);})
      .on("mouseout.tooltip", function () {
        d3.select(this).style("fill", "black");
        hideTooltip();
      })
      .on('dblclick', releasenode)
      .on('click', (d) => openArtistPage(d.profileID))
      .merge(u);


  // simulation
  //   .nodes(data)
  //   .on("tick", ticked);

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

   
    label.style('display', function (o) {
      visibilityMode = isConnected(selectedArtist, o) ? "block" : "none";
      return visibilityMode;
    })


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
      case 10: return  "rgba(0, 5, 255, 0.2)"; break;
      case 15: return "rgba(0,255,0,0.2)"; break;
      case 20: return "rgba(0,0,255,0)"; break;
      case 25: return "rgba(255,0,0,0.2)"; break;
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

})

// Dark mode switch
let modeBtn = d3.select('body').append('div').classed("btn-mode", true);
let modeBtnSymbol = modeBtn.append("span").classed("btn-mode-symbol", true).text("");
let modeBtnText = modeBtn.append("span").classed("btn-mode-text", true).text("Night");

modeBtn.on("click", () => {
  darkMode = !darkMode;

  if(darkMode) {

    svg.style("background-color", "black");
    d3.select("#intro").style("color", "white")
    d3.select("body").style("color", "white")
    d3.select("body").style("background", "black");

    d3.selectAll(".legendSymbol > path").style("fill", "white");
    d3.selectAll(".legendSymbol > path").style("stroke", "black");

    node.style("fill", "white");


    modeBtnSymbol.style("background", "white")
    modeBtnText.text("Day")

  } else {

    svg.style("background-color", "white");
    d3.select("#intro").style("color", "black")
    d3.select("body").style("color", "black")
    d3.select("body").style("background", "white")

    d3.selectAll(".legendSymbol > path").style("fill", "black");
    d3.selectAll(".legendSymbol > path").style("stroke", "white");
    
    modeBtnSymbol.style("background", "black")
    modeBtnText.text("Night")

  }
 
})


