//Game Variables
let game;
let player;
let endGame;

//Camera Varibles
let cam;

//Scene Variables 
let sceneManager;
let skybox1, skybox2;
let scenes = [];
let currentSceneIndex = 0;

// scene models
let mainroom;
let backroom;

//Interactable Models
let pathos1Model;
let pathos2Model;
let pathos3Model;
let doorModel;

//Intertactables Behavior
let isInteracting = false;
let isLooking = false;
let dBoxOpen = false;
let welcomeBox = true;

//Audio files
let murmurSound;
let artGallerySong;
let doorSound;
let backroomSong;

function preload(){

    mainroom = loadModel("assets/main_room/MainroomWalls.obj");
    mainroomPedestals = loadModel("assets/main_room/Pedestals.obj");
    mainroomPortraits = loadModel("assets/main_room/Portraits.obj");
    mainroomStatues = loadModel("assets/main_room/MainroomStatues.obj");
    mainroomHumanStatue = loadModel("assets/main_room/HumanStatue.obj");
  
    backroom =  loadModel("assets/backroom/Backroom.obj");
    backroomModel =  loadModel("assets/backroom/BackroomModel.obj");
    backroomPedestals = loadModel("assets/backroom/BackroomPedestals.obj");

    //load skybox image --> will be used later as a texture
    skybox1 = loadImage('assets/main_room/gallerySkybox.jpg')
    // loadImage('assets/main_room/starry_skybox.jpg')
    skybox2 = loadImage('assets/backroom/starry_skybox.jpg')

    //load sounds
    murmurSound = loadSound('assets/audio/murmur.mp3');
    artGallerySong = loadSound('assets/audio/eternalHope.mp3');
    backroomSong = loadSound('assets/audio/backroom.mp3');
    doorSound = loadSound('assets/audio/door.mp3');

    //Loading Models
    pathos1Model = loadModel("assets/pathos/interactable1.obj");
    pathos2Model = loadModel("assets/pathos/interactable2.obj");
    pathos3Model = loadModel("assets/pathos/interactable3.obj");
    doorModel = loadModel("assets/main_room/door.obj");
}

function setup(){
  //Game Variables (Mostly Scene Setting)
    game = createCanvas(windowWidth, windowHeight, WEBGL)
    game.parent("#game");
    noStroke();

    //Start Playing Backgroumd Music and 
    artGallerySong.amp(0.3);
    artGallerySong.loop();
    artGallerySong.play();

    // ----------- MAINROOM GALLERY -----------
    
    // SCENES constructor(sky, groundCol, groundSize, groundY)
    let offWhiteColor = color(251, 230, 224)
    scenes.push(new Scene(skybox1, offWhiteColor, 2000, 0));
    // print("Scene array",scenes);

    /**
     * Main room colors:
     * 
     * light purple: rgb(162, 177, 228)
     * light magenta: rgb(230, 208, 225)
     * green-blue: rgb(68, 162, 193)
     * purple: rgb(158, 117, 187)
     * lilac: rgb(216, 170, 204)
     * blue: rgb(47, 116, 210)
     * off white: rgb(251, 230, 224)
     */

    // Main room colors
    let pedestalColor = color(104, 117, 205);
    let portraitColor = color(230, 208, 225);
    let statuesColor = color(162, 177, 228);
    let humanStatueColor = color(162, 177, 228); //color(231, 251, 190)

    scenes[0].addModel(mainroom, -87000,20000, 130000, 0.006, -PI, PI, 0,offWhiteColor);
    scenes[0].addModel(mainroomPedestals, -48000,-2000, 28000, 0.006, -PI, PI, 0, pedestalColor);
    scenes[0].addModel(mainroomPortraits,-86700,-2000, 129800, 0.006, -PI, PI, 0, portraitColor);
    scenes[0].addModel(mainroomStatues,-86700,-2000, 129800, 0.006, -PI, PI, 0, statuesColor);
    scenes[0].addModel(mainroomHumanStatue,-22500,22500, -8500, 0.006, -PI, PI, 0, humanStatueColor);
    scenes[0].addModel(mainroomHumanStatue,117000,22500, -8500, 0.006, -PI, PI, 0, humanStatueColor);
    //middle position x : 43000
  
    // X: -86700 z: 129800
    // print("Scene models", scenes[0].models);

    // ----------- BACKROOM -----------

    /**
     * Backroom colors:
     * 
     * beige: #C3B5AE && rgb(195, 181, 174)
     * dark purple: #3C2654 && rgb(60, 38, 84)
     * gray blue: #3B4259 && rgb(59, 66, 89)
     * light gray blue: #9ABCD5 && rgb(154, 188, 213)
     * 
     * another dark purple #302540 && rgb(48, 37, 64)
     * 
     * dark blue: #031B5B && rgb(3, 27, 91)
     * very dark : #0A0D29 && rgba(10, 13, 41)
     * 
     */

    // Back room colors

    let backroomColor = color(10, 13, 41)
    let backroomFloor = color(10, 13, 41)
    let backroomPedestalColor = color(47, 90, 130)

    scenes.push(new Scene(skybox2, backroomFloor, 2000, 0));

    // Add backroom models
    //scenes[1].addModel(backroom, 0,-2000, 0, 0.007, -PI, PI, 0,backroomColor);
    scenes[1].addModel(backroomModel, 0,-2000, 0, 0.01, -PI, PI, 0,backroomColor);
    scenes[1].addModel(backroomPedestals, 0,-2000, 0, 0.007, -PI, PI, 0,backroomPedestalColor);
    print("Scene models", scenes[1].models[0]);

    // ----------- INTERACTABLES -----------
    //Seting Up Interactables in Each Scene
    gallerySetUp();
    backroomSetup();

    //Camera Setup
    setCamInitialPos()
    cam = createCamera();
    setCamera(cam);

    //Create Player Object 
    player = new Player(1);

    //TODO: Initialize the SceneManager
    //sceneManager = new SceneManager();
    //set up initial dialogue
    loadWelcome(welcomeDialogue[0]);
    showWelcome();
}

function draw() 
{
  //Room Lighting
  let lightingColor = color(150, 100, 0);
  let lightDir = createVector(2, 3, 1);
  ambientLight(170);
  directionalLight(lightingColor,lightDir);


  //Loop Functionality: If the time has been activated it starts running
  updateTimer(); 

  //Pausing / Unpausing the Camera
    if (paused) {
      pause();
    } else {
      //Updating Camera Behaviors and Position
      cameraUpdate(cam);
    }

    if (currentSceneIndex == 0) { //When we're in the gallery scene. Draw details
      //Functions with all the logic for the gallery
      drawGallery();

    } else if (currentSceneIndex == 1) { //When we're in the backroom scene. Draw details
      //print("Draw Backroom!");
      drawBackroom();
    }

  //Display Scene using Scene Array
  scenes[currentSceneIndex].display();
  //scenes[2].display()

//----------- DEBUGGING AREA

  
}

// TODO: Scene Manager
// Scene manager to handle scene switching

//Debug: Key pressed function to switch scenes
function keyPressed() {
    if (key === '1') {
      currentSceneIndex = 0; // Switch to Scene 0 when '1' is pressed
    } else if (key === '2') {
      player.moveToBackroom(); // Moves player to the backroom
    } 

    if(key === 'Escape' || key === 'Tab') {
      pauseGame();
    }

    //Pathos Interactions 
    if(key === 'e') {
      //Logic for when the player is in the Art Gallery
      if (!player.isInBackroom) {
        if (!isInteracting && !dBoxOpen) {
          //Looking through the pathosArray
          for (let obj of pathosArray) {
            if(obj.checkIfLookingAt(cam) && obj.activateOnLoop <= player.currentLoop) { //Detect if the Player is looking at intertacbles Objects for this loop
              if (obj.activateOnLoop <= player.currentLoop) { 

                //Handling Hint Hiding
                hideHint();
                isInteracting = true;

                //This Function handles all reactions from the Object when Interacted.
                obj.interact(player.currentLoop);
                obj.isInteracting = isInteracting; //Updates Object Interacting Variable to match

              } else {
                print("Incorrect loop. Unable to Interact.");  
              }
            } else if (obj.checkIfLookingAt(cam) && obj.activateOnLoop != 4) { //Displays Text Box for inactivate object.
              obj.loadDialogue(obj.dialogueArray[player.currentLoop - 1]);
              obj.showDialogue();
              hideHint();
            }
          }
        } else if (dBoxOpen) { //this is for when you want to turn off the 
          hideDialogue();
          isInteracting = false;

          //Checks to see if loop conditions have been met. Starts timer if so.
          let canLoop = checkIfLoopPossible();
          if (canLoop) {
            startTimer(doorModel);
          }
        }

      //Logic for When the player is in the backroom  
      } else if (player.isInBackroom) {
        if (!isInteracting && !dBoxOpen) {
          
          for (let obj of baathosArray) {
            if(obj.checkIfLookingAt(cam)) { //Detect if the Player is looking at intertacbles Objects for this loop
              //Handling Hint Hiding
              hideHint();
              isInteracting = true;

                //This Function handles all reactions from the Object when Interacted.
                obj.loadDialogue(obj.dialogueArray[0]);
                obj.showDialogue();
                obj.isInteracting = isInteracting; //Updates Object Interacting Variable to match

                if(obj.activateOnLoop == 5) {
                  endGame = true;
                }
            } 
          }

      } else if (dBoxOpen) { //this is for when you want to turn off the 
          //End the Game Here 
          hideDialogue();
          hideHint();
          isInteracting = false;

          if(endGame) {
            print("Ending Game! Thanks for playing");
            //Adds a Black Screen Transition when player goes into new loop
            let overlay = $("#overlay").addClass("overlay-transition");

            setTimeout(() => {
              window.location.href = "end-screen.html"; // Replace with your target HTML file
          }, 2500);
          }
      }
    }

      //Hides Instructions when E is pressed
      controls = $("#controls").addClass('hide-control'); 
    }

    //Debug: Go to the Next Loop!
    if(key === 'l') {
      player.newLoop();
    }



    //----------- DEBUGGING AREA




    // Scene movement controls
    let moveAmount = 1; // Adjust this for finer or larger steps
    let current_pathos = 3; // Adjust to change pathos
    let current_scene = 0; // Adjust to change to other scene
    let current_model = 5; // Adjust change model 

    if (key === 't') {
      // --- PATHOS
      baathosArray[current_pathos].z += moveAmount; // Move up
      console.log("z:", baathosArray[current_pathos].z);

      // --- SCENE

      // scene 1 walls
      // scenes[current_scene].models[current_model].position.z += moveAmount; // Move right
      // print("z: ",scenes[current_scene].models[current_model].position.z)

    } else if (key === 'g') {
      // --- PATHOS
      baathosArray[current_pathos].z -= moveAmount; // Move up
      console.log("z:", baathosArray[current_pathos].z);


      // --- SCENE
      // scene 1 walls
      // scenes[current_scene].models[current_model].position.z -= moveAmount; // Move right
      // print("z: ",scenes[current_scene].models[current_model].position.z)

    } else if (key === 'f') {

      // --- PATHOS
      baathosArray[current_pathos].x -= moveAmount; // Move up
      console.log("x:", baathosArray[current_pathos].x);

      // --- SCENE
      // scene 1 walls
      // scenes[current_scene].models[current_model].position.x -= moveAmount; // Move right
      // print("x: ",scenes[current_scene].models[current_model].position.x)
      
    } else if (key === 'h') {
      // --- PATHOS
      baathosArray[current_pathos].x += moveAmount; // Move up
      console.log("x:", baathosArray[current_pathos].x);

      // --- SCENE
      // scene 1 walls
      // scenes[current_scene].models[current_model].position.x += moveAmount; // Move right
      // print("x: ",scenes[current_scene].models[current_model].position.x)
    } 
    else if (key === 'j') {
      print("move down")
        //scenes[currentSceneIndex].y += moveAmount; // Move closer
        // pathosArray[current_pathos].y += moveAmount; // Move up
        // console.log("y:", pathosArray[current_pathos].y);
        baathosArray[current_pathos].y += moveAmount; // Move up
        console.log("y:", baathosArray[current_pathos].y);

        // scene 1 walls
        // scenes[current_scene].models[current_model].position.y += moveAmount; // Move right
        // print("y: ",scenes[current_scene].models[current_model].position.y)
    } else if (key === 'u') {
      print("move up")
       //scenes[currentSceneIndex].moveModel(0, -moveAmount, 0); // Move closer
      // pathosArray[current_pathos].y-= moveAmount; // Move up
      // console.log("y:", pathosArray[current_pathos].y);
     
      // scene 1 walls
      // scenes[current_scene].models[current_model].position.y -= moveAmount; // Move right
      // print("y: ",scenes[current_scene].models[current_model].position.y)

      baathosArray[current_pathos].y -= moveAmount; // Move up
      console.log("y:", baathosArray[current_pathos].y);

    }

    else if (key === 'c') {
      printCamPosition()
    }
  }

  //Function for Pausing the Game
  function pauseGame() {
    paused = !paused;

    if (!paused) {
      pauseDiv.removeClass("show-pause")
      overlay = $("#overlay").removeClass("overlay")
    } else {
      document.exitPointerLock();

      pauseDiv = $("#pause-menu")
      .addClass("show-pause")
      overlay = $("#overlay").addClass("overlay")
    }
  }

  //Hides any dialog boxes that are being displayed
function hideDialogue() {
  if (!welcomeBox) {
    dialog = $("#dialog").removeClass("show-dialogue");
  }
  dBoxOpen = false;
}

//Loads Welcome Dialogue 
function loadWelcome(d) {
  let dialog = $("#dialog").text();
  $("#dialog").text(d);
}

function showWelcome() {
  dialog = $("#dialog").addClass("show-dialogue");
  setTimeout(() => {
    dialog = $("#dialog").removeClass("show-dialogue");
    print("hide");
    welcomeBox = false;
  }, 8000);
  
}
//Shows a Key-Input hint
function showHint() {
  hint = $("#hint").addClass("show-hint");
}

//Hides Key-Input Hint
function hideHint() {
  hint = $("#hint").removeClass("show-hint");
}