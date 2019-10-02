const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
const {Deck} = require ('@deck.gl/core');
const  {ScatterplotLayer} = require('@deck.gl/layers');
//const {Deck, ScatterplotLayer} = deck;
//import {ScatterplotLayer} from '@deck.gl/layers';
// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = true;

// create and add the canvas
var canvasElement = document.createElement('canvas');
// var ctx = canvasElement.getContext('2d');
// canvasElement.id = 'container';
// //document.body.appendChild(canvasElement);


const drawViz = (data) => {
  
  var height = dscc.getHeight();
  var width = dscc.getWidth();
  // clear the canvas
  var ctx = canvasElement.getContext('2d');

  // clear the canvas.
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // set the canvas width and height
  ctx.canvas.width = dscc.getWidth();
  ctx.canvas.height = dscc.getHeight();
  // code
  var data1 = data.tables.DEFAULT;
  var data2 = JSON.stringify(data1);
  var data3 = data2.replace(/\"]/g, "]");
  var data4 = data3.replace(/\["/g, "[");
  var data4 = JSON.parse(data4);
  console.log(data4);
  const INITIAL_VIEW_STATE = {
    bearing: 0,
    longitude: 143.499772,
    latitude:  -34.7773053,
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

