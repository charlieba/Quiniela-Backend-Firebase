module.exports={
    setGroup: function(req,res,admin,userId,groupName,tournamentId){
      res.set('Content-Type', 'application/json');
      console.log(groupName);
       try {
        if (/\s/.test(groupName) || groupName.length > 8 ) {
          printResponse(res,-1,"");
        }else{
          userExists(admin,userId,(response)=>{
            if(response!==0){
              var ref_db = admin.database().ref('/groups');
              getAmountOfGroupsByUser(userId,ref_db,(response)=>{
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
                        var ref_db_groupsByMembers=admin.database().ref('/groupsByMembers');
                        ref_db_groupsByMembers.push({
                          email: userId,
                          groupName: groupName
                        });
                        //res.end("{\"groupId\":\""+key+"\",\"countGroups\":\""+response+"\"}");
                        printResponse(res,1,key);
                    }else{
                      //res.end("{\"errror\":\"Duplicated groupName\"}");
                      printResponse(res,-2,"");
                    }
                  }); 
                }else{
                  //res.end("{\"errror\":\"User exceeded limit of groups\"}");
                  printResponse(res,-3,"");
                }
              });
            }else{
              res.end("{\"errror\":\"User does not exits\"}");
            }
          });   
        }    
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
  function userExists(admin, email, callback){
    admin.auth().getUserByEmail(email)
    .then(function(userRecord) {
        callback(1);
    })
    .catch(function(error) {
      if(error.code=="auth/invalid-email"){
        callback(0);
      }else{
        res.end("{\"error\":\""+error+"\"}");
      }
    });
}

function printResponse(res,response, code){
  res.end("{\"response\":\""+response+"\",\"code\":\""+code+"\"}");
}