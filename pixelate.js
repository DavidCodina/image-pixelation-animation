function precise(n){
  return parseFloat(parseFloat(n).toPrecision(2));
}


/* =============================================================================

============================================================================= */


function disableSmoothRendering(ctx){
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled    = false;
  ctx.msImageSmoothingEnabled     = false;
  ctx.imageSmoothingEnabled       = false;
  return ctx;
}


/* =============================================================================
                            Constructor
============================================================================= */


function Pixelate(image, opts){
  opts                      = opts || {};
  this.image                = image;
  this.amount               = precise(1 - (opts.amount|| 0));
  this.imageUrl             = image.src;
  this.width                = image.clientWidth;
  this.height               = image.clientHeight;
  this.canvas               = document.createElement('canvas');
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
  this.ctx                  = this.canvas.getContext('2d');
  this.ctx                  = disableSmoothRendering(this.ctx);
  this.pixelImage           = new Image();


  /* ==============================

  ============================== */


  if (this.image.complete){
    // It's not at all clear why this is necessary, but I added it, and it seems to fix the loading issue.
    //setTimeout(() => { this.init(); }, 150);
    this.init();
  } else {
    console.log("Not complete yet.");
  }

  return this;
} //function Pixelate()


/* =============================================================================
                                 init()
============================================================================= */


Pixelate.prototype.init = function(){
  this.image.parentNode.appendChild(this.canvas, this.image);
  this.image.parentNode.querySelector('CANVAS').style.display = 'none';

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
  this.amount = precise(1 - (amount|| 0));
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
  this.ctx = disableSmoothRendering(this.ctx);
  return this;
};


/* =============================================================================
                             render()
============================================================================= */


Pixelate.prototype.render = function(){
  if (!this.ready){
    console.log("Not ready yet.");
    return this;
  }

  var w = this.width  * (this.amount <= 0 ? 0.01 : this.amount);
  var h = this.height * (this.amount <= 0 ? 0.01 : this.amount);

  this.ctx.drawImage(this.pixelImage, 0, 0, w, h);                            // render smaller image
  this.ctx.drawImage(this.canvas, 0, 0, w, h, 0, 0, this.width, this.height); // stretch the smaller image
  this.image.src = this.canvas.toDataURL('image/png');
  return this;
};
