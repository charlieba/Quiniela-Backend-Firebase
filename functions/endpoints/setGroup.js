module.exports={
    setGroup: function(req,res,admin,userId,groupName,tournamentId){
        var ref_db = admin.database().ref('/groups');
        res.set('Content-Type', 'application/json');
        try {
          getAmountOfGroupsByUser(userId,ref_db,(response)=>{
            var key="";
            if(response<5){
              getAmountOfGroupsWithTheSameName(groupName,userId,ref_db,(counterGroupsWithSameName)=>{
                if(counterGroupsWithSameName===0){
                    var data={
                      userId: userId, 
                      groupName: groupName, 
                      tournamentId: tournamentId
                    }
                    var insertGroup = ref_db.push(data);
                    key = insertGroup.key;
                    response=response+1;
                    res.end("{\"groupId\":\""+key+"\",\"countGroups\":\""+response+"\"}");
                }else{
                  res.end("{\"errror\":\"Duplicated groupName\"}");
                }
              }); 
            }else{
              res.end("{\"errror\":\"User exceeded limit of groups\"}");
            }
          });
        } catch (error) {
           res.end("{\"error\":\""+error+"\"}");
        }
    }
}

function getAmountOfGroupsByUser(userId,ref_db,callback){
    var counter=0;
    ref_db.orderByChild("userId").equalTo(userId).once("value", (snapshot)=>{
      counter=snapshot.numChildren(); 
      callback(counter);
    });
  }
  
  function getAmountOfGroupsWithTheSameName(groupName, userId,ref_db, callback){
    var counter=0;
    ref_db.orderByChild("groupName").equalTo(groupName).once("value", (snapshot)=>{ 
      snapshot.forEach((childSnapshot)=>{
        if(childSnapshot.val().userId===userId){
          counter=1;
        }
      });
      callback(counter);
    });
  }