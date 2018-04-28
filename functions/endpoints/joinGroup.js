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
                                var ref_db_members = admin.database().ref('/groups/'+idGroup+"members");

                                userExistsInGroup(email,ref_db_members,(response)=>{
                                    if(response!==0){
                                        groupObject.push({
                                            "email": email
                                        },(errorObject)=>{ 
                                            res.end("{\"response\":\""+errorObject.code+" added\"}");
                                        });
                                        res.end("{\"response\":\""+email+" added\"}");
                                    }else{
                                        res.end("{\"errror\":\"User already exits in this group\"}");
                                    }
                                });
                            }else{
                                res.end("{\"errror\":\"Group ID does not exits\"}");
                            }
                        });    
                    }else if(groupName!==undefined){
                        groupNameExists(groupName,ref_db_groups,(response)=>{
                            if(response!==0){
                                getKeyOfgroupName(groupName,ref_db_groups,(response)=>{
                                    if(response!==undefined){
                                        var groupObject = ref_db_groups.child(response+"/members");
                                        var ref_db_members = admin.database().ref('/groups/'+response+"/members");
                                        console.log('/groups/'+response+"/members");
                                        userExistsInGroup(email,ref_db_members,(response)=>{
                                            if(response===0){
                                                groupObject.push({
                                                    "email": email
                                                }, (errorObject)=>{ 
                                                    res.end("{\"response\":\""+errorObject.code+" added\"}");
                                                });
                                                res.end("{\"response\":\""+email+" added\"}");
                                            }else{
                                                res.end("{\"errror\":\"User already exits in this group\"}");
                                            }
                                        });
                                    }else{
                                        res.end("{\"errror\":\"Group Name does not exits\"}");
                                    }
                                });

                            }else{
                                res.end("{\"errror\":\"Group Name does not exits\"}");
                            }

                        });
                    }

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

function getKeyOfgroupName(groupName,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("groupName").equalTo(groupName).once("child_added", (snapshot)=>{
        callback(snapshot.key);
    },(errorObject)=>{
        console.log("The read failed: " + errorObject.code);
        callback(undefined);
      });

}

function keyGroupsExists(groupKey,ref_db,callback){
    var counter=0;
    ref_db.orderByKey().equalTo(groupKey).once("value", (snapshot)=>{
        counter=snapshot.numChildren(); 
        callback(counter);
    },(errorObject)=>{
        console.log("The read failed: " + errorObject.code);
        callback(0);
      });
}
function groupNameExists(groupName,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("groupName").equalTo(groupName).once("value", (snapshot)=>{
        counter=snapshot.numChildren(); 
        callback(counter);
    },(errorObject)=>{
        console.log("The read failed: " + errorObject.code);
        callback(0);
      });
}

function userExistsInGroup(email,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("email").equalTo(email).once("value", (snapshot)=>{
        counter=snapshot.numChildren(); 
        console.log(counter);
        callback(counter);
    },(errorObject)=>{
        console.log("The read failed: " + errorObject.code);
        callback(0);
      });
}
  