module.exports={
    joinGroup: function(req,res,admin,email,idGroup, groupName){
        var ref_db_groups = admin.database().ref('/groups');
        var ref_db_users = admin.database().ref('/users');
        res.set('Content-Type', 'application/json');

            try {
                userExists(email,ref_db_users,(response)=>{

                  var key="";
                  if(response!==0){
                    
                    if(idGroup!==undefined){
                        keyGroupsExists(idGroup,ref_db_groups,(response)=>{
                            if(response!==0){
                                var groupObject = ref_db_groups.child(idGroup+"/members");

                                groupObject.push({
                                    "email": email
                                });
                            }else{
                                res.end("{\"errror\":\"Group ID does not exits\"}");
                            }
                        });    
                    }else if(groupName!==undefined){
                        groupNameExists(groupName,ref_db_groups,(response)=>{
                            if(response!==0){
                                 var groupObject = ref_db_groups.child(idGroup+"/members");
                            }else{
                                res.end("{\"errror\":\"Group Name does not exits\"}");
                            }
                        });
                    }

                    /*  var data={
                          email: email, 
                      }
                      var insertGroup = ref_db.push(data);
                      key = insertGroup.key;
                      response=response+1;
                      res.end("{\"userID\":\""+key+"\"}");*/
                      res.end("{\"errror\":\"User already exits\"}");

                  }else{
                    res.end("{\"errror\":\"User not exits\"}");
                  }
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function userExists(email,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("email").equalTo(email).once("value", (snapshot)=>{
      counter=snapshot.numChildren(); 
      callback(counter);
    });
  }

function groupNameExists(groupName,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("groupName").equalTo(groupName).once("child_added", (snapshot)=>{
        counter=snapshot.numChildren(); 
        callback(snapshot.key);
    });
}

function keyGroupsExists(groupKey,ref_db,callback){
    var counter=0;
    ref_db.orderByKey().equalTo(groupKey).once("value", (snapshot)=>{
        if (!snapshot.exists()) {
            console.log("entra aqui esta onda");
        }
        console.log("entra aqui esta onda");
        console.log("llave "+snapshot.key);
        counter=snapshot.numChildren(); 
        console.log("numero "+counter);
        callback(counter);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
}
  