import {
  WebGLRenderingContext,
  WebGLShader,
  ImageData,
  WebGLUniformLocation,
  WebGLBuffer,
  GLint,
  WebGLProgram,
  WebGLTexture,
} from './WebGL';

import { Shader } from './Shader'
import { Mesh } from './Mesh';

import { loadModel } from './Engine';



class Model{
  meshes: Array<Mesh> = new Array();
  constructor(){}
  addMesh(mesh:Mesh):void{
    this.meshes.push(mesh)
  }
  render(projection: StaticArray<f32>, camera: StaticArray<f32>):void{
    for(let i=0;i<this.meshes.length;i++){
        this.meshes[i].render(projection, camera)
    }
  }
}













var gl: WebGLRenderingContext = new WebGLRenderingContext('cnvs', 'webgl2');


let textures:Array<string> = new Array()
// Przyjmij wskaźnik i długość stringa z JS
export function setTexture(ptr: i32, length: i32): i32 {
  const bytes: u8[] = [];
  let offset = 0;
  while (true) {
    const byte = load<u8>(ptr + offset);
    if (byte == 0) break; // Koniec stringa
    bytes.push(byte);
    offset++;
  }

  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  textures.push(str)

  return textures.length-1
}

//export function setLog(str: string):void {
  //logStr(str,str.length)
//}

let meshesData:Array<StaticArray<f32>> = new Array()
export function setMeshData(ptr: usize, length: i32):i32 {

  const array = new StaticArray<f32>(length); // Tworzymy nową tablicę StaticArray
  for (let i = 0; i < length; i++) {
    array[i] = load<f32>(ptr + i * sizeof<f32>()); // Ładujemy dane z pamięci WASM
  }
/*
  log(1.0)
  log(array[0])
  log(array[1])
*/
  //let len:i32 = 3
  let table = new StaticArray<f32>(length);
  for (let i = 0; i < length; i++) {
    //table[i] = <f32>i * 0.1;
    table[i] = array[i]
}
  meshesData.push(table)
  return meshesData.length-1
}
/*export function getArrayFromSet(): StaticArray<f32> {
  let index:i32 = 0
    return arr[index]
}
*/

let meshes: Array<Mesh> = new Array();
export function addMesh(modelID:i32, dataID: i32, textureID: i32):i32 {
  let mesh:Mesh
  mesh = new Mesh(gl, shader, meshesData[dataID], textures[textureID]);
  meshes.push(mesh)
  models[modelID].addMesh(mesh)
  return meshes.length-1
}




let shader = new Shader(gl)

gl.useProgram(shader.program)



gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


//let mesh:Mesh
//let meshes:Array<Mesh<f32>> = new Array()
//meshes[0] = new Mesh(gl, shader, meshes[0], textures[0]);





let projection_matrix: StaticArray<f32> = [1.3737387097273113,0.0,0.0,0.0,0.0,1.3737387097273113,0.0,0.0,0.0,0.0,-1.02020202020202,-1.0,0.0,0.0,-2.0202020202020203,0.0]
let camera_matrix: StaticArray<f32> = [1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,-10.100090086,1.0]



let models: Array<Model> = new Array();
function addModel(modelID:i32):void{
  const kai:string = 'kai'
  const kaiPtr = changetype<usize>(String.UTF8.encode(kai));
  const model = new Model()
  models[modelID] = model
  loadModel(modelID, kaiPtr,kai.length)
  loaded = true
}

let loaded = false
let modelID = 0
function loadModels():void{
  //const kai:string = 'kai'
  //const kaiPtr = changetype<usize>(String.UTF8.encode(kai));
  addModel(modelID)
  loaded = true
}

export function displayLoop(): void {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if(!loaded){
    loadModels()
  }

  for(let i=0;i<models.length;i++){
      models[i].render(projection_matrix, camera_matrix)
  }
}
