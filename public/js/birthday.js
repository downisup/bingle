// const { request } = require('express');
// const { htmlPrefilter } = require("jquery");
// const post = require("../../models/post");

const { json } = require("body-parser");





console.log("hello form the birthday.js file!!")
var flag = 0;
function openForm() {
    console.log("opened form");
    document.getElementById("postForm").style.display = "block";
    flag = 1;
  }
if(flag===1 && 4(document).on('click','body *')){
  
    document.getElementById('postForm').style.display = "none";
    flag =0;
}

function likedpost(el){
  var id = el.dataset.postid;
  var author = el.dataset.author;
    console.log("id form likedpost function =" +id+"and author of this post is="+author);
    console.log('post liked');
   var request = $.ajax({
    type: "POST",
    url: "api/index/like",
    data: {id: id, author:author},
    async:false,
    dataType:"html",
    success: function(data){
      findingnumberoflikes(data,id);
      console.log("action performed successfully")
    },
    error: function(){
      console.log("error occured");
    }

    });
  }
  function findingnumberoflikes(data,id)
  {
    console.log("the data returned is "+ data);
    console.log("id form the findnooflikes fn "+id)
    const value= JSON.parse(data);
    console.log(value);
    document.getElementById('likescounter-'+id).innerHTML=value.data;

     console.log("likes counter updated");
  }
  


  
  function commentedonpost(el){
    var id= el.dataset.postid;
    var author = el.dataset.author;
    console.log("id from the commentedonpost fn "+id);
    console.log("commentform- "+id);
    document.getElementById('commentinput'+id).style.display="flex";
    document.getElementById('commentbtn-'+id).style.display="none";

  }



  function submitcommentform(el) {
    var id = el.dataset.blogid;
   var content = document.getElementById('commentinput'+id).value;
   content.trim();
    
   //need to clear the input fields after req is made
   var author = el.dataset.author;
   console.log(content);
   var request = $.ajax({
    type: "POST",
    url: "api/index/comment",
    data: {blogid: id, content:content, author:author},
    async:false,
    dataType:"html",
    success: function(data){
      console.log("from success of submitcomment form fn "+data);
      subitcommentformsuccess(data,id);
      // need to add a function which would show all the comments in a list view
      console.log("action performed successfully");
    },
    error: function(){
      console.log("error occured");
    }

    });
    
  }
function subitcommentformsuccess(data,id){
  // hide the input comment field again
  

  //show the recent comment in div
  const value = JSON.parse(data);
  console.log(value);
  document.getElementById('commentdisplaytext'+id).innerHTML=value.data;



}

function likedcomment(el) {
  var commentid = el.dataset.commentid;
  var author = el.dataset.author;
  var postid = el.dataset.postid;
  var request = $.ajax({
    type: "POST",
    url: "api/index/likedcomment",
    data: {commentid: commentid, postid:postid, author:author},
    dataType:"html",
    success: function(data){
      console.log("from success of submitcomment form fn "+data);
      likesupdated(data,commentid);
      // need to add a function which would show all the comments in a list view
      console.log("action performed successfully");
    },
    error: function(){
      console.log("error occured from likedcomment ajax fn");
    }

    });
   
  
}

function likesupdated(data,commentid)
{
  const value = JSON.parse(data);
  document.getElementById('commentlikesdisplay'+commentid).innerHTML=value.data;

}

function commentoptionclicked(el){
  console.log("clicked comment option button");
  $(".editedinputcommentform").hide();
  $(".editedinputpostform").hide();
  $(".postoptioncontent").hide();
  var state = el.dataset.state;
  var id = el.dataset.commentid;
  if(state=="closed"){
    document.getElementById('commentoptioncontent'+id).style.display="flex";
    el.setAttribute('data-state',"opened")


  }else {
    document.getElementById('commentoptioncontent'+id).style.display="none";
    el.setAttribute('data-state',"closed")
  }
}


function editcommentclick(el){
  var commentid = el.dataset.commentid;
  //for all classname editedinputcomment close the edit input textarea and dropdown
  $(".commentoptioncontent").hide();
  $(".postoptioncontent").hide();
  document.getElementById('editedinputcommentform'+commentid).style.display="flex";
  document.getElementById('editedinputcomment'+commentid).style.display="flex";
  document.getElementById('editedinputcomment'+commentid).focus();
  var commentcontent = document.getElementById('actualcommentcontent'+commentid).textContent;
  document.getElementById('editedinputcomment'+commentid).value=commentcontent.toString().trim();
  console.log(commentcontent.toString().trim());
}


function updatecomment(el){
var commentid= el.dataset.commentid;
var content = document.getElementById('editedinputcomment'+commentid).value;
var author = el.dataset.author;
  
document.getElementById('editedinputcommentform'+commentid).style.display="none";
$(".editedinputcommentform").hide();
$(".commentoptioncontent").hide();
var request = $.ajax({
  type: "PUT",
  url: "api/index/updatecomment",
  data: {commentid: commentid, content:content, author:author},
  dataType:"html",
  success: function(data){
    console.log("from success of submitcomment form fn "+data);
    // need to add a function which would show all the comments in a list view
    updatedcomment(data,commentid);
    console.log("action performed successfully");
  },
  error: function(){
    console.log("error occured from updatecomment ajax fn");
    alert("you can not edit this comment");
  }

  });

console.log("updated comment");
}

function updatedcomment(data,id) {

  const value = JSON.parse(data);
  console.log("value = "+value.data.content)
  console.log('actualcommentcontent'+id);
  document.getElementById('actualcommentcontent'+id).innerHTML= value.data.content;
  
}
function deletecomment(el){
  var id = el.dataset.id;
    var request = $.ajax({
      type: "PUT",
      url: "api/index/deletecomment",
      data: {id: id},
      dataType:"html",
      success: function(data){
        console.log("from success of submitpost form fn "+data);
        // need to add a function which would show all the comments in a list view
        deletedcomment(data,id);
        console.log("action performed successfully");
      },
      error: function(){
        console.log("error occured from deletecomment ajax fn");
      }
    
      });
}
function deletedcomment(data,id){
var section ="commentdisplayitemdiv"+id;
document.getElementById(section).style.display="none";
}

//post button
//hide is not working as desired find out why 

function postoptionbutton(el){
  console.log("clicked post option button");
  $(".editedinputpostform").hide();
  $(".editedinputcommentform").hide();
  $(".commentoptioncontent").hide();
  var state = el.dataset.state;
  var id = el.dataset.postid;
  if(state=="closed"){
    document.getElementById('postoptioncontent'+id).style.display="flex";
    el.setAttribute('data-state',"opened")


  }else {
    document.getElementById('postoptioncontent'+id).style.display="none";
    el.setAttribute('data-state',"closed")
  } 
}
function editpostclick(el){
  var postid = el.dataset.postid;
  //for all classname editedinputcomment close the edit input textarea and dropdown
  $(".postoptioncontent").hide();
  $(".commentoptioncontent").hide();
  document.getElementById('editedinputpostform'+postid).style.display="flex";
  document.getElementById('editedinputpost'+postid).style.display="flex";
  document.getElementById('editedinputpost'+postid).focus();
  var postcontent = document.getElementById('actualpostcontent'+postid).textContent;
  document.getElementById('editedinputpost'+postid).value=postcontent.toString().trim();
  console.log(postcontent.toString().trim());
}

function updatepost(el){
  var postid= el.dataset.postid;
  var content = document.getElementById('editedinputpost'+postid).value;
  var author = el.dataset.author;
    
  document.getElementById('editedinputpostform'+postid).style.display="none";
  $(".editedinputpostform").hide();
  $(".postoptioncontent").hide();
  var request = $.ajax({
    type: "PUT",
    url: "api/index/updatepost",
    data: {postid: postid, content:content, author:author},
    dataType:"html",
    success: function(data){
      console.log("from success of submitpost form fn "+data);
      // need to add a function which would show all the comments in a list view
      updatedpost(data,postid);
      console.log("action performed successfully");
    },
    error: function(){
      console.log("error occured from updatepost ajax fn");
      alert("you can not edit or delete the post... you are not the owner!")
    }
  
    });
  
  console.log("updated post");
  }
  
  function updatedpost(data,id) {

    const value = JSON.parse(data);
    console.log("value = "+value.data.content)
    console.log('actualpostcontent'+id);
    document.getElementById('actualpostcontent'+id).innerHTML= value.data.content;
    
  }

  function deletepost(el)
  {
    var postid = el.dataset.postid;
    var request = $.ajax({
      type: "PUT",
      url: "api/index/deletepost",
      data: {postid: postid},
      dataType:"html",
      success: function(data){
        console.log("from success of submitpost form fn "+data);
        // need to add a function which would show all the comments in a list view
        deletedpost(data,postid);
        console.log("action performed successfully");
      },
      error: function(){
        console.log("error occured from deletepost ajax fn");
      }
    
      });
      
  }
  function deletedpost(data,postid){
    var section = "card"+postid;
    console.log("section="+section);
    document.getElementById(section).style.display="none";
  }

  //search----------------------
function search(q){
    $('.resultitem').remove();
    var q = q;
    console.log("query s = "+q);
    if(q===""){
      console.log("empty query")
      $('.resultdiv').hide();
    }
    else{
    var request = $.ajax({
      type: "PUT",
      url: "api/index/searchuser",
      data: {q:q},
      dataType:"html",
      success: function(data){
        console.log("Data(Users) from the serach fn "+data);
        // need to add a function which would show all the comments in a list view
        searchresults(data);
        console.log("users= "+data);
      },
      error: function(){
        console.log("error occured from the serach  ajax fn");
        
      }
    
      });
    }

  }

function searchresults(data){
    var users = JSON.parse(data);
  
    //for each item assign the user id
    //on click search for user 
    $.each(users,function(value){
      console.log("user in users is = "+value.name);
    })

    $('.resultdiv').show();
    $.each(users, function(index, value) {
            $('<div>', { 
              
              class:'resultitemdiv'
          })  //append to add the image here
          .append( $('<button>', { 
              id: '??',
              class:"resultitem",
              "data-id":value.id,
              "data-name":value.name,
              'text':value.name,
              "onclick":"gotofriend(this)"
              

          })).appendTo('.result');

        });




  }
   

  function gotofriend(el){
    var id = el.dataset.id;
    var  username = el.dataset.name;
    console.log("usernameformgotofriend="+username);
    console.log("id form fn ="+id);


    var request = $.ajax({
      type: "get",
      url: "/api/index/lookforuser",
      data: {username: username, id:id},
      dataType:"html",
      success: function(data){
        console.log("from success of submitpost form fn "+data);
        // need to add a function which would show all the comments in a list view
        //updatedpost(data,postid);
        console.log("action performed successfully");
      },
      error: function(){
        console.log("error occured from lookforuser ajax fn");
      }
    
      });
   
  }
  
    //create a get req in server file localhost3000/?id which will open up the respective users page
    //check session data to confirm the username 