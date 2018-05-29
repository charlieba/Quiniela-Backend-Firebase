module.exports={
    joinGroup: function(req,res,admin,email,idGroup, groupName){
        res.set('Content-Type', 'application/json');
            try {
                userExists(email,admin,(response)=>{
                  var key="";
                  if(response!==0){
                    if(groupName!==undefined){
                        var ref_db_groups = admin.database().ref('/groups');
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
                                            //res.end("{\"response\":\""+email+" added to "+groupName+" \"}");
                                            printResponse(res,"",1);
                                        }else{
                                            printResponse(res,"", -3);
                                            //res.end("{\"errror\":\"User already exits in this group\"}");
                                        }
                                    });
                            }else{
                                printResponse(res,"",-1);
                                //res.end("{\"errror\":\"Group Name does not exits\"}");
                            }

                        });
                    }else{
                        res.end("{\"errror\":\"Missing Parameter\"}");
                    }

                  }else{
                    //res.end("{\"errror\":\"User not exits\"}");
                    printResponse(res,"",-2);
                  }
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function userExists(email, admin, callback){
    admin.auth().getUserByEmail(email)
    .then((userRecord)=>{
        return callback(1);
    })
    .catch((error)=>{
      if(error.code==="auth/invalid-email"){
        return callback(0);
      }else{
        res.end("{\"error\":\""+error+"\"}");
      }
      return callback(0);
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
function printResponse(res,response, code){
    res.end("{\"response\":\""+response+"\",\"code\":\""+code+"\"}");
  }
  