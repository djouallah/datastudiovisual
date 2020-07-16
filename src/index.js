
const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const {Deck} = require ('@deck.gl/core');
const  {ScatterplotLayer} = require('@deck.gl/layers');
const {scaleOrdinal} =require('d3-scale');


// define the initial Canvas
var canvasElement = document.createElement('canvas');
var ctx = canvasElement.getContext('2d');
canvasElement.id = "container";
document.body.appendChild(canvasElement);


// change to false to deploy
export const LOCAL = false;


export const COLOR_SCALE = scaleOrdinal()
  .domain([])
  .range([
    [230, 25, 75], [60, 180, 75], [255, 225, 25], [0, 130, 200]
    , [245, 130, 48], [145, 30, 180], [70, 240, 240], [240, 50, 230], 
    [210, 245, 60], [250, 190, 212], [0, 128, 128], [220, 190, 255], [170, 110, 40], 
    [255, 250, 200], [128, 0, 0], [170, 255, 195], [128, 128, 0], [255, 215, 180], [0, 0, 128], 
    [128, 128, 128], [255, 255, 255], [0, 0, 0]
  ]);
   
const drawViz = (data) => { 
document.body.innerHTML = "";
var canvasElement = document.createElement('canvas');
var ctx = canvasElement.getContext('2d');
canvasElement.id = "container";

// get can vas dimensions 
var height = dscc.getHeight();
var width = dscc.getWidth();

// get default zoom Values for Deck GL 
var zoomparameter =  data.style.zoomparameter.value
? data.style.zoomparameter.value
: data.style.zoomparameter.defaultValue;

var minZoomparameter =  data.style.minZoomparameter.value
? data.style.minZoomparameter.value
: data.style.minZoomparameter.defaultValue;

var maxZoomparameter =  data.style.maxZoomparameter.value
? data.style.maxZoomparameter.value
: data.style.maxZoomparameter.defaultValue;

var radiusScaleparameter =  data.style.radiusScaleparameter.value
? data.style.radiusScaleparameter.value
: data.style.radiusScaleparameter.defaultValue;

var radiusMinPixelsparameter =  data.style.radiusMinPixelsparameter.value
? data.style.radiusMinPixelsparameter.value
: data.style.radiusMinPixelsparameter.defaultValue;

var radiusMaxPixelsparameter =  data.style.radiusMaxPixelsparameter.value
? data.style.radiusMaxPixelsparameter.value
: data.style.radiusMaxPixelsparameter.defaultValue;

var Pitchparameter =  data.style.Pitchparameter.value
? data.style.Pitchparameter.value
: data.style.Pitchparameter.defaultValue;


var DefaultSize = 1;

// clear canvas does not work
// ctx.clearRect(0, 0, width, height);
// ctx.beginPath();   
  // Deckgl code

var vizData = data.tables.DEFAULT.map(d => {
  return {
    
      lat: d.lat[0] ,
      lng: d.lng[0],
      sizeid:  d.sizeid && d.sizeid[0],
      colorid: d.colorid && d.colorid[0],
      tooltipid : d.tooltipid && d.tooltipid[0] ,
  };
});


  // get intial Vaues for view
let startloop0 = 0;
let startloop1 = 0;
let nbritem = 0;
let counter =0;
vizData.forEach((item) => {
  var xxx =parseFloat(item.lng) || 0;
  var yyy =parseFloat(item.lat) || 0;
  startloop0=xxx+startloop0;
  if ( xxx == 0 ) {counter =0} else {counter =1};
  nbritem=nbritem+counter;
  startloop1=yyy+startloop1;
 //console.log([item.colorid]);
});

var longitudeView =startloop0/nbritem;
var latitudeView =startloop1/nbritem;
  
//console.log(nbritem,longitudeView,latitudeView,zoomparameter,minZoomparameter,maxZoomparameter)


  
  const INITIAL_VIEW_STATE = {
    
    bearing: 0,
    longitude: longitudeView,
    latitude:  latitudeView,
    zoom: zoomparameter,
    minZoom: minZoomparameter,
    maxZoom: maxZoomparameter,
    pitch: Pitchparameter,
    
  };
new Deck({
  width: width,
  height: height,
  initialViewState: INITIAL_VIEW_STATE,
  
  controller: true,
  layers: [
    new ScatterplotLayer({
      data : vizData,
      radiusScale   : radiusScaleparameter,
      getPosition: d => [d.lng,d.lat],
      getRadius: d => (d.sizeid || DefaultSize) ,
      getFillColor: d => ( COLOR_SCALE(d.colorid) || [0,0,0] ),
      radiusMinPixels: radiusMinPixelsparameter,
      radiusMaxPixels: radiusMaxPixelsparameter,
      pickable: true,
      
    })
  ],
   
  getTooltip: ({object}) => object && `${object.tooltipid == null ? [object.lng,object.lat] : object.tooltipid }`
  
});
};
// renders locally
if (LOCAL) {
  
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
