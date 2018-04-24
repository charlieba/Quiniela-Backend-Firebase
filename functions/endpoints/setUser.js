module.exports={
    setUser: function(req,res,admin,email){
        var ref_db = admin.database().ref('/users');
        res.set('Content-Type', 'application/json');
        var re = /\S+@\S+\.\S+/;
        if(re.test(email)){
            try {
                userExists(email,ref_db,(response)=>{
                  var key="";
                  if(response===0){
                      var data={
                          email: email, 
                      }
                      var insertGroup = ref_db.push(data);
                      key = insertGroup.key;
                      response=response+1;
                      res.end("{\"userID\":\""+key+"\"}");
                  }else{
                    res.end("{\"errror\":\"User already exits\"}");
                  }
                });
              } catch (error) {
                 res.end("{\"error\":\""+error+"\"}");
              }
        }else{
            res.end("{\"error\":\"Invalid email\"}");
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
  