
	var upimg = document.getElementById('upimg');
	upimg.addEventListener('change',UpladFile)

    function photoCompress(file,obj,callback){

        EXIF.getData(file, function() { 
            EXIF.getAllTags(this);   
            Orientation = EXIF.getTag(this, 'Orientation');  
        });  

        var ready=new FileReader();
        ready.readAsDataURL(file);
        ready.onload=function(){
            var img = new Image();
            img.src = this.result;
            img.onload = function(){


                var width = this.width,
                    height = this.height,
                    scale = width / height,
                    prx = 0,pry = 0;
                    if (width>height && scale>4/3){
                        width = parseInt(height * 4/3);
                        prx  = parseInt(this.width - width)/2;
                    }else if(width<height && scale<4/3){
                        height = parseInt(width * 4/3);
                        pry  = parseInt(this.height - height)/2;
                    }
       
                var quality = obj.quality || 0.7;



                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var anw = document.createAttribute("width");
                anw.nodeValue = width;
                var anh = document.createAttribute("height");
                anh.nodeValue = height;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, width, height);  
                ctx.drawImage(this, prx, pry, width, height,0,0,width,height);
                myW = width;
                myH = height;
              
                if(Orientation != "" && Orientation != 1){  
                    switch(Orientation){  
                        case 6: 
                            rotateImg(this,'left',canvas,width,height);
                            myW = height;
                            myH = width;  
                            break;  
                        case 8:  
                            rotateImg(this,'right',canvas,width,height); 
                            myW = height;
                            myH = width;   
                            break;  
                        case 3:
                            rotateImg(this,'right',canvas,width,height);  
                            rotateImg(this,'right',canvas,width,height);  
                            break;  
                    }         
                }  
                base64 = canvas.toDataURL("image/jpeg", quality);  
                callback(base64);
            }
        }
    }
    function convertBase64UrlToFile(urlData){
        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr],new Date().getTime()+".jpg", {type:mime});
    }
    
    function UpladFile() {
        var fileObj = document.getElementById("photoimg").files[0],quality = 0.9,maxFile = 1024*1024*2;
        
        if (fileObj) {
            if (fileObj.size>maxFile) {
                quality = maxFile/fileObj.size;
            }
            var type = fileObj.type ? fileObj.type.split('/') : [];
            var pathType = (/jpg|jpeg|png|/i);

            if (!type[1] || !pathType.test(type[1])) {
            	console.log('文件格式不支持')
                return false;
            }

            photoCompress(fileObj, {
                quality: quality>0.9 ? 0.9 : quality
            }, function(base64Codes){
                var file = convertBase64UrlToFile(base64Codes);
                // TODO upload to somewhere
                console.log(fileObj.size,file.size,file.size/fileObj.size);
               
            });
        }
    }
    
    function rotateImg(img, direction,canvas,w,h) {   
      
        var min_step = 0,max_step = 3;    
        
        if (img == null)return;    
       
        var height = h || img.height,width = w || img.width;    

        var step = 2;    
        if (step == null) {    
            step = min_step;    
        }    
        if (direction == 'right') {    
            step++;     
            step > max_step && (step = min_step);    
        } else {    
            step--;    
            step < min_step && (step = max_step);    
        }    

        if (canvas == null) {   
            canvas = document.createElement('canvas');   
        }    
        
        var degree = step * 90 * Math.PI / 180;    
        var ctx = canvas.getContext('2d'); 
        ctx.fillStyle = '#fff';   
        ctx.fillRect(0, 0, width, height);  
        switch (step) {    
            case 0:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.drawImage(img, 0, 0);    
                break;    
            case 1:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, 0, -height);    
                break;    
            case 2:    
                canvas.width = width;    
                canvas.height = height;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, -height);    
                break;    
            case 3:    
                canvas.width = height;    
                canvas.height = width;    
                ctx.rotate(degree);    
                ctx.drawImage(img, -width, 0);    
                break;    
        }  
    }