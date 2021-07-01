//gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;

//trex
var trex, trex_running, trex_collided, trex_ducking;
var ground, invisibleGround, groundImage;

//spawning clouds and obstacles
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var birdsGroup, birdImg;

//game over and sound
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  //trex 
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_ducking = loadAnimation("trexDucking.png");
  
  //scrolling background images
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  //obstacles
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  birdImg = loadAnimation("bird.png", "bird2.png", "bird.png");
  
  //game over and restart
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //sounds
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  //creating trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.addAnimation("ducking", trex_ducking);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  birdsGroup = new Group();
  
  score = 0;
  trex.setCollider("circle",0,0,40);
  trex.debug = true;
  
}

function draw() {
  
  background(180);
  //displaying score
  textSize(14);
  text("Score: "+ score, 520,20);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -5 - score/400;
    //scoring
    score = score + Math.round(getFrameRate()/50);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
        jumpSound.play();
    }

    //making the dinosaur duck
    if(keyWentDown("down")&& trex.y >= 160){
        trex.changeAnimation("ducking", trex_ducking);
        trex.setCollider("rectangle", 0, 0, 30, 30)
    }
    else if(keyWentUp("down")){
        trex.changeAnimation("running", trex_running);
        trex.setCollider("circle",0,0,40);
    }

    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if (score > 20){
      spawnBirds()
    }
    
    if(obstaclesGroup.isTouching(trex)||(birdsGroup.isTouching(trex))){
        trex.setCollider("circle",0,0,40);
        gameState = END;
        dieSound.play();
    }
    
    if (score > 0 && score % 400 === 0){
      checkPointSound.play();
    }
  }
   else if (gameState === END) {
      console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      //st
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -5 -score/400;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -5 - score/400;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset() {
  gameState = PLAY;
  score = 0;
  gameOver.visible = false;
  reset.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
}

function spawnBirds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    bird = createSprite(600,140,40,10);
    bird.addAnimation("bird",birdImg);
    bird.scale = 0.5;
    bird.velocityX = -5 - score/400;
    
    //assign lifetime to the variable
    bird.lifetime = 134;
    
    //adjust the depth
    bird.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
    birdsGroup.add(bird);
    }
}


