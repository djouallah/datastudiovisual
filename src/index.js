
const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const {Deck} = require ('@deck.gl/core');
const  {ScatterplotLayer} = require('@deck.gl/layers');


// define the initial Canvas
var canvasElement = document.createElement('canvas');
var ctx = canvasElement.getContext('2d');
canvasElement.id = "container";
document.body.appendChild(canvasElement);


// change to false to deploy
export const LOCAL = false;
   
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

var DefaultColor = [0,0,250];
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



//console.log(d.colorid);
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
  
});
console.log(nbritem);
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
      getRadius:d => (d.sizeid || DefaultSize) ,
      getFillColor: d => ( d.colorid || DefaultColor),
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
