export function initMyFuncs(importObject){

    importObject.MyFuncs = {}
    importObject.MyFuncs.testFuncAA = function(){
        return 'kaijunicorn.png'
    }

    importObject.MyFuncs.log = function(num){
        console.log(num)
    }
    importObject.MyFuncs.logStr = function(ptr,len){
        // Odczytaj pamięć WASM
        const memory = new Uint8Array(importObject.env.memory.buffer, ptr, len);

        // Dekoduj string UTF-8
        const decoder = new TextDecoder("utf-8");
        const str = decoder.decode(memory);

        // Wyświetl odczytany string
        console.log("String from WASM:", str);
    }
}