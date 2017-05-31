import {
  ParametricGeometry,
  TextureLoader,
  MeshLambertMaterial,
  DoubleSide,
  Mesh,
  ShaderMaterial,

} from 'three';

export default class ClothView {

  constructor(cloth, src) {
    this.cloth = cloth;
    this.src = src;
    this.createGeometry();
    this.loadTexture();
    this.createMaterial();
    this.createMesh();
  }

  createGeometry() {
    this.geometry = new ParametricGeometry(
      this.cloth.clothFunction,
      this.cloth.w,
      this.cloth.h
    );
    this.geometry.dynamic = true;
  }

  loadTexture() {
    const loader = new TextureLoader();
    this.clothTexture = loader.load(this.src);
    this.clothTexture.anisotropy = 16;
    this.uniforms = { texture: { value: this.clothTexture } };
  }

  updateTexture(src) {
    const loader = new TextureLoader();
    this.clothTexture = loader.load(src);
    this.clothTexture.anisotropy = 16;
    this.uniforms = { texture: { value: this.clothTexture } };
    this.material.map = this.clothTexture;
  }

  createMaterial() {
    this.material = new MeshLambertMaterial({
      map: this.clothTexture,
      side: DoubleSide,
      alphaTest: 0.5,
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, -450, 0);
    //this.mesh.rotation.z = 2.0;
    this.mesh.scale.set(1.42,1.42,1.42);
    this.mesh.castShadow = true;

    this.mesh.customDepthMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      side: DoubleSide,
    });
  }

  update() {
    for (let i = 0; i < this.cloth.particles.length; i ++) {
      this.geometry.vertices[i]
        .copy(this.cloth.particles[i].position);
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

    this.geometry.normalsNeedUpdate = true;
    this.geometry.verticesNeedUpdate = true;
  }

}
