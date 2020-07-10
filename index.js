
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
export const LOCAL = true;
   
const drawViz = (data) => { 
document.body.innerHTML = "";
var canvasElement = document.createElement('canvas');
var ctx = canvasElement.getContext('2d');
canvasElement.id = "container";

// get can vas dimensions 
var height = dscc.getHeight();
var width = dscc.getWidth();

// get default zoom Values for Deck GL 
var zoomparameter =  data.style.zoomparameter.defaultValue
var minZoomparameter =  data.style.minZoomparameter.defaultValue
var maxZoomparameter =  data.style.maxZoomparameter.defaultValue

// clear canvas does not work
// ctx.clearRect(0, 0, width, height);
// ctx.beginPath();   
  // Deckgl code
var data1 = data.tables.DEFAULT;
var data2 = JSON.stringify(data1);
var data3 = data2.replace(/\"]/g, "]");
var data4 = data3.replace(/\["/g, "[");
var data4 = JSON.parse(data4);
  // get intial Vaues for view
let startloop0 = 0;
let startloop1 = 0;
let nbritem = 0;
data1.forEach((item) => {
  var tt = item.coordinateid.toString();
  var coordinatesx = tt.split(",");
  var xxx =parseFloat(coordinatesx[0]);
  var yyy =parseFloat(coordinatesx[1]);
  startloop0=xxx+startloop0;
  nbritem=nbritem+1;
  startloop1=yyy+startloop1;
});

const longitudeView =startloop0/nbritem;
const latitudeView =startloop1/nbritem;
console.log(longitudeView,latitudeView,zoomparameter,minZoomparameter,maxZoomparameter)
  
  const INITIAL_VIEW_STATE = {
    
    bearing: 0,
    longitude: longitudeView,
    latitude:  latitudeView,
    zoom: zoomparameter,
    minZoom: minZoomparameter,
    maxZoom: maxZoomparameter,
    pitch: 42.5,
  };
new Deck({
  width: width,
  height: height,
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: [
    new ScatterplotLayer({
      data : data4,
      getPosition: d => d.coordinateid,
      getRadius: d => d.sizeid,
      getFillColor: d => d.colorid,
      
    })
  ],
  
});
};
// renders locally
if (LOCAL) {
  
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
