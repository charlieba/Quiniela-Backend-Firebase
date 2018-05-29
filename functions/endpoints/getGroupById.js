module.exports={
    getGroupById: function(req,res,admin,groupId){
        var ref_db = admin.database().ref('/groups');
        res.set('Content-Type', 'application/json');
            try {
                if(groupId!==undefined){
                    getGroupById(res,groupId,ref_db,(response)=>{
                        if(response!==null){
                            res.end(JSON.stringify(response));
                        }else{
                            printResponse(res,-1,""); //Grupo no existe
                        }
                    });
                }else{
                    res.end("{\"errror\":\"Missing Parameter\"}");
                }
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function getGroupById(res,groupId, ref_db,callback){
  var groups=[];
  ref_db.orderByKey().equalTo(groupId).once("value").then((snapshot)=>{   
    return callback(snapshot.val());
  }).catch((error)=>{
        console.log("The read failed: " + error.code);
      });
}

function printResponse(res,response, code){
    res.end("{\"response\":\""+response+"\",\"code\":\""+code+"\"}");
  }