$(document).ready( () => {

  console.log('IronGenerator JS imported successfully!');
  
//     document.getElementById('game-button').onclick = function(){
//       console.log('clicked!!')
//     //   axios.get("/characters")
//     //   .then(character => {
//     //     $('.characters-container').empty();
//     //     character.data.forEach(oneCharacter => {
//     //        $(".characters-container").append(
//     //         `<div class = "character-info">
//     //         <h3> Name: ${oneCharacter.name} </h3>
//     //         <p> Occupation: ${oneCharacter.occupation} </p>
//     //         <p> Weapon: ${oneCharacter.weapon} </p>
//     //         <p> Cartoon: ${oneCharacter.cartoon} </p>
//     //         </div>
//     //         `
//     //        )
//     //     });
//     // }
//   // )
// }

})
$(document).on('click','#reload',function () {
  const gameId = this.name
  console.log(gameId)
  axios.get('/game/'+gameId)
  .then(response => {
    console.log('this ran success')
  }).catch(err => console.log(err))
})

$(document).on('click', '#edit', function() { 
  const commentId = this.name
  const textVal = $("#"+commentId).val()   
  let data = {id: commentId,
      text:textVal }
  
  axios.post(`/edit/`, data)
  .then(response => {
      console.log("success",data)
      location.reload()
  })
  .catch(err => {
      console.log(err);
  })
 
});

$(document).on('click', '#delete', function() { 
  const commentId = this.name
  let data = {id: commentId}
  // alert('clicked!')
  axios.post(`/delete`, data)
  .then(response => {
      console.log("success",data)
      location.reload()
  })
  .catch(err => {
      console.log(err);
  })
 
});


