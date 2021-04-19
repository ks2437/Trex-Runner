var trex, trex_runs, trex_collide;
var ground;
var ground_image;
var ground_2;
var c1;
var c2;
var SCORE = 0;
var t1, t2, t3, t4, t5, t6;
var raptor1;
var raptor2;
var cg;
var rg;
var og;
var gs = 0;
var ib;
var gameOver;
var go;
var restart;
var rt; 
var speed;
var die;
var jump;
var checkpoint; 

function preload() {
  trex_runs = loadAnimation("trex1.png", "trex2.png", "trex3.png")
  trex_collide = loadAnimation("trex_collided.png");
  ground_image = loadImage("ground.png");
  ci = loadImage("cloud.png");
  raptor2 = loadAnimation("rt.png");
  raptor1 = loadAnimation("rt.png", "rt2.png")
  t1 = loadImage("o1.png");
  t2 = loadImage("o2.png");
  t3 = loadImage("o3.png");
  t4 = loadImage("o4.png");
  t5 = loadImage("o5.png");
  t6 = loadImage("o6.png");
  go = loadImage("gameOver.png");
  rt = loadImage("restart.png");
  die=loadSound("die.mp3");
  checkpoint=loadSound("checkPoint.mp3");
  jump=loadSound("jump.mp3");
  
}

function setup() {
  createCanvas(600, 200);
    ib = createSprite(300, 100, 600, 200);
  ib.visible=false
  trex = createSprite(50, 100, 20, 20);
  ground_2 = createSprite(300, 200, 600, 20);
  ground_2.visible = false
  c1 = createSprite(200, 30, 10, 10);
  c1.velocityX = -5;
  c1.addImage(ci);
  c2 = createSprite(500, 45, 10, 10);
  c2.velocityX = -5;
  c2.addImage(ci);
  trex.addAnimation("runs", trex_runs)
  trex.addAnimation("stop", trex_collide)
  trex.scale = 0.5;
  ground = createSprite(300, 180, 600, 40)
  ground.addImage(ground_image);
  cg = new Group();
  og = new Group();
  rg = new Group();
  restart = createSprite(300, 90);
  restart.addImage(rt);
  restart.scale= 0.5;
  restart.visible=false
 gameOver = createSprite(300, 120);
  gameOver.addImage(go);
  gameOver.scale= 0.5;
  gameOver.visible=false
}

function cc() {
  if (frameCount % 60 == 0) {
    var clouds = createSprite(600, Math.round(random(10, 70)), 10, 10);
    clouds.velocityX = speed;
    clouds.addImage(ci);
    clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;
    clouds.lifetime = 600 / -speed + 40;
    cg.add(clouds);
  }
}

function ct() {
  if (frameCount % 100 == 0) {
    var cactus = createSprite(600, 170, 10, 10);
    cactus.velocityX = speed;
    cactus.lifetime = 600 / -speed + 40;
    var n;
    if(SCORE<100)
      n= Math.round(random(1, 3))
    else if(SCORE>100&&SCORE<300)
      n= Math.round(random(1, 5))
    else
       n= Math.round(random(1, 6))
    switch (n) {
      case 1:
        cactus.addImage(t1);
        break;
      case 2:
        cactus.addImage(t2);
        cactus.scale = 0.9;
        break;
      case 3:
        cactus.addImage(t3);
        cactus.scale = 0.8;
        break;
      case 4:
        cactus.addImage(t4);
        cactus.scale = 1;
        
        break;
      case 5:
        cactus.addImage(t5);
        cactus.scale = 0.9;
        break;
      case 6:
        cactus.addImage(t6);
        cactus.scale = 0.8;
        break;
    }
    og.add(cactus);
  }
}

function avr() {
  if (frameCount % 567 == 0) {
    var avr = createSprite(600, Math.round(random(80, 120)));   
    avr.lifetime = 600 / -speed + 40;
    avr.addAnimation("fly", raptor1);
    avr.scale = 0.5;
    avr.velocityX = speed;
    avr.addAnimation("stop", raptor2);
    rg.add(avr);
  }
}


function draw() {
  background("white");
  if (gs == 0) {
    speed=-(5+(SCORE/100));
    cc();
   ct();
  avr();
    if (keyDown("space") && trex.y > 166.5) {
      trex.velocityY = -10;
      jump.play();
    }
    trex.velocityY += .5;
    if (frameCount % 10 == 0) {
      SCORE += 1
    }
    if (trex.isTouching(og)||(trex.isTouching(rg, callback))) {
      jump.play();
      die.play();
      gs = 1;
    } 
    ground.velocityX =  speed;
    if (SCORE%100==0&&SCORE!=0){
      checkpoint.play();
    }
  } else if (gs == 1) {
    ground.velocityX = 0;
    trex.setVelocity(0, 0);
    og.setVelocityXEach(0);
    cg.setVelocityXEach(0);
    trex.changeAnimation("stop");
    rg.setVelocityXEach(0);
    og.setLifetimeEach(-1);
    cg.setLifetimeEach(-1);
    rg.setLifetimeEach(-1);
    ib.overlap(rg,callback)
    restart.visible=true;
    gameOver.visible=true;
    if(mousePressedOver(restart)){
      gameOver.visible=false;
      restart.visible=false;
      og.destroyEach();
      rg.destroyEach();
      cg.destroyEach();
      trex.changeAnimation("runs");
      SCORE=0;
      gs=0;
    }
  }
  if (ground.x < 0) {
    
    ground.x = ground.width / 2;
    
  }
  trex.collide(ground_2);
  text("SCORE-" + SCORE, 500, 30)
  
  
  drawSprites();
}
function callback(s1, s2){
s2.changeAnimation("stop");
}