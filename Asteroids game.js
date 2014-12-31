// https://github.com/BuddyLamers/asteroids
// This is the main file from my Asteroids game. 
//  It showcases namespacing and prototypical inheritance in JavaScript

Function.prototype.inherits = function(superclass) {
  function Surrogate() {};
  Surrogate.prototype = superclass.prototype;
  this.prototype = new Surrogate();
};


(function (root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function (numAsteroids) {
    this.asteroids = [];
    this.bullets = [];
    this.addAsteroids(numAsteroids);
    this.bindKeyHandlers();
    this.ship = new Asteroids.Ship();
  };

  Game.DIMX = 500;
  Game.DIMY = 500;
  Game.FPS = 60;
  Game.DT = 1000/Game.FPS;  //(milliseconds)
  Game.DV = 0.1;            // incremental velocity
  Game.DA = 0.2;            // incremental angle of rotation
  Game.MAXVEL = 2;
  Game.BULLETSPEED = 2.5;
  Game.INVINCIBLE = true;

  Game.prototype.addAsteroids = function(numAsteroids) {
    for(var i=0; i < numAsteroids; i++) {
      this.asteroids.push(
        Asteroids.Asteroid.randomAsteroid(Game.DIMX,Game.DIMY));
    }
  };

  Game.prototype.fireBullet = function() {
    this.bullets.push(this.ship.fireBullet());
  };

  Game.prototype.splitAsteroid = function(hit_asteroid, arr, idx) {
    var that = this;
    hit_asteroid.size -= 1;
    
    if (hit_asteroid.size >= 0) {
     this.removeObject(arr, idx);
     
   // randomize new velocities
   var new_vel_1 = [hit_asteroid.vel[0] * ((Math.random()*2) - 1) + ((Math.random()*2) - 1),
   hit_asteroid.vel[1] * ((Math.random()*2) - 1) + ((Math.random()*2) - 1)];
   var new_vel_2 = [hit_asteroid.vel[0] * ((Math.random()*2) - 1), hit_asteroid.vel[1] * ((Math.random()*2) - 1)];
   var pos = hit_asteroid.pos;
   
   this.asteroids.push(
    new Asteroids.Asteroid(pos.slice(), new_vel_2, hit_asteroid.size),
    new Asteroids.Asteroid(pos.slice(), new_vel_1, hit_asteroid.size)
    );
 }
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIMX, Game.DIMY);
  for(var i = 0; i < this.asteroids.length; i++) {
    this.asteroids[i].draw(ctx);
  }
  for(var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].draw(ctx);
  }
  this.ship.draw(ctx);
};

Game.prototype.move = function() {
  for(var i = 0; i< this.asteroids.length; i++) {
    this.asteroids[i].move();
  }
  for(var i = 0; i < this.bullets.length; i++) {
    this.bullets[i].move();

    this.bullets[i].life = this.bullets[i].life - 1;

    if (this.bullets[i].life === 0) {
      this.removeObject(this.bullets, i);
    }
  }
  this.ship.move();
};

Game.prototype.isOffCanvas = function(object) {
  var x = object.pos[0];
  var y = object.pos[1];
  return (x > Game.DIMX || x < 0 || y > Game.DIMY || y < 0);
};

Game.prototype.checkCollisions = function() {
  for(var i = 0; i< this.asteroids.length; i++) {
    for (var j = 0; j < this.bullets.length; j++) {
      if (this.asteroids[i].isCollidedWith(this.bullets[j])) {
        this.removeObject(this.bullets, j);
        this.splitAsteroid(this.asteroids[i], this.asteroids, i);
      }
    }

    if (!Game.INVINCIBLE && this.asteroids[i].isCollidedWith(this.ship)) {
      this.endGame();
    };
  }
};

Game.prototype.removeObject = function(object, index) {
  object.splice(index,1);
} 

Game.prototype.endGame = function() {
  window.alert ('You lose');
  window.clearInterval(this.interval);
    // to restart game after collision
    // this.start(ctx);
  };

  Game.prototype.checkWin = function() {
    if (this.asteroids.length===0) {
      window.alert ('You win!');
      window.clearInterval(this.interval);
    }
  };

  Game.prototype.respawnAsteroids = function() {
    if (this.asteroids.length < 3) {
      this.addAsteroids(5);
    };
  };

  Game.prototype.bindKeyHandlers = function() {
    game = this;
    key('up',    function(){ game.ship.accelerate( Game.DV) });
    key('down',  function(){ game.ship.accelerate(-Game.DV) });
    key('left',  function(){ game.ship.rotate(-Game.DA) });
    key('right', function(){ game.ship.rotate(+Game.DA) });
    key('space', function(){ game.fireBullet() });
    key('p', function(){ Asteroids.Game.BULLETSPEED = 17; });
  };

  Game.prototype.step = function(ctx) {
    this.move();
    this.draw(ctx);
    this.checkCollisions();
    this.respawnAsteroids();
    this.checkWin();
  };

  Game.prototype.start = function(ctx) {
    var game = this;
    game.ctx = ctx;
    this.interval = window.setInterval(function() {
      game.step(ctx);
    }, Game.DT);
  };
  
})(this);