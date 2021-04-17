const {MongoClient} = require("mongodb");
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
const crypto = require('crypto');
const idar= []

let postobj={}
let dbobj = {
}
client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    dbobj["db"]=client.db('streamingdata')
    dbobj["df"]=dbobj["db"].collection("videodata")
    
})
const {Server} = require("socket.io")
const express =require('express');
const app = express();
const filelist=[];
const juso = "mongodb+srv://zergkim:<password>@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const hls = require("hls-server")
const fs=require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller=require("@ffmpeg-installer/ffmpeg");
const { Socket } = require("dgram");
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
const splite = (name,d)=>{
    return new Promise((res,rej)=>{
        ffmpeg('./savefiles/'+name+'.'+d,{timeout:432000}).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',//10초 단위임
            '-hls_list_size 0',
            '-f hls'
        ]).output("videos/"+name+'.m3u8').on('end',()=>{
            res("end")
        }).run() 
    })
    
}
app.use('/img',express.static('./img'))
app.use('/node_modules',express.static('./node_modules'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json())
app.get("/postid",(req,res)=>{
    const password = JSON.stringify(Math.random()).split(".")[1];
    const secret = 'kopqqqwi!!';

    const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');
    res.send(hashed)
})
app.get("/userip",(req,res)=>{
    res.send(req.socket.remoteAddress)
})
app.get("/post",(req,res)=>{
    
    res.sendFile("post.html",{root:"./view"})
})
app.get("/main",(req,res)=>{
    res.sendFile("mainview.html",{root:"./view"})
})
app.get("/watch",(req,res)=>{
    res.sendFile("watchview.html",{root:"./view"})
})
app.get("/main/filelist",async(req,res)=>{
    res.json(await dbobj.df.find({}).toArray())
})

app.post("/videopost",async(req,res)=>{
    const obj = JSON.parse(JSON.stringify(req.query))
   
    
    postobj[obj.name]=new Array()
    postobj[obj.name].push(req.body)
    
    
    res.send("ok")
})
app.post("/imgpost",async(req,res)=>{
    const obj = req.query
    
    postobj[obj.name].push(req.body)
    
    
    res.send("ok")
})
app.post("/objpost",async(req,res)=>{
    let obj = req.body
    const nameqe = req.query.name
    postobj[nameqe].push(obj)
    console.log("\n",postobj[nameqe])
    
    await post_func(postobj[nameqe])
    delete postobj[nameqe];
    res.send("goood")
    
})
const server= app.listen(3000,async()=>{
    let impsy = await fs.promises.readdir("./savefiles")
    impsy.forEach(e=>{
        e=e.split(".")
        e.pop()
        e=e.join('')
        filelist.push(e)
    })
    console.log(filelist)
})
new hls(server,{
    provider:{
        exists:(req,cb)=>{
            const ext = req.url.split('.').pop()
            if(ext!=='m3u8'&&ext!=='ts'){
                return cb(null,true)
            }
            fs.access(__dirname+req.url,fs.constants.F_OK,(e)=>{
                if(e){
                    console.log("err")
                    return cb(null,false)
                }
                cb(null,true)
            })
        },
        getManifestStream:(req,cb)=>{
            const stream =fs.createReadStream(__dirname+req.url);
            cb(null,stream)
        },
        getSegmentStream:(req,cb)=>{
            const stream = fs.createReadStream(__dirname+req.url)
            cb(null,stream)
        }
    }   
})
const io = new Server(server)
let infoarr=[];
io.on("connection",socket =>{
    socket.on('postvideo',e=>{
        infoarr.push(e)
    })
    socket.on('postimg',e=>{
        infoarr.push(e)
    })
    socket.on('postobj', async e=>{
        infoarr.push(e)
        console.log(infoarr)
        await postthedata(infoarr)
        
        infoarr=[]
    })
    
})
function post_func(obj){
    let videod = obj[0];
    let imgd = obj[1]
    let vobjd = obj[2]
    console.log(vobjd)
    postthedata(videod,imgd,vobjd)
}

function postthedata(vdata,idata,dobj){
    return new Promise(async(res,rej)=>{
        let d = async function(){
            console.log(dobj)
            let typename = dobj.typeofv
            let typename2 = dobj.typeofi
            const upobj = await dbobj.df.insertOne(dobj)
            const videoid = upobj.insertedId;
            const file_name=videoid+"."+typename
            const file_name2=videoid+"."+typename2
            await fs.promises.writeFile(`savefiles/${file_name}`, vdata);
            fs.promises.writeFile(`img/${file_name2}`,idata)
            await splite(videoid,typename)
            console.log("성공")
            res("성공")
        }
        try{
            d()
        }catch(e){
            console.log("실패")
            rej("실패")
        }
        
        
    })
}