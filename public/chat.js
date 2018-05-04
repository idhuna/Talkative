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
  socket.emit("clientID",clientID)
})

socket.on('disconnect', () => {
  console.log(`we're disconnected`)
})

socket.on('reconnect_attempt', () => {
  console.log('attemp_to_reconnect')
})

socket.on('msg',(groupName,msg) => {
  console.log('receive: ',groupName,msg)
})

socket.on('update',groupName => {
  console.log('we have to update this group',groupName)
})

socket.on('groups',groups => {
  console.log("update groups")
  socket.joinedGroups = groups
  updateGroup()
})

$('#join').click(() => {
  console.log("join!!")
})

$(document).ready(function(){
    console.log("doc rdy");
    $('#btn-chat').click(() =>{
        socket.emit('msg',"hello",clientID,"some msg")
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

