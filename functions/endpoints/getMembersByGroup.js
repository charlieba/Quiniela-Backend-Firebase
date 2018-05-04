module.exports={
    getMembersByGroup: function(req,res,admin,groupName){
        var ref_db = admin.database().ref('/groupsByMembers');
        res.set('Content-Type', 'application/json');
            try {
                getUsersByGroup(groupName,ref_db,(response)=>{
                    response=JSON.stringify(response);
                    res.end("{\"members\":"+response.toString()+"}");
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function getUsersByGroup(groupName, ref_db,callback){
  var groups=[];
  ref_db.orderByChild("groupName").equalTo(groupName).once("value", (snapshot)=>{
      snapshot.forEach((childSnapshot)=>{
        groups.push(childSnapshot.val().email);
    });
    callback(groups);
  },(errorObject)=>{
      console.log("The read failed: " + errorObject.code);
      callback(0);
    });
}