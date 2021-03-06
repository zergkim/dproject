import { Socket } from "dgram"
import io from "socket.io-client"

const timpar:HTMLDivElement = document.querySelector('#timestampdiv>div');
const sstart:HTMLButtonElement = document.querySelector("#start");
const send:HTMLButtonElement = document.querySelector("#end");
const timestd:HTMLDivElement = document.querySelector("#timestampdiv");
const button:HTMLButtonElement = document.querySelector("#button");
const videoinp:HTMLInputElement = document.querySelector("#video");
const imginp:HTMLInputElement = document.querySelector("#img");
const videosource:HTMLSourceElement = document.querySelector("source");
const video:HTMLVideoElement = document.querySelector("video");
const option_arr:Array<string> = []
const option:HTMLInputElement = document.querySelector(".option")
const playlistinp:HTMLInputElement = document.querySelector('.playlist>input')
const playlistbtt : HTMLButtonElement = document.querySelector('.playlist>button')
const listselect : HTMLSelectElement = document.querySelector(".listselect>select")
const videosebut :HTMLButtonElement = document.querySelector("#videocont>button")
const imgsebut :HTMLButtonElement = document.querySelector("#imgcont>button")
const img:HTMLImageElement = document.querySelector("#imgcont>img")
videosebut.addEventListener("click",(e)=>{
    videoinp.click()
})
imgsebut.addEventListener('click',(e)=>{
    imginp.click()
})
/*const optionbtt = document.querySelector(".optionbtt");
optionbtt.addEventListener("click",e=>{
    option_arr.push(option.value)
})*/
const socket = io(location.origin);
document.cookie
const inputer:HTMLSelectElement = document.querySelector("#er");
const title:HTMLInputElement = document.querySelector(".title");
const timestparr:Array<any> = [];
const getid = async()=>{
    let d = await(await fetch("/postid",{
        method:"POST",
        headers:{
            "Content-Type":"application/text"
        },
        body:""
        })).text()
    console.log()
    return d;
    
};
const getplaylistfunc = async(ID:string)=>{
    let d = await(await fetch("/playlistget",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
            body: JSON.stringify({ID:ID})
    }
    )).json()
    console.log(d)
    d.forEach((v:any)=>{
        const option = document.createElement("option");
        option.textContent=v.NAME
        
        listselect.appendChild(option)
    })
    return d;
}
const asnyce = async()=>{
    
    getplaylistfunc(await(await fetch("/getuserid")).text())
}
asnyce()
videoinp.addEventListener('change',async e => {
    const file1 = videoinp.files[0]
    const flink = URL.createObjectURL(file1);
    videosource.src=flink
    videosource.type=file1.type
    video.load();
    await video.play();
})
imginp.addEventListener('change',async e => {
    const file1 = imginp.files[0]
    const flink = URL.createObjectURL(file1);
    img.src=flink
})
button.addEventListener("click",async e=>{
    if(!confirm("?????? ??????????????????????")){
        return;
    }
    const file1 = videoinp.files[0]
    const file2 = imginp.files[0]
    if(!inputer.value){
        alert("?????????????????????")
        return;
    }
    if(file1.type.split("/")[0]!=="video"){
        alert("????????? ?????? ????????? ????????????")
        return;
    }
    if(file2.type.split("/")[0]!=="image"){
        alert("????????? ????????????")
        return;
    }
    if(!title.value){
        alert("????????? ???????????????")
        return;
    }
    const infobj={}
    const user_ip = await(await fetch("/userip")).text()
    const typeofv = file1.type.split("/")[1]
    const typeofi = file2.type.split("/")[1]
    
    const ID = await getid()
    let objed = JSON.stringify({
        ip:user_ip,
        typeofv,
        typeofi,
        timestparr,
        chat :[],
        subj : inputer.value,
        title : title.value,
        option_arr,
        PLAYLIST:listselect.value
    });
    (async function(){
        const arr:[File|string, string, string][] = [
            [file1, "application/octet-stream","/videopost"],
            [file2, "application/octet-stream","/imgpost"],
            [objed, "application/json","/objpost"]
        ];
        for(let v of (arr)){

            let message = await fetch(`${v[2]}?name=${ID}`,{
            method:"POST",
            headers:{
                "Content-Type":v[1]
            },
            body:v[0]
            })
            if(v[1]=="application/json"){
                if(await message.text()){
                    alert('?????? ????????? ??????')
                }else{
                    alert('?????? ????????? ??????')
                }
                
            }
        }
    })();
})
