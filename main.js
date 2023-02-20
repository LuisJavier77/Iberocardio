import './style.css'

import Phaser from "phaser"
import TitleScreen from './src/scenes/TitleScreen'
import cardGame from './src/scenes/cardGame'
import DealCards from './src/scenes/DealCards'
import Scenes from './src/scenes/Scenes'
import CallGame from './src/scenes/CallGame'
import SelectMinigame from './src/scenes/SelectMinigame'
import Choking from './src/scenes/Choking'
import LateralPosition from './src/scenes/LateralPosition'
import RCP from './src/scenes/rcp'
import DEA from './src/scenes/dea'
import EndGame from './src/scenes/EndGame'
import EscenaSupuesto from './src/scenes/Supuesto'
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';

import * as SceneKeys from './src/consts/SceneKeys'

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.NONE,
    parent: 'app',
    width: 1920,
    height: 1080,
  }, 
  physics: {
    default: 'arcade',
    /*arcade: {
      debug: true
    }*/
  },
  backgroundColor: '#3476e0',
  dom: {
    createContainer: true
  },
  plugins: {
    global: [{
        key: 'rexInputTextPlugin',
        plugin: InputTextPlugin,
        start: true
    },]
  }
}

const game = new Phaser.Game(config)

game.scene.add(SceneKeys.TitleScreen, TitleScreen)
game.scene.add(SceneKeys.cardGame, cardGame)
game.scene.add(SceneKeys.DealCards, DealCards)
game.scene.add(SceneKeys.Scenes, Scenes)
game.scene.add(SceneKeys.CallGame, CallGame)
game.scene.add(SceneKeys.SelectMinigame, SelectMinigame)
game.scene.add(SceneKeys.Choking, Choking)
game.scene.add(SceneKeys.LateralPosition, LateralPosition)
game.scene.add(SceneKeys.RCP, RCP)
game.scene.add(SceneKeys.DEA, DEA)
game.scene.add(SceneKeys.EndGame, EndGame)
game.scene.add(SceneKeys.EscenaSupuesto, EscenaSupuesto)

game.scene.start(SceneKeys.TitleScreen);
//game.scene.start(SceneKeys.CallGame)

function resize() {
  var canvas = document.querySelector("canvas");
  var appElement = document.getElementById('app');
  var div = appElement.getElementsByTagName("div")[0];
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;

  canvas.style.display='block';
  canvas.style.margin ='0';
  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = 'translate(-50%, -50%)';

  div.style.display = 'block';
  div.style.margin ='0';
  div.style.position = "absolute";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = 'translate(-50%, -50%)';

  if(windowRatio < gameRatio){
      canvas.style.width = windowWidth + "px";
      canvas.style.height = (windowWidth / gameRatio) + "px";

      div.style.width = canvas.style.width;
      div.style.height = canvas.style.height;
  }
  else {
      canvas.style.width = (windowHeight * gameRatio) + "px";
      canvas.style.height = windowHeight + "px";

      div.style.width = canvas.style.width;
      div.style.height = canvas.style.height;
  }
}

window.onload = function() {
  //Game config here
  var config = config;
  var game = game;
  resize();
  window.addEventListener("resize", resize, false);
}

