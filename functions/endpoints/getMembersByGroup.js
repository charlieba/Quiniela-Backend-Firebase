module.exports={
    getMembersByGroup: function(req,res,admin,groupName){
        var ref_db = admin.database().ref('/groupsByMembers');
        res.set('Content-Type', 'application/json');
            try {
                getUsersByGroup(admin,groupName,ref_db,(response)=>{
                    response=JSON.stringify(response);
                    res.end("{\"members\":"+response.toString()+"}");
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function getUsersByGroup(admin,groupName, ref_db,callback){
  var groups=[];
  ref_db.orderByChild("groupName").equalTo(groupName).once("value", (snapshot)=>{
      snapshot.forEach((childSnapshot)=>{

        //groups.push(childSnapshot.val().email);

        //Obtener informacion del usuario
        getInfoUsers(admin,childSnapshot.val().email,(response)=>{
            groups.push(response);
            //console.log(response);
        });
    });
    return callback(groups);
  },(errorObject)=>{
      console.log("The read failed: " + errorObject.code);
      callback(0);
    });
}

function getInfoUsers(admin, email, callback){
    admin.auth().getUserByEmail(email)
    .then((userRecord)=>{
        return callback({"rank":1,"id":userRecord.uid,"name":userRecord.displayName,"score":12});
    })
    .catch((error)=>{
      if(error.code==="auth/invalid-email"){
        return callback({});
      }else{
        res.end("{\"error\":\""+error+"\"}");
      }
      return callback({});
    });
}