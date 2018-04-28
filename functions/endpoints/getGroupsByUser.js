module.exports={
    getGroupsByUser: function(req,res,admin,email,tournamentId){
        var ref_db = admin.database().ref('/groups');
        res.set('Content-Type', 'application/json');
            try {
                userExists(email,ref_db,(response)=>{
                  var key="";
                  if(response===0){
                    res.end("{\"errror\":\"User already exits\"}");
                  }else{
                    res.end("{\"errror\":\"User already exits\"}");
                  }
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        
    }
}

function userExists(email,ref_db,callback){
    var counter=0;
    console.log(email);
    ref_db.child("members").orderByChild("email").equalTo("giovanib07@gmail.com").on("value", (snapshot)=>{
      console.log(snapshot.val());
      counter=snapshot.numChildren(); 
      console.log(snapshot.numChildren());
      callback(counter);
    });
  }
  