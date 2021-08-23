function sendfriendreq(el){
    var guestid = el.dataset.guestid;

    var request = $.ajax({
        type: "put",
        url: "/api/index/friendreqsent",
        data: {guestid: guestid},
        dataType:"html",
        success: function(data){
          console.log("from success of friendreqsent fn "+data);
          // need to add a function which would show all the comments in a list view
          //updatedpost(data,postid);
          console.log("action performed successfully");
        },
        error: function(){
          console.log("error occured from friendreqsent ajax fn");
        }
      
        });
}