
const NFT_ADDRESS = "0x5fB74c1597D43db0b326E27f8acd2270f80eC2e0"; //LOVET (Polygon)
const metadata_url = "https://ipfs.io/ipfs/QmTwWoTYk18iJBzFwpamyiC4ceR1C8xyH3FFSnuKhNgUs4/";

const camera = document.getElementById("camera");
const infoContainer = document.getElementById("infoContainer");
const textInfo = document.getElementById("textInfo");
const linkOS = document.getElementById("link-1");
const textOwner = document.getElementById("textOwner");
const icon = document.getElementById("icon");
const loader = document.getElementById("loader");
const textEnter = document.getElementById("textEnter");
const loaderWrapper = document.getElementById("loader-wrapper");
const myaudio = document.getElementById("myaudio");


var url="";
var tokenData = {};
var tokenDataLoad = false;
var assetsLoad = false;


const web3 = new Web3(window.ethereum);
const nft_contract = new web3.eth.Contract(nft_abi, NFT_ADDRESS);


const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}



const refresh = async () => {
    var color="";
    for(let i=1; i<21; i++ ){
        var tmp = {};
        try{
            json_URL = metadata_url + i + ".json";
            $.getJSON(json_URL, function(data) {
                tmp["type"] = data.attributes[0].value;
                tmp["background"] = data.attributes[1].value;
                tmp["area"] = data.attributes[2].value;
            });
        }catch(error){
            console.log(`Error: ${error.message}`);
        }

        await nft_contract.methods.ownerOf(i).call().then( async function (result) {
            tmp["owner"] = result;            
        });
        tokenData[i] = tmp;
    }
    tokenDataLoad = true;
    loader.src = "images/lovet.svg";
    textEnter.innerHTML = "ENTER";
    for(let i=100; i>79; i--){
        color = "rgba(15, 116, 217, " + i/100 + ")";
        loaderWrapper.style.background = color;
        await sleep(100);
    }
}

refresh();


/* LINK 
AFRAME.registerComponent("mylink", {
    init: function() {
      this.el.addEventListener("click", (e) => {
        window.location = this.data.href;
      })
    }
});*/

// CAMERA CONSTRAINTS
AFRAME.registerComponent('limit-my-distance', {
    init: function() {
        // nothing here
    },
    tick: function() {

        var camPosition = this.el.object3D.position;

        // limit Z
        if (camPosition.z > 137) {
            camPosition.z = 137;}
    
        if (camPosition.z < -137) {
            camPosition.z = -137;
        }

        // limit X
        if (camPosition.x > 137) {
            camPosition.x = 137;
        }
        if (camPosition.x < -137) {
            camPosition.x = -137;
        }

        // left box
        if (camPosition.z < 72 && camPosition.z > 70 && camPosition.x < 100 ) {
            camPosition.z = 72;
        }
        if (camPosition.z > 48 && camPosition.z < 50 && camPosition.x < 100 ) {
            camPosition.z = 48;
        }
        if ( camPosition.x < 102 && camPosition.z < 70 && camPosition.z > 50 ) {
            camPosition.x = 102;
        }

        // right box
        if (camPosition.z > -72 && camPosition.z < -70 && camPosition.x < 100 ) {
            camPosition.z = -72;
        }
        if (camPosition.z < -48 && camPosition.z > -50 && camPosition.x < 100 ) {
            camPosition.z = -48;
        }
        if ( camPosition.x < 102 && camPosition.z > -70 && camPosition.z < -50 ) {
            camPosition.x = 102;
        }
    }
});


// DISPAY INFO AT SMALL DISTANCE
AFRAME.registerComponent('display-info', {
    init: function() {
        // nothing here
    },
    tick: function () {
        var picPosition = this.el.object3D.position;
        var camPosition = document.querySelector('#camera').object3D.position;
        var radius = Math.sqrt( Math.pow(picPosition.z - camPosition.z, 2) + Math.pow(picPosition.x - camPosition.x, 2) );

        // distance 
        if ( radius < 30) {
            
            infoContainer.style.display = "block";
            var name = this.el.id.substr(4);
            textInfo.innerHTML = "$LOVET #" + name;
            icon.src = "images/" + name + ".svg";
            tokenId = parseInt(name);
            url ="https://opensea.io/assets/matic/0x5fb74c1597d43db0b326e27f8acd2270f80ec2e0/" + name;
            

            textOwner.innerHTML = "Owner: " +  tokenData[tokenId]["owner"] + "<br>" + 
                                    "Type: " + tokenData[tokenId]["type"] + "<br>" + 
                                    "Background: " + tokenData[tokenId]["background"] + "<br>" + 
                                    "Area: " + tokenData[tokenId]["area"] ;           
    
        }
        
        if ( ((camPosition.z > -115 && camPosition.z < -50) || (camPosition.z < 115 && camPosition.z > 50)) && (camPosition.x > -115 && camPosition.x < 115) ){
            infoContainer.style.display = "none";
        }
        if ( ((camPosition.x > -115 && camPosition.x < -70) || (camPosition.x < 115 && camPosition.x > 40)) && (camPosition.z > -50 && camPosition.z < 50) ){
            infoContainer.style.display = "none";
        }
 
    }
});

$(window).on("load",function(){
	assetsLoad = true;
});

function enter(){
    if (tokenDataLoad && assetsLoad){
        $(".loader-wrapper").fadeOut("slow");
	myaudio.play();
	
    }
    else{
        textEnter.innerHTML = "WAIT..";
    }    
}

function buyNow() {
    window.open(url,"_blank");
}
