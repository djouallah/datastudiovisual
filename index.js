
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
var firstvalue = data1[0].coordinateid.toString();
var coordinates = firstvalue.split(",");
var longitudeView =parseFloat(coordinates[0]);
var latitudeView =parseFloat(coordinates[1]);
  
  const INITIAL_VIEW_STATE = {
    bearing: 0,
    longitude: longitudeView,
    latitude:  latitudeView,
    zoom: 15,
    minZoom: 5,
    maxZoom: 20,
    pitch: 40.5,
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
