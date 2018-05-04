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
  let groupName = $('#nameTopic').val()
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


$('#addTopicBtn').click(()=>{
  var topic = $('#nameTopic').val 
  if(topic.length > 0){
      console.log("hi",topic)
      createGroup()
  }
})


const genGroup = () => {
  var topic = "Topic ";
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  event.preventDefault();
  topic = $('#nameTopic').val();
  $('#nameTopic').val("")
  $("#topicList").append('<a href="#" id="idTopic'+topic+'" class="list-group-item list-group-item-action flex-column align-items-start rcorners dropBoxShadow" style="margin-bottom:20px">'
    + '<div class="d-flex w-100 justify-content-between">'
    + '<h5 class="mb-1">'+topic+'</h5>' // Topic
    + '  <button type="button" class="close" aria-label="Close">'
    + '       <span aria-hidden="true">&times;</span>'
    + '    </button>'
    + '</div>'
    + '<div class="d-flex">'
    + '<p class="mb-1" style="height:2em;line-height: 2em;white-space: nowrap;text-overflow: ellipsis;overflow:hidden;width:23em;">'+lastChat+'</p>'
    + '  <div class="my-auto list-group">'
    + '    <small style=" width: 74px;">'+time+'</small>' // Date
    + '    <span class="badge badge-primary badge-pill mx-auto">'+notRead+'</span>' //Not read
     + '  </div>'
    + '</div>'
    + '</a>'
  );
  console.log('imbaeiei',$('a h5').text());
  $('#idTopic'+topic).click(() => {
        event.preventDefault();
        console.log(topic);
        $('#chatHeader').text(topic);
  });
   $('#idTopic'+topic).on("click",".close",function() {
        event.stopImmediatePropagation();
     });
  $('#idTopic'+topic).on("click",".close",function() {
        event.preventDefault();
        // event.stopImmediatePropagation();
        $(this).parents("a").remove();
        console.log("remove");
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
