import fs from 'fs'

function loadOBJ(path){
    const obj = fs.readFileSync('./models/'+path+'/'+path+'.obj').toString()

    const lines = obj.split('\n')

    var meshes = []
    var model = {position:[],normal:[],coord:[],indices:[],}
    var outmodel
    function newMesh(){
        //model = {position:[],normal:[],coord:[],indices:[],}
        outmodel = {position:[],normal:[],coord:[]}
        meshes.push(outmodel)
    }

    //console.log(lines[0])
    var FUNCS = {
        o(params){
            newMesh()
        },
        v(params){
            model.position.push(params.map(parseFloat))
        },
        vn(params){
        model.normal.push(params.map(parseFloat))
        },
        vt(params){
        model.coord.push(params.map(parseFloat))
        },
        f(params){
            params=params.map(f=>{
                var arr = f.split('/')
                arr = arr.map(a=>parseInt(a))
                //model.indices.push(...arr)
                return arr
            })
            outmodel.position.push(
                ...model.position[params[0][0]-1],
                ...model.position[params[1][0]-1],
                ...model.position[params[2][0]-1]
            )
            outmodel.coord.push(
                ...model.coord[params[0][1]-1],
                ...model.coord[params[1][1]-1],
                ...model.coord[params[2][1]-1]
            )
            outmodel.normal.push(
                ...model.normal[params[0][2]-1],
                ...model.normal[params[1][2]-1],
                ...model.normal[params[2][2]-1]
            )
            //model.indices.push(params[0][1],params[1][1],params[2][1])
            //model.indices.push(params[0][2],params[1][2],params[2][2])
        },
    }

    

    for(const line of lines){

        var key = line.split(' ')[0]
        var params = line.split(' ').map(a=>a.trim())
        params.splice(0,1)
        
        if(FUNCS[key]!==undefined){
            FUNCS[key](params)
        }

    }

    return meshes
}

const meshes = loadOBJ('box')

console.log(meshes)

const mesh = meshes[0]

let data = []
for(let i=0;i<mesh.position.length;i+=3){
    data.push(mesh.position[i+0],mesh.position[i+1],mesh.position[i+2])
    data.push(mesh.normal[i+0],mesh.normal[i+1],mesh.normal[i+2])
    data.push(mesh.coord[i+0],mesh.coord[i+1])
}
console.log(data)

const dataBin = new Uint8Array(new Float32Array(data).buffer)

fs.writeFileSync('./dist/models/box/box.bin',dataBin)