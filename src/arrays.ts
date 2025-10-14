import { testFuncAA,log } from './MyFuncs';


let triangle_data2: StaticArray<f32> = [
  0.0,  0.5,
 -0.5, -0.5,
  0.5, -0.5,
];

let triangle_data3: Array<f32> = [];
triangle_data3.push(0.0)
triangle_data3.push(0.5)
//const arr32:Float32Array = new Float32Array(triangle_data)


// Deklaracja eksportu pamięci
//export { memory };

let tables:Array<StaticArray<f32>> = new Array()

// Funkcja do inicjalizacji tablicy
export function initializeTable(len: i32): i32 {
    let table = new StaticArray<f32>(len);
    let index:i32 = tables.length
    tables.push(table)
    for (let i = 0; i < len; i++) {
        table[i] = <f32>i * 0.1;
    }
    return index;
}

// Funkcja do zwrócenia wskaźnika na tablicę
export function getArray(): StaticArray<f32> {
  let len:i32 = 4
    let index:i32 = initializeTable(len);
    return tables[index]
}
export function getArrayLength(): i32 {
    let len:i32 = 4
    //let index:i32 = initializeTable(len);
    return len;
}

let arr:Array<StaticArray<f32>> = new Array()
export function setArray(ptr: usize, length: i32):void {

  const array = new StaticArray<f32>(length); // Tworzymy nową tablicę StaticArray
  for (let i = 0; i < length; i++) {
    array[i] = load<f32>(ptr + i * sizeof<f32>()); // Ładujemy dane z pamięci WASM
  }

  //log(1.0)
  //log(array[0])
  //log(array[1])

  let len:i32 = 3
  let table = new StaticArray<f32>(length);
  for (let i = 0; i < length; i++) {
    //table[i] = <f32>i * 0.1;
    table[i] = array[i]
}
  arr.push(table)
}
export function getArrayFromSet(): StaticArray<f32> {
  let index:i32 = 0
    return arr[index]
}



export function arrayTest():StaticArray<f32>{
  return triangle_data2
}