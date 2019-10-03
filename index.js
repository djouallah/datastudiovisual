
const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const {Deck} = require ('@deck.gl/core');
const  {ScatterplotLayer} = require('@deck.gl/layers');
// to deply change to false
export const LOCAL = true;


const drawViz = (data) => {


  // create a canvas
  var canvasElement = document.createElement('canvas');
  var ctx = canvasElement.getContext('2d');
  // clear the canvas.
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  // set the canvas width and height
  var height = dscc.getHeight();
  var width = dscc.getWidth();
  ctx.canvas.width = dscc.getWidth();
  ctx.canvas.height = dscc.getHeight();
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
