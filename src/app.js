import TextureLoader from 'three';
import MainScene from './scenes/main.js';
import Cloth from './models/cloth';
import ClothView from './views/cloth.js';

var mainScene = new MainScene();

var cloth = new Cloth(10,13);
var clothView = new ClothView(cloth,'textures/flag.jpg');

mainScene.scene.add(clothView.mesh);

function animate() {
  window.requestAnimationFrame(animate);
  const time = Date.now();

  cloth.simulate(time, clothView.geometry);
  clothView.update();
  mainScene.render();
}


animate();
