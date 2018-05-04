module.exports={
    setGroup: function(req,res,admin,userId,groupName,tournamentId){
        var ref_db = admin.database().ref('/groups');
        var ref_db_users = admin.database().ref('/users');
        var ref_db_groupsByMembers=admin.database().ref('/groupsByMembers');
        res.set('Content-Type', 'application/json');
        try {
          userExists(userId,ref_db_users,(response)=>{
            if(response!==0){
              getAmountOfGroupsByUser(userId,ref_db,(response)=>{
                var key="";
                if(response<5){
                  getAmountOfGroupsWithTheSameName(groupName,userId,ref_db,(counterGroupsWithSameName)=>{
                    if(counterGroupsWithSameName===0){
                        var data={
                          userAdmin: userId, 
                          groupName: groupName, 
                          tournamentId: tournamentId
                        }
                        var insertGroup = ref_db.push(data);
                        key = insertGroup.key;
                        response=response+1;
                        var path=groupName;
                        //var groupObject = ref_db.child(key+"/members");
                        ref_db_groupsByMembers.push({
                          email: userId,
                          groupName: groupName
                        });
                        res.end("{\"groupId\":\""+key+"\",\"countGroups\":\""+response+"\"}");
                    }else{
                      res.end("{\"errror\":\"Duplicated groupName\"}");
                    }
                  }); 
                }else{
                  res.end("{\"errror\":\"User exceeded limit of groups\"}");
                }
              });
            }else{
              res.end("{\"errror\":\"User does not exits\"}");
            }
          });       
        } catch (error) {
           res.end("{\"error\":\""+error+"\"}");
        }
    }
}

//Retorna el numero de grupos por usuario
function getAmountOfGroupsByUser(userId,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("userAdmin").equalTo(userId).once("value", (snapshot)=>{
      counter=snapshot.numChildren(); 
      callback(counter);
    });
  }
  
  //Retorna la cantidad de grupos con el mismo nombre, debe ser 0 para poder crear el grupo
  function getAmountOfGroupsWithTheSameName(groupName, userId,ref_db, callback){
    var counter=0;
    ref_db.orderByChild("groupName").equalTo(groupName).once("value", (snapshot)=>{ 
      /*snapshot.forEach((childSnapshot)=>{
        if(childSnapshot.val().userId===userId){
          counter=1;
        }
      });*/
      counter=snapshot.numChildren(); 
      callback(counter);
    });
  }

  //Verifica si el usuario administrador existe
  function userExists(email,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("email").equalTo(email).once("value", (snapshot)=>{
      counter=snapshot.numChildren(); 
      callback(counter);
    });
  }