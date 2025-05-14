 export default class IScreenConfig{

    constructor(x, y, default_width, default_height, width, height, strPlatform)
    {
        this.x = x;
        this.y = y;
        this.m_iDefaultWidth = default_width;
        this.m_iDefaultHeight = default_height;
        
        this.m_iCurrentWidth = width;
        this.m_iCurrentHeight = height;

        this.m_fWidthRate = 1;
        this.m_fHeightRate = 1;

        this.listDesktopLocationsH = [];
        this.listDesktopLocationsV = [];
        this.listMobileLocationH = [];
        this.listMobileLocationV = [];
        // this.landscape = false;
        // this.vertical = false;

        this.eScreenMode = ""
        this.ePlatform = strPlatform;

        if(height > width)
        {
            //this.vertical = true;
            this.eScreenMode = "Vertical";
        }
        else
        {
            //this.landscape = true;
            this.eScreenMode = "Horizontal";
        }

        // New
        this.listDH = [];
        this.listDV = [];
        this.listMH = [];
        this.listMV = [];

        this.listCurrent = null;
    }

    OnSize(width, height)
    {
        // if( width < 600 )
        // {
        //     this.m_iCurrentWidth = 600;
        //     this.m_iCurrentHeight = height;
        // }
        // else 
        // {
        //     this.m_iCurrentWidth = width;
        //     this.m_iCurrentHeight = height;
        // }
        this.m_iCurrentWidth = width;
        this.m_iCurrentHeight = height;
        
        this.m_fWidthRate = this.m_iCurrentWidth / this.m_iDefaultWidth;
        //this.m_fHeightRate = this.m_iCurrentWidth / this.m_iDefaultWidth;
        this.m_fHeightRate = this.m_iCurrentHeight / this.m_iDefaultHeight;

        // if(height > width)
        // {
        //     this.vertical = true;
        //     this.landscape = false;
        // }
        // else
        // {
        //     this.landscape = true;
        //     this.vertical = false;
        // }
        if(height > width)
        {
            //this.vertical = true;
            this.eScreenMode = "Vertical";
        }
        else
        {
            //this.landscape = true;
            this.eScreenMode = "Horizontal";
        }

    }

    IsMobile()
    {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    GetLocation(index)
    {
        if ( this.IsMobile() )
        {
            return this.listMobileLocationV[index];
        }
        else
        {
            //test
            //return this.listDesktopLocationsV[index];
            
            return this.listDesktopLocationsH[index];
        }
    }

    RequestFile(strFilename, callback, listDH, listDV, listMH, listMV)
    {     
        //const urlfile = `http://localhost:5556/${strFilename}`;
        const urlfile = `https://mcholdemgame.com/${strFilename}`;
        //console.log(`##### ufl = ${urlfile}`);
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
                    return callback(event.target.result, listDH, listDV, listMH, listMV);
                }
            }
        };
    }

    ProcessLocation(result, listDH, listDV, listMH, listMV)
    {
        console.log(`AAA ################################################ ${result}`);
        const listLine = result.split(/\r\n|\r|\n/);
        let eType = 'DesktopH';
        for ( let i in listLine )
        {
            //console.log(`listLine : ${i}`);
            if ( listLine[i] == '#DesktopH' || listLine[i] == '#DesktopV' || listLine[i] == '#MobileH' || listLine[i] == '#MobileV' )
            {
                eType = listLine[i].replace(/#/g, '');

                //console.log(eType);
            }
            else
            {
                const temp = listLine[i].replace(/ /g, '');
                const listElement = temp.split(',');
                //console.log(listElement);
                switch(eType)
                {
                case 'DesktopH':
                    {
                        //console.log(`DesktopH : ${listElement[0]}, ${listElement[1]}, ${listElement[2]}`);
                        const obj = {x:parseInt(listElement[0]), y:parseInt(listElement[1]), strName:listElement[2]};
                        listDH.push(obj);
                    }
                    break;
                case 'DesktopV':
                    {
                        //console.log(`DesktopV : ${listElement[0]}, ${listElement[1]}, ${listElement[2]}`);
                        const obj = {x:parseInt(listElement[0]), y:parseInt(listElement[1]), strName:listElement[2]};
                        listDV.push(obj);
                    }
                    break;
                case 'MobileH':
                    {
                        //console.log(`MobileH : ${listElement[0]}, ${listElement[1]}, ${listElement[2]}`);
                        const obj = {x:parseInt(listElement[0]), y:parseInt(listElement[1]), strName:listElement[2]};
                        listMH.push(obj);
                    }
                    break;
                case 'MobileV':
                    {
                        //console.log(`MobileV : ${listElement[0]}, ${listElement[1]}, ${listElement[2]}`);
                        const obj = {x:parseInt(listElement[0]), y:parseInt(listElement[1]), strName:listElement[2]};
                        listMV.push(obj);
                    }
                    break;                        
                }
            }
        }
    }

    LoadLocation(strFilename, callback, listDH, listDV, listMH, listMV)
    {
        const result = this.RequestFile(strFilename, callback, listDH, listDV, listMH, listMV);
        //console.log(`################################################ ${result}`);
        //console.log(result);
    }

    GetPosition(index)
    {
        //console.log(this.listDH);
        //console.log(`screen : ${this.eScreenMode}, platform : ${this.ePlatform}`);

        if ( this.ePlatform == 'Desktop' )
        {
            if ( this.eScreenMode == 'Horizontal' )
            {
                return this.listDH[index];
            }
            else
            {
                return this.listDV[index];
            }
        }
        else 
        {
            return this.listMV[index];
            // if ( this.eScreenMode == 'Horizontal' )
            // {
            //     return this.listMH[index];
            // }
            // else
            // {
            //     return this.listMV[index];
            // }
        }
    }
};