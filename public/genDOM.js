
const addMyChat = (sender,msg) => {
  chat = msg;
  if(chat == "") return;
  var src = "http://placehold.it/50/FA6F57/fff&text=ME";
  var myName = sender
  $('#chatMessage').append('<li class="mb-3" style="border:hidden;">\
  <div class="d-flex flex-row-reverse"><div class="chat-img float-right"><img class="rounded-circle" src='+src+' alt="User Avatar"></div>\
  <div class="mr-3"><div class="header" style="text-align: right;"><strong class="primary-font">'+myName+'</strong></div>\
  <div class="chatBox">'+chat+'</div><small class="text-muted">13 mins ago</small></div></div></li>')
}
const addAnotherChat = (sender,msg) => {
  var chat = msg
  if(chat == "") return;
  var src = "http://placehold.it/50/55C1E7/fff&amp;text=U";
  var anotherName = sender
  $('#chatMessage').append('<li class="mb-3" style="border:hidden;">\
  <div class="d-flex flex-row"><div class="chat-img float-left"><img class="rounded-circle" src='+src+' alt="User Avatar"></div>\
  <div class="ml-3"><div class="header"><strong class="primary-font">'+anotherName+'</strong></div>\
  <div class="chatBox">'+chat+'</div><small class="float-right text-muted">12 mins ago</small></div></div></li>')
}
// $('#addTopicBtn').click(()=>{
//     var topic = $('#nameTopic').val 
//     console.log("hi",topic)
//     if(topic.length > 0){
// $('#addGroupBtn').click(()=>{
//     var group = $('#nameGroup').val
//     console.log("hi",group)
//     if(group.length > 0){
//         createGroup
//     }
// })

const genGroup = (group) => {
  console.log("in genGroup",group)
  var group;
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  // event.preventDefault();
  $('#nameGroup').val("")
  $("#groupList").append('<a href="#" id="idGroup'+group+'" class="list-group-item list-group-item-action flex-column align-items-start rcorners dropBoxShadow hvr-underline-from-center joinedGroup" style="margin-bottom:20px">'
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
        // event.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
        $(this).parents("a").remove();
        console.log("remove");
        console.log("leaving group",$(this).parents("a").find("h5").text())
        let groupName = $(this).parents("a").find("h5").text()
        fetch('users/leavegroup',{
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            clientID:clientID,
            groupName:groupName
          })
        }).then(res => res.text()).then(data => console.log(data))
        genUnGroup(groupName)
        let index = socket.joinedGroups.indexOf(groupName)
        socket.joinedGroups.splice(index, 1)
    });
}

const genUnGroup = (group) => {
  var time = "1 hour ago";
  var notRead = "xx";
  var lastChat = "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.";
  event.preventDefault();
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
}

const joinGroup = () =>{
    let groupName = $('#joinedGroup').val()
    $('#joinedGroup').val('')
    fetch('users/joingroup',{
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientID:clientID,
        groupName:groupName
      })
    }).then(res => res.text()).then(data => console.log(data))
    $(`#idGroup${groupName}`).remove()
    genGroup(groupName)
    socket.joinedGroups.push(groupName)
    socket.emit('getmsg',groupName)
  }

$('#joinedGroup').submit((e) => {
    e.preventDefault()
    joinGroup()
})

$('#joinGroupBtn').click(()=>{
    var group = $('#joinedGroup').val()
    console.log("hi",group)
    if(group.length > 0){
        joinGroup()
    }
})

// $('#noti').click((e)=>{
//     console.log("toggle noti")
//     $('#noti').toggleClass("fa-bell fa-bell-slash")
//     // e.preventDefault();
//     // e.stopPropagation();
// })
