
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