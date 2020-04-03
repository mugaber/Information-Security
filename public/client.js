const socket = io()

$(document).ready(function() {
  // Form submittion with new message in field with id 'm'
  $('form').submit(function() {
    var messageToSend = $('#m').val()
    //send message to server here?
    /**global io */

    $('#m').val('')
    return false // prevent form submit from refreshing page
  })
})
