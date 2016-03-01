var node_path=require('path');
var fs=require('fs');

function map(arrayData,call,resultCallback){
    var p = arrayData;
    var finalResultData = [];
    var watchLength = p.length;

    for(var i = 0;i< p.length;i++){
        call((p[i]),function(error, resultData){
            watchLength--;
            finalResultData.push(resultData);

            if(watchLength==0){
                resultCallback(null,finalResultData);
            }
        });
    }

}

function getDir(dirPath, finalCallback){
    var path = node_path.join(__dirname,dirPath);
    // console.log(path)
    var watchProcessDir = [];
    var allPath = [];
    watchProcessDir = watchProcessDir.concat(path);
    function isOver (path) {
        watchProcessDir.splice(watchProcessDir.indexOf(path),1);
        if (watchProcessDir.length == 0) {
            finalCallback(allPath);
            return true;
        }else {
            return false;
        }
    }
    function forDir(path){
        // console.log(path);
        fs.readdir(path, function(err, files){
            if (err) {
                return false;
            } 
            if (!files || !files.length) {
                isOver(path);
                return false;
            }
            map(files, function(subdir,cb){
                var subpath=node_path.join(path,subdir);
                fs.stat(subpath,function(err,file){
                    if (file.isDirectory()) {
                        allPath.push(subpath);

                        cb(null,subpath);
                    }else {
                        cb(null,'');
                    }
                })
            },function(err,result){
                if (result.join('') != '') {
                    result = result.filter(function(item) {
                        return !!item;
                    });
                    watchProcessDir = watchProcessDir.concat(result);
                    result.forEach(function(e, i){
                        forDir(e);
                    });
                }
                isOver(path);

            });
        });
    }
    forDir(path);
}
getDir('./',function(allPath){
    console.log(allPath);
});