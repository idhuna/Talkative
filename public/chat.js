console.log('from chat.js')
var socket = io('http://localhost:3000')

async function fetchFromURLtest(){
  let d = await fetch("https://api.chucknorris.io/jokes/random")
  console.log(d)
}

async function fetchGroups(){
  let groups = await fetch("group/all").then(res => res.json())
  console.log("fetchGroups",groups)
}

// we set these in pug
console.log("clientID",clientID)

socket.on('connect', () => {
  console.log(`we're connected`, socket.connected)
  console.log("this is our socket",socket)
})

socket.on('disconnect', () => {
  console.log(`we're disconnected`)
})

socket.on('msg',(groupID,msg) => {
  console.log('receive: ',groupID,msg)
})

$('#join').click(() => {
  console.log("join!!")
})

$(document).ready(function(){
    console.log("doc rdy");
    $('#btn-chat').click(() =>{
        socket.emit('msg',"some group",clientID)
        addMyChat();
    })
    $('#btn-input').keypress(function(e) {
    if(e.which == 13) {
        addAnotherChat();
        }
    });
})

const createGroup = () =>{
  let groupName = $('#nameGroup').val()
  fetch('group/creategroup',{
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      groupName:groupName,
      clientID:clientID
    })
  }).then(res => res.text()).then(data => console.log(data))
}

$('#createGroup').submit((e) => {
    console.log("createGroup")
    e.preventDefault()
    createGroup()
})


$('#addGroupBtn').click(()=>{
  var group = $('#nameGroup').val()
  if(group.length > 0){
      console.log("hi",group)
      genGroup();
      createGroup()
  }
})

const genGroup = () => {
  var group = "Group ";
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  event.preventDefault();
  group = $('#nameGroup').val();
  $('#nameGroup').val("")
  $("#groupList").append('<a href="#" id="idGroup'+group+'" class="list-group-item list-group-item-action flex-column align-items-start rcorners dropBoxShadow hvr-underline-from-center" style="margin-bottom:20px">'
    + '<div class="d-flex w-100 justify-content-between">'
    + '<h5 class="mb-1">'+group+'</h5>' // Group
    + '<div class="d-flex" style="width:10px;"></div><i class="fas fa-bell" id="noti" style="padding-top:1%"></i><div class="d-flex w-75"></div>'
    + '  <div class="close" aria-label="Close">'
    + '       <span aria-hidden="true">&times;</span>'
    + '    </div>'
    + '</div>'
    + '<div class="d-flex">'
    + '<p class="mb-1">'+lastChat+'</p>'
    + '  <div class="my-auto list-group">'
    + '    <small style=" width: 74px;">'+time+'</small>' // Date
    + '    <span class="badge badge-primary badge-pill mx-auto">'+notRead+'</span>' //Not read
    + '  </div>'
    + '</div>'
    + '</a>'
  );
  $('#idGroup'+group+' #noti').click((e)=>{
    $('#idGroup'+group+' #noti').toggleClass("fa-bell fa-bell-slash");
    e.preventDefault();
    e.stopPropagation();
  })
  $('#idGroup'+group).click(() => {
        event.preventDefault();
        console.log(group);
        $('#chatHeader').text(group);
  });
  $('#idGroup'+group).on("click",".close",function(e) {
        event.preventDefault();
        console.log("Leaving Group",$(this).parents("a").find("h5").text());
        $(this).parents("a").remove();
        e.preventDefault();
        e.stopPropagation();
    });
}


const genUnGroup = () => {
  var group = "Group";
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  event.preventDefault();
  // group = $('#nameGroupJoin').val();
  // $('#nameGroupJoin').val("")
  $("#unGroupList").append('<a href="#" id="idGroup'+group+'" class="list-group-item list-group-item-action flex-column align-items-start rcorners dropBoxShadow" style="margin-bottom:20px">'
    + '<div class="d-flex w-100 justify-content-between">'
    + '<h5 class="mb-1">'+group+'</h5>' // Group
    + '  <button type="button" class="close" aria-label="Close">'
    + '       <span aria-hidden="true">&times;</span>'
    + '    </button>'
    + '</div>'
    + '<div class="d-flex">'
    + '<p class="mb-1">'+lastChat+'</p>'
    + '  <div class="my-auto list-group">'
    + '    <small style=" width: 74px;">'+time+'</small>' // Date
    + '    <span class="badge badge-primary badge-pill mx-auto">'+notRead+'</span>' //Not read
     + '  </div>'
    + '</div>'
    + '</a>'
  );
  $('#idGroup'+group).click(() => {
        event.preventDefault();
        console.log(group);
        $('#chatHeader').text(group);
  });
  $('#idGroup'+group).on("click",".close",function(e) {
        event.preventDefault();
        console.log("Leaving Group",$(this).parents("a").find("h5").text());
        $(this).parents("a").remove();
        e.preventDefault();
        e.stopPropagation();
    });
}

const addMyChat = () => {
    console.log('add my chat');
    var chat = $('#btn-input').val();
    if(chat == "") return;
    var src = "http://placehold.it/50/FA6F57/fff&text=ME";
    var myName = "Bhaumik Patel"
    $('#chatMessage').append('<li class="mb-3" style="border:hidden;">\
    <div class="d-flex flex-row-reverse"><div class="chat-img float-right"><img class="rounded-circle" src='+src+' alt="User Avatar"></div>\
    <div class="mr-3"><div class="header" style="text-align: right;"><strong class="primary-font">'+myName+'</strong></div>\
    <div class="chatBox">'+chat+'</div><small class="text-muted">13 mins ago</small></div></div></li>')
}
const addAnotherChat = () => {
    console.log('add Another chat');
    var chat = $('#btn-input').val();
    if(chat == "") return;
    var src = "http://placehold.it/50/55C1E7/fff&amp;text=U";
    var anotherName = "Jack Sparrow"
    $('#chatMessage').append('<li class="mb-3" style="border:hidden;">\
    <div class="d-flex flex-row"><div class="chat-img float-left"><img class="rounded-circle" src='+src+' alt="User Avatar"></div>\
    <div class="ml-3"><div class="header"><strong class="primary-font">'+anotherName+'</strong></div>\
    <div class="chatBox">'+chat+'</div><small class="float-right text-muted">12 mins ago</small></div></div></li>')
}
