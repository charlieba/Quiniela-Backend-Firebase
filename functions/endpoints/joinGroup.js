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
                                res.end("{\"response\":\""+email+" added\"}");
                            }else{
                                res.end("{\"errror\":\"Group ID does not exits\"}");
                            }
                        });    
                    }else if(groupName!==undefined){
                        groupNameExists(groupName,ref_db_groups,(response)=>{
                            if(response!==0){
                                 var groupObject = ref_db_groups.child(idGroup+"/members");
                                 res.end("{\"errror\":\"Group Name does not exits\"}");
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
        console.log(snapshot.val().groupName);
        callback(snapshot.key);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        callback(0);
      });
}

function keyGroupsExists(groupKey,ref_db,callback){
    var counter=0;
    ref_db.orderByKey().equalTo(groupKey).once("value", (snapshot)=>{
        counter=snapshot.numChildren(); 
        callback(counter);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
}
  