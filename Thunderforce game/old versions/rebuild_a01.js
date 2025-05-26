     // Original by Hannah Dee
        // modified by Edel Sherratt Nov. 2017 to use a namespace
        // modified by Edel Sherratt October 2021 to provide more guidance for studying the code,
        // and to use clearRect() to clear the canvas
        // modified again by Edel Sherratt October 2022 to include touch as well as mouse/touchpad interaction, to improve some identifiers (e.g. canvas1 is now called collisions_canv) and to change how the game starts

        const collision_game = function () {

            // a constructor for a box class 
            function Box(x_loc,y_loc,wid,hig) {
                this.x = x_loc;
                this.y = y_loc;
                this.w = wid;
                this.h = hig;
                this.colour = "#000";  // default is a black box
                this.draw_box = function (ctx) { // a method
                    ctx.fillStyle = this.colour;
                    ctx.fillRect(this.x, this.y, this.w, this.h);
                }
            }

            // let's have a couple of shared variables.
            var collisions_count = 0; // holds the number of collisions so far
            var boxes = []; // array to hold the things we might collide with

            // let's set up a canvas and a canvas context so we can draw stuff
            const canv = document.getElementById("collisions_canv");
            const ctx = canv.getContext("2d");

            // let's have a red box to represent the player
            var playerbox = new Box(100,100,20,20);
            playerbox.colour = "#f00";

            // let's add an event listener to the canvas - this will call the function
            // seen_mouse_motion whenever the mouse moves. we're going to use this to move the red box
            canv.addEventListener("mousemove", seen_mouse_motion, false);
            canv.addEventListener("keypress", seen_keypress, false);
            canv.addEventListener("click", fire, false);
            // canv.addEventListener("touchend",seenend, false);

            function seen_mouse_motion(e) {
                // if the mouse moves over the canvas
                // this function will be called - we can then 
                // update the red box's location on the canvas
                // from the mouse_event 
                // and the canvas bounding rectangle

                var bounding_box = canv.getBoundingClientRect();
                playerbox.x = (e.clientX-bounding_box.left) *
                                        (canv.width/bounding_box.width);        
                playerbox.y = (e.clientY-bounding_box.top) *
                                        (canv.height/bounding_box.height);        
            }

            function seen_keypress(e) {
                e.preventDefault()
                if (
                    (e.key == 'w')) { console.log("w")}

                
            }

            function fire(e) {
                
            }

            function seen_touch_start(e) {
                e.preventDefault()
            }
            function seen_touch_motion(e) {
                // if there is a touch movement over the canvas
                // this function will be called - we can then 
                // update the red box's location on the canvas
                // from the touch event 
                // and the canvas bounding rectangle
        
                var bounding_box=canv.getBoundingClientRect();
                playerbox.x=(e.targetTouches[e.targetTouches.length-1].clientX-bounding_box.left) *
                                    (canv.width/bounding_box.width);        
                playerbox.y=(e.targetTouches[e.targetTouches.length-1].clientY-bounding_box.top) *
                                        (canv.height/bounding_box.height);        
            }

            function game_loop() {
                // this is called every 50ms and is basically a 
                // frame-redraw-game-animation loop

                //first thing to do each frame is clear the canvas
                ctx.clearRect(0, 0, canv.width, canv.height);

                for (i = 0;i<boxes.length;i++) {
                        boxes[i].draw_box(ctx);
                        if (collides(boxes[i],playerbox)) {
                            collisions_count++;
                            // maybe do some other stuff here
                        }

                }

                playerbox.draw_box(ctx); // (re)draw the player box
                
                // update the collisions count
                document.getElementById("p1").innerHTML = collisions_count;
            }

            function collides(box1,box2) {
            // now this is the bit you have to write.

                // you need to know the top left, top right, bottom left, and bottom right of each box.
                // if you find it easier to think about it that way un-comment the next lines
                // and do the calculations there - basically you don't need these 8 variables to keep
                // track, but it can help to think that way so go ahead and use them if it helps.

                var box1top = box1.y;
                var box2top = box2.y;
                var box1bottom = box1.y + box1.h;
                var box2bottom = box2.y + box2.h;
                var box1left = box1.x;
                var box2left = box2.x;
                var box1right = box1.x + box1.w;
                var box2right = box2.x + box2.w;

                // once you have worked out the box details you need to work out whether
                // they can't overlap.  there are four things to test - is the bottom of one
                // above the top of the other (r1 vs r2, and r2 vs r1), and is the right of 
                // one to the left of the left of the other (and vice versa). 

                // if any of those conditions are true, then they don't overlap, so...
                if (box2bottom < box1top){
                return false;
            }
                if (box2top > box1bottom){
                    return false;
            } 
                if (box2right < box1left){
                    return false;
            }
                if (box2left > box1right) {
                    return false;
                }    
                // otherwise ...
                else {
                return true;}

            }

            function start_game() {

                // add some boxes to the boxes array;

                var b = new Box(100,100,30,20);
                boxes.push(b);
                var c = new Box(200,200,40,40);
                boxes.push(c);
                var d = new Box(100,200,10,10);
                boxes.push(d);
                var e = new Box(300,100,50,50);
                boxes.push(e);

                // set up an interval timer to call game_loop every 50 ms
                // return the value of the interval timer so we can stop it later
                return setInterval(game_loop, 50);
            }            

            // probably have something to do when we're finished
            function stop_game() {
                // add something here - like a game-over pop-up or something more interesting
                clearInterval(game_id)
            }

            // start the game, save the id of the interval timer so we can stop it later
            const game_id = start_game()

        }() // run the anonymous function to return an object with one attributed, start_game, whose value is the function start_game()
