// $('#addTopicBtn').click(()=>{
//     var topic = $('#nameTopic').val 
//     console.log("hi",topic)
//     if(topic.length > 0){
//         createGroup
//     }
// })

const joinGroup = () =>{
    let groupName = $('#joinedTopic').val()
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

$('#joinTopicBtn').click(()=>{
    var topic = $('#joinedTopic').val()
    console.log("hi",topic)
    if(topic.length > 0){
        joinGroup()
    }
})

$('#noti').click(()=>{
    console.log("close noti")
    $('#noti').toggleClass("fa-bell fa-bell-slash")
})