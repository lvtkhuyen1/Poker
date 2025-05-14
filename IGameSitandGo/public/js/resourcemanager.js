 export default class IResourceManager{

    constructor()
    {
        this.listImages = [];
        this.iNumLoadCount = 0;
        this.bComplete = false;
        this.listLoads = [];
    }

    GetImage(cIndex)
    {
        console.log(`IResourceManager : GetImage (index:${cIndex})`);
        console.log(this.listImages[cIndex]);

        return this.listImages[cIndex];
    }

    RequestFile(strFilename, callback, listImages, listLoads)
    {     
        //const urlfile = `http://localhost:5556/${strFilename}`;
        const urlfile = `https://mcholdemgame.com/${strFilename}`;
        console.log(`##### ufl = ${urlfile}`);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", urlfile, true);
        xhr.responseType = "blob";
        xhr.send();
        xhr.onload = function() 
        {
            if (xhr.status === 200) 
            {
                var fileBlob = xhr.response;

                const reader = new FileReader();

                reader.readAsText(fileBlob);
                reader.onload = (event) => {
                    return callback(event.target.result, listImages, listLoads);
                }
            }
        };
    }

    ProcessResource(result, listImages, listLoads)
    {
        console.log(`ProcessResource ################################################`);
        console.log("Loaded content:", result);
        const listLine = result.split(/\r\n|\r|\n/);
        listLine.forEach((line, idx) => {
            console.log(`Line ${idx}: Length: ${line.length}, Content: '${line}'`);
        });
        for (let line of listLine) {
            const index = line.indexOf('#');
        
            if (index == -1) {
                const temp = line.replace(/ /g, '');
                const listElement = temp.split(',');
        
                //console.log(`listElement : ${listElement[0]}, ${listElement[1]}`);
        
                let image = new Image();
                image.onload = () => {
                    listLoads.push(0);
                }
                image.src = listElement[0];
        
                let objectData = {image:image, strName:listElement[1]};
                listImages.push(objectData);
            }
        
            //console.log(`listLine : ${line}, found index : ${index}`);
        }
        //console.log(`#resources`);
        //console.log(listImages);
    }

    LoadResource(strFilename, func, listImages, listLoads)
    {
        const result = this.RequestFile(strFilename, func, listImages, listLoads);
        //console.log(`################################################ ${result}`);
        //console.log(result);
    }

    Counter()
    {
        // ++ this.iNumLoadCount;

        // console.log(`### => IResourceManager : Counter ${this.iNumLoadCount}`);
    }
};