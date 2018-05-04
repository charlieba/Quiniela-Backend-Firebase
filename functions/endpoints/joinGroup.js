module.exports={
    joinGroup: function(req,res,admin,email,idGroup, groupName){
        var ref_db_groups = admin.database().ref('/groups');
        var ref_db_users = admin.database().ref('/users');
        res.set('Content-Type', 'application/json');

            try {
                userExists(email,ref_db_users,(response)=>{
                  var key="";
                  if(response!==0){
                    if(groupName!==undefined){
                        groupNameExists(groupName,ref_db_groups,(response)=>{
                            if(response!==0){
                                    var ref_db_membersByGroup = admin.database().ref('/groupsByMembers'); 
                                    userExistsInGroup(email,groupName,ref_db_membersByGroup,(response)=>{
                                        if(response===0){
                                            ref_db_membersByGroup.push({
                                                email: email,
                                                groupName: groupName
                                              }, (errorObject)=>{ 
                                                res.end("{\"response\":\""+errorObject+" added\"}");
                                            });
                                            res.end("{\"response\":\""+email+" added to "+groupName+" \"}");
                                        }else{
                                            res.end("{\"errror\":\"User already exits in this group\"}");
                                        }
                                    });
                            }else{
                                res.end("{\"errror\":\"Group Name does not exits\"}");
                            }

                        });
                    }else{
                        res.end("{\"errror\":\"Missing Parameter\"}");
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
function userExistsInGroup(email, groupName, ref_db,callback){
    var counter=0;
    ref_db.orderByChild("email").equalTo(email).once("value", (snapshot)=>{
        snapshot.forEach((childSnapshot)=>{
        if(childSnapshot.val().groupName===groupName){
          counter=1;
        }
      });
      callback(counter);
    },(errorObject)=>{
        console.log("The read failed: " + errorObject.code);
        callback(0);
      });
}
  