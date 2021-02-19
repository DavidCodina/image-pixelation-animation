window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;


const image           = document.querySelector('#pixelated-img');
let pixelationAmount  = 90;
let pixelate          = null;


/* =============================================================================

============================================================================= */


function update(amount){
  pixelate.setAmount(amount / 100).render();
}


/* =============================================================================

============================================================================= */


function togglePixelation(){
  const loops = 15;

  if (pixelationAmount === 90){
    //TLDR : https://www.freecodecamp.org/news/thrown-for-a-loop-understanding-for-loops-and-timeouts-in-javascript-558d8255d8a4/
    // Even though we are going down, we want to set the count to go upward, so the setTimeout will work correctly.
    for (let i = 0; i <= loops; i++){
      setTimeout(() => {
        if (i !== loops){
          pixelationAmount -= 1;
          update(pixelationAmount);
        } else {
          pixelationAmount = 0;
          update(pixelationAmount);
        }
      }, i * 50);
    }
  }


  else if (pixelationAmount === 0){
    for (let i = 0; i <= loops; i++){
      setTimeout(() => {
        if (i === 0){
          pixelationAmount = 75;
          update(pixelationAmount);
        }
        else {
          pixelationAmount += 1;
          update(pixelationAmount);
        }
      }, i * 50);
    }
  }
  // else { console.log("The value was in transition"); }
}


/* =============================================================================

============================================================================= */


image.addEventListener('click', togglePixelation);

window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded. Creating Pixelate instance now.");
  pixelate = new Pixelate(image, { amount: pixelationAmount / 100 });
});

window.onresize = function(){
  pixelate.setWidth(image.parentNode.clientWidth).render();
};
