
// move camera along the x-z axis
function cameraMove() {
    let speed = 3;
    print(y);
  
    // WASD controls for movement
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { // W key for forward
      x += cos(angleY) * cos(angleX) * speed;
      z += sin(angleY) * cos(angleX) * speed;
      // y += sin(angleX) * speed;
    }
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) { // S key for backward
      x -= cos(angleY) * cos(angleX) * speed;
      z -= sin(angleY) * cos(angleX) * speed;
      // y -= sin(angleX) * speed;
    }
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A key for left
      x += cos(angleY + HALF_PI) * speed;
      z += sin(angleY + HALF_PI) * speed;
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D key for right
      x += cos(angleY - HALF_PI) * speed;
      z += sin(angleY - HALF_PI) * speed;
    }
  }
  
function cameraRotate() 
{
    // Rotate the camera when the mouse is dragged
    if (cameraIsRotating) 
    {
      let deltaX = mouseX - previousMouseX;
      let deltaY = mouseY - previousMouseY;
      
      angleY -= deltaX * 0.005;
      angleX -= deltaY * 0.005;
  
      // Clamp the vertical angle to prevent flipping
      angleX = constrain(angleX, -HALF_PI, HALF_PI);
  
      previousMouseX = mouseX;
      previousMouseY = mouseY;
    }
  }
  
  // Start dragging when mouse is pressed
  function mousePressed() 
  {
    cameraIsRotating = true;
    previousMouseX = mouseX;
    previousMouseY = mouseY;
  }
  
  // Stop dragging when mouse is released
  function mouseReleased() 
  {
    cameraIsRotating = false;
  }
  