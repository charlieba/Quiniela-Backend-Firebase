module.exports={
    getGroupsByUser: function(req,res,admin,email,tournamentId){
        var ref_db = admin.database().ref('/groupsByMembers');
        res.set('Content-Type', 'application/json');
            try {
              getGroupsByUser(email,ref_db,(response)=>{
                    response=JSON.stringify(response);
                    res.end("{\"groups\":"+response.toString()+"}");
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function getGroupsByUser(email, ref_db,callback){
  var groups=[];
  ref_db.orderByChild("email").equalTo(email).once("value", (snapshot)=>{
      snapshot.forEach((childSnapshot)=>{
        groups.push(childSnapshot.val().groupName);
    });
    callback(groups);
  },(errorObject)=>{
      console.log("The read failed: " + errorObject.code);
      callback(0);
    });
}