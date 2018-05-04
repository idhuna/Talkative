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
let msges = {}


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

socket.on('init',msges => {
  socket.msges = msges
})

socket.on('update',groupName => {
  console.log('we have to update this group',groupName)
})

socket.on('groups',groups => {
  console.log("update groups")
  socket.joinedGroups = groups
  console.log(socket.joinedGroups)
  groups.forEach(group => genGroup(group))
})

$('#join').click(() => {
  console.log("join!!")
})

function sendMSG(){
  let msg = $('#btn-input').val()
  let groupName = $('#chatHeader').text()
  if(groupName === " Select Some Chat"){
    alert("Please chose group to send some message")
    $('#btn-input').val('')
    return
  }
  console.log("sending...",msg)
  socket.emit('msg',groupName,clientID,msg)
  addMyChat()
  $('#btn-input').val('')
}

$(document).ready(function(){
    console.log("doc rdy");
    let msg
    $('#btn-chat').click(() =>{
      sendMSG()
    })
    $('#btn-input').keypress(function(e) {
      if(e.which == 13) {
          sendMSG()
        }
    });
    $('.list-group').on('click','a.joinedGroup',() => {
      console.log('rerender chat')
      let id = $(this)[0].activeElement.id
      let groupName = id.substr(7)
    })
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

const genUnGroup = () => {
  var group = "Group";
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  event.preventDefault();
  group = $('#nameGroupJoin').val();
  $('#nameGroupJoin').val("")
  $("#unGroupList").append('<a href="#" id="idGroup'+group+'" class="list-group-item list-group-item-action flex-column align-items-start rcorners dropBoxShadow" style="margin-bottom:20px">'
    + '<div class="d-flex w-100 justify-content-between">'
    + '<h5 class="mb-1">'+group+'</h5>' // Group
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
  $('#idGroup'+group).click(() => {
        event.preventDefault();
        console.log(group);
        $('#chatHeader').text(group);
  });
  $('#idGroup'+group).on("click",".close",function() {
        event.preventDefault();
        // event.stopImmediatePropagation();
        $(this).parents("a").remove();
        console.log("remove");
    });
}

