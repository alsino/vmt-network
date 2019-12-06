const symbolTypes = [
  {"discipline": 0,"name": "All Disciplines","symbol": 'symbolCircle', "selected": true},
  {"discipline": 1,"name": "Painting / Drawing / Collage","symbol": 'symbolCircle', "selected": false},
  {"discipline": 2,"name": "Media Art / Performance","symbol": 'symbolCross', "selected": false},
  {"discipline": 3,"name": "Music / Sound", "symbol": 'symbolDiamond', "selected": false},
  {"discipline": 4,"name": "Photography / Film","symbol": 'symbolSquare', "selected": false},
  {"discipline": 5,"name": "Conceptual Art / Mixed Media","symbol": 'symbolStar', "selected": false},
  {"discipline": 6,"name": "Sculpture / Installation","symbol": 'symbolTriangle', "selected": false},
  {"discipline": 7,"name": "Writing","symbol": 'symbolWye', "selected": false}
]

const linkTypes = [
  {"type": "All connections", "value": null, "color": "rgba(0, 0, 0, 0.3)"  },
  {"type": "Exhibited / on stage together", "value": 10, "color": "rgba(0, 5, 255, 0.3)"},
  {"type": "Collaborated on an art piece ", "value": 25, "color": "rgba(255,0,0,0.3)"},
  {"type": "Together in a residency", "value": 15, "color": "rgba(0,255,0,0.3)"}
]

const toolTipInfo = 
[
{
  "type": "all-info", "content": `<div class="tooltip-info">
  <div class="tooltip-info-inner">
  <div class="tooltip-name">d.name</div>discipline
  <div class="tooltip-birth">Born d.birthYear in d.birthTown, d.birthCountry</div>
  <div>Studio in d.studioLocation</div><br>
  <div>d.questions.why</div><br></div></div>
  <img class="tooltip-img" src="./assets/img/d.imageUrl">` 
}  
]