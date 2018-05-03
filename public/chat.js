console.log('from chat.js')
var socket = io('http://localhost:3000/')

async function fetchFromURLtest(){
  let d = await fetch("https://api.chucknorris.io/jokes/random")
  console.log(d)
}

async function fetchGroups(){
  let groups = await fetch("group/allgroups").then(res => res.json())
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

$('#addTopicBtn').click(() => {
  console.log("createGroup")
  let groupName = $('#nameTopic').val()
  fetch('./group/createGroup',{
    method: "POST",
    body: JSON.stringify(groupName,clientID)
  }).then(data => {
    console.log("createGroup data back",data)
  })
})

const genGroup = () => {
  var topic = "Topic ";
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  event.preventDefault();
  topic = $('#nameTopic').val();
  $('#nameTopic').val("")
  $("#topicList").append('<a href="#" id="id'+topic+'" class="list-group-item list-group-item-action flex-column align-items-start rcorners dropBoxShadow" style="margin-bottom:20px">'
    + '<div class="d-flex w-100 justify-content-between">'
    + '<h5 class="mb-1">'+topic+'</h5>' // Topic
    + '  <button type="button" class="close" aria-label="Close">'
    + '       <span aria-hidden="true">&times;</span>'
    + '    </button>'
    + '  <div class="my-auto list-group">'
    + '  </div>'
    + '</div>'
    + '<div class="d-flex">'
    + '<p class="mb-1" style="height:2em;line-height: 2em;white-space: nowrap;text-overflow: ellipsis;overflow:hidden;width:23em;">'+lastChat+'</p>' 
    + '    <small style=" width: 74px;">'+time+'</small>' // Date
    + '    <span class="badge badge-primary badge-pill mx-auto">'+notRead+'</span>' //Not read 
    + '</div>'
    + '</a>'
  );
}