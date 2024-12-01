class Scene {
    
    constructor(sky, model , groundCol, groundSize, groundY, t){
        this.skybox = sky;
        this.model = model
        this.groundColor = groundCol;
        this.groundSize = groundSize;
        this.groundPosY = groundY;
        this.type = t;

        // Position of the model
        this.modelPosition = createVector(0, -2000, 0); // Initial position
        
    }

    display(){
        this.drawSkybox();
        this.drawGround();
        this.drawModel();

    }

    drawSkybox(){
        // Draw the skybox
        push();
        noStroke();
        texture(this.skybox); //make texture out of skyboxImage
        sphere(2000, 24, 16); // Using a large sphere to create the skybox effect
        pop();
    }

    drawGround(){
        //Draw the grounf of the scene
        push();
        fill(this.groundColor)
        noStroke();
        translate(0, this.groundPosY, 0);
        rotateX(HALF_PI); // Rotate the plane to be horizontal
        plane(this.groundSize); // Draw the ground plane with the specified size
        pop();

    }

    drawModel(){
        push();
        scale(.005);
        rotateX(-PI);
        rotateY(0);
        translate(-80000, 0, 100000); // Use model position
        //translate(this.modelPosition)
        ambientMaterial(255,255,255)
        model(this.model); // Render the 3D model
        pop();

    }

    // Method to move the model based on inputs
    moveModel(dx, dy, dz) {
        this.modelPosition.add(createVector(dx, dy, dz));
    }

    // Get position as a formatted string
    getModelPositionString() {
        
        return `Model Position: x=${this.modelPosition.x.toFixed(2)}, y=${this.modelPosition.y.toFixed(2)}, z=${this.modelPosition.z.toFixed(2)}`;
    }

    // drawGrid(){
    //     // Draw a simple 3D grid environment
    //     for (let i = -500; i <= 500; i += 200) {
    //         for (let j = -500; j <= 500; j += 200) {
    //             push();
    //             translate(i, 0, j); // move position

    //             // Note: this can probably be refactor once we know what we want in the scenes
    //             if(this.type == 0){
    //                 box(50);
    //             }
    //             else if(this.type == 1){
    //                 sphere(50);
    //             }
    //             else{
    //                 console.log("Scene type not defined");
    //             }

    //             pop();
    //         }
    //     }
    // }
}
    