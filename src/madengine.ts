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

import { getQuad } from './quad';

import { loadModel } from './Engine';

import { testFuncAA,log,logStr } from './MyFuncs';



var gl: WebGLRenderingContext = new WebGLRenderingContext('cnvs', 'webgl2');


let textures:Array<string> = new Array()
// Przyjmij wskaźnik i długość stringa z JS
export function setTexture(textureID:i32, ptr: i32, length: i32): void {
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

  textures[0] = str

  logStr(ptr,length);
}

//export function setLog(str: string):void {
  //logStr(str,str.length)
//}

let meshes:Array<StaticArray<f32>> = new Array()
export function setMesh(meshID:i32, ptr: usize, length: i32):i32 {

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
  meshes[meshID] = table
  return meshes.length-1
}
/*export function getArrayFromSet(): StaticArray<f32> {
  let index:i32 = 0
    return arr[index]
}
*/







let shader = new Shader(gl)

gl.useProgram(shader.program)



gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


let mesh:Mesh







let projection_matrix: StaticArray<f32> = [1.3737387097273113,0.0,0.0,0.0,0.0,1.3737387097273113,0.0,0.0,0.0,0.0,-1.02020202020202,-1.0,0.0,0.0,-2.0202020202020203,0.0]
let camera_matrix: StaticArray<f32> = [1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,-10.100090086,1.0]



let imp = false
const kai = 'kai'

export function displayLoop(): void {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  if(!imp&&textures){
    imp = true

    const kaiPtr = changetype<usize>(String.UTF8.encode(kai));
    loadModel(kaiPtr,kai.length)

    mesh = new Mesh(gl, shader, meshes[0], textures[0]);
  }
  

 
  mesh.render(projection_matrix, camera_matrix)
}
