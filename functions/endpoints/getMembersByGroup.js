module.exports={
    getMembersByGroup: function(req,res,admin,groupName){
        var ref_db = admin.database().ref('/groupsByMembers');
        res.set('Content-Type', 'application/json');
            try {
                getUsersByGroup(admin,groupName,ref_db).then((response)=>{
                    //console.log("cantidad de arreglos 3 "+response.length);
                    response=JSON.stringify(response);
                    res.end("{\"members\":"+response.toString()+"}");
                    return;
                }).catch((error)=> {
                    res.end("{\"members\":"+error+"}");
                    return;
                  });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

/*function getUsersByGroup(admin,groupName, ref_db,callback){
  var groups=[];
  ref_db.orderByChild("groupName").equalTo(groupName).once("value").then((snapshot)=>{
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
    }).then;
}*/

getInfoUsers=(snapshot,admin)=> new Promise((resolve, reject) => {
    var email="";
    var groups=[];
    var count=0;
    var hijos=snapshot.numChildren();
    snapshot.forEach((childSnapshot)=>{
        email=childSnapshot.val().email;
        groups.push(
            admin.auth().getUserByEmail(email)
            .then((userRecord)=>{
                return ({"rank":1,"id":userRecord.uid,"name":userRecord.displayName,"score":12});
            })
            .catch((error)=>{
                return (error);
            })
        );
    });
    
    Promise.all(groups).then((response) =>{
            return resolve(response);
        }
    ).catch((error)=>{
        return reject(error);
    });
});


 getUsersByGroup=(admin,groupName, ref_db,callback)=> new Promise((resolve, reject) => {
    
    ref_db.orderByChild("groupName").equalTo(groupName).once("value",(snapshot)=>{


        
  
          //groups.push(childSnapshot.val().email);
  
          //Obtener informacion del usuario
          getInfoUsers(snapshot,admin).then((response)=>{
            //console.log("cantidad de arreglos 2 "+response.length);
                return resolve(response);
              //console.log(response);
          }).catch((error)=> {
            return reject(error);
          });
    },(errorObject)=>{
        //console.log("The read failed: " + errorObject.code);
        return reject(errorObject);
      });

});