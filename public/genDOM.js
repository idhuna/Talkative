// $('#addGroupBtn').click(()=>{
//     var group = $('#nameGroup').val
//     console.log("hi",group)
//     if(group.length > 0){
//         createGroup
//     }
// })

const joinGroup = () =>{
    let groupName = $('#joinedGroup').val()
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
