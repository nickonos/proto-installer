const { exec } = require("child_process");
const fs = require("fs");

let cwd = process.cwd()

let rawdata = fs.readFileSync(cwd + '\\proto.json' )

if (rawdata == undefined || rawdata == null){
    console.error("make sure u have a proto.json file in the root of your repository")
    return;
}

let data = JSON.parse(rawdata)

if  (data == undefined || data.src == undefined ){
    console.error("make sure you have a src field in your proto.json file")
    return;
}

if  (data.output == undefined ){
    console.error("make sure you have output field in your proto.json file")
    return;
}

if (fs.existsSync(data.output)){
    fs.rmSync(data.output, {recursive: true, force: true})
}

exec(`git clone ${data.src} ${process.cwd()}\\${data.output}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    
    //run build when git clone is done executing
    build()
});

function build(){
    if (data.build != null){
        data.build.proto.map((file, _) => {
            exec(`protoc --${data.build.protoc_out}=${data.output} ${data.output}/${file}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
            });
        })
    }
    
}


