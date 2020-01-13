const symbolTypes = [
  {"discipline": 0,"name": "All Disciplines","symbol": 'symbolCircle', "selected": true},
  {"discipline": 1,"name": "Painting","symbol": 'symbolCircle', "selected": false},
  {"discipline": 2,"name": "Drawing","symbol": 'symbolCircle', "selected": false},
  {"discipline": 3,"name": "Collage","symbol": 'symbolCircle', "selected": false},
  {"discipline": 4,"name": "Photography","symbol": 'symbolCircle', "selected": false},
  {"discipline": 5,"name": "Film","symbol": 'symbolCircle', "selected": false},
  {"discipline": 6,"name": "Sculpture","symbol": 'symbolCircle', "selected": false},
  {"discipline": 7,"name": "Installation","symbol": 'symbolCircle', "selected": false},
  {"discipline": 8,"name": "Media Art","symbol": 'symbolCircle', "selected": false},
  {"discipline": 9,"name": "Performance","symbol": 'symbolCircle', "selected": false},
  {"discipline": 10,"name": "Light","symbol": 'symbolCircle', "selected": false},
  {"discipline": 11,"name": "Textile","symbol": 'symbolCircle', "selected": false},
  {"discipline": 12,"name": "Mixed Media","symbol": 'symbolCircle', "selected": false},
  {"discipline": 13,"name": "Conceptual Art","symbol": 'symbolCircle', "selected": false},
  {"discipline": 14,"name": "Music / Sound", "symbol": 'symbolCircle', "selected": false},
  {"discipline": 15,"name": "Creative Coding","symbol": 'symbolCircle', "selected": false},
  {"discipline": 16,"name": "Writing","symbol": 'symbolCircle', "selected": false}
]

const linkTypes = [
  {"type": "All connections", "value": 0, "color": "rgba(0, 0, 0, 0.3)"  },
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