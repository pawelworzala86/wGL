import {
  WebGLRenderingContext,
} from './WebGL';

import { Shader } from './Shader'
import { Mesh } from './Mesh';

import { loadModel, logString } from './Engine';


function logStr(str: string):void{
  const kaiPtr = changetype<usize>(String.UTF8.encode(str));
  logString(kaiPtr,str.length)
}


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

















let offset: i32 = 0
let buffer: ArrayBuffer
let array: StaticArray<u8>

function getUint32(): u32 {
  const ptr = changetype<usize>(array) + offset;
  offset += 4;
  return load<u32>(ptr);
}

function getDataF32(length: i32): StaticArray<f32> {
  const result = new StaticArray<f32>(length);
  for (let i = 0; i < length; i++) {
    result[i] = load<f32>(changetype<usize>(array) + offset);
    offset += 4;
  }
  return result;
}

function getString(length: i32): string {
  const ptr = changetype<usize>(array) + offset;
  offset += length;
  return String.UTF8.decodeUnsafe(ptr, length, true);
}

export function setModelData(ptr: usize, length: i32):void {

  array = new StaticArray<u8>(length)
  for (let i = 0; i < length; i++) {
    array[i] = load<u8>(ptr + i * sizeof<u8>())
  }

  buffer = changetype<ArrayBuffer>(array);

  offset = 0

  //logStr('model loaded')

  //console.log(buffer)
  const dataLen = getUint32()
  //logStr('dataLen: '+dataLen.toString())
  //console.log('dataLen',dataLen)
  const dataSet = getDataF32(dataLen/4)
  //logStr('dataSet: '+dataSet.length.toString())
  //logStr('dataSet[1]: '+dataSet[1].toString())
  //console.log('dataSet',dataSet)
  const texLen = getUint32()
  //logStr('texLen: '+texLen.toString())
  //console.log('texLen',texLen)
  const texureName = getString(texLen)
  //logStr('texureName: '+texureName)
  //console.log('texureName',texureName)


  let mesh:Mesh
  mesh = new Mesh(gl, shader, dataSet, texureName);
  //meshes.push(mesh)
  models[modelID].addMesh(mesh)

  logStr('model added')
}














var gl: WebGLRenderingContext = new WebGLRenderingContext('cnvs', 'webgl2');



let shader = new Shader(gl)

gl.useProgram(shader.program)



gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);





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