//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Number/toPrecision
//https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
function precise(n){
  return parseFloat(parseFloat(n).toPrecision(2));
}


/* =============================================================================
                            Constructor
============================================================================= */


function Pixelate(image, options){
  options     = options || {};
  this.image  = image;
  this.amount = precise(1 - (options.amount || 0));
  this.init();
  return this;
}


/* =============================================================================
                                 init()
============================================================================= */


Pixelate.prototype.init = function(){
  if (!this.image.complete){
    console.log("Not complete yet. Will rerun init().");
    setTimeout(() => { this.init(); }, 50);
    return;
  } else {
    console.log("It's complete now!");
  }


  this.imageUrl             = image.src;
  this.width                = image.clientWidth;
  this.height               = image.clientHeight;
  this.canvas               = document.createElement('CANVAS');
  this.canvas.width         = this.width;
  this.canvas.height        = this.height;
  this.canvas.style.cssText = 'image-rendering: optimizeSpeed;' +             // FireFox < 6.0
                              'image-rendering: -moz-crisp-edges;' +          // FireFox
                              'image-rendering: -o-crisp-edges;' +            // Opera
                              'image-rendering: -webkit-crisp-edges;' +       // Chrome
                              'image-rendering: crisp-edges;' +               // Chrome
                              'image-rendering: -webkit-optimize-contrast;' + // Safari
                              'image-rendering: pixelated; ' +                // Future browsers
                              '-ms-interpolation-mode: nearest-neighbor;';    // IE
  this.ctx                             = this.canvas.getContext('2d');
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.mozImageSmoothingEnabled    = false;
  this.ctx.msImageSmoothingEnabled     = false;
  this.ctx.imageSmoothingEnabled       = false;
  this.pixelImage                      = new Image();


  // This was part of the original, but seems unnecessary.
  // this.image.parentNode.appendChild(this.canvas, this.image);
  // this.image.parentNode.querySelector('CANVAS').style.display = 'none';


  this.pixelImage.onload = function(){
    this.ready = true;
    this.render();
  }.bind(this);


  this.pixelImage.src = this.imageUrl; //Doing this will inoke the onload function above.
}


/* =============================================================================
                           setAmount()
============================================================================= */


Pixelate.prototype.setAmount = function(amount){
  this.amount = precise(1 - (amount || 0));
  return this;
};


/* =============================================================================
                              setWidth()
============================================================================= */
// Called only on resizing.


Pixelate.prototype.setWidth = function(width){
  var height         = (this.height / this.width) * width;
  this.width         = width;
  this.height        = height;
  this.canvas.width  = this.width;
  this.canvas.height = this.height;
  return this;
};


/* =============================================================================
                             render()
============================================================================= */


Pixelate.prototype.render = function(){
  if (!this.ready){
    console.log("Not ready yet. Will rerun render()");
    setTimeout(() => { this.render(); }, 100);
    return this;
  }

  var w = this.width  * (this.amount <= 0 ? 0.01 : this.amount);
  var h = this.height * (this.amount <= 0 ? 0.01 : this.amount);

  this.ctx.drawImage(this.pixelImage, 0, 0, w, h);                            // render smaller image
  this.ctx.drawImage(this.canvas, 0, 0, w, h, 0, 0, this.width, this.height); // stretch the smaller image
  this.image.src = this.canvas.toDataURL('image/png');
  return this;
};
