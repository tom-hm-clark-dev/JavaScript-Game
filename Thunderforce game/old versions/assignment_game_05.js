   /* TODO: refactoring the constructors */
   const falling_stuff_namespace = function () { // use a function to hide all the identifiers except start_game and stop_game

        /* a canvas and a canvas context to let us draw stuff */
        const canv=document.getElementById("game_canvas");
        const ctx=canv.getContext("2d");
        const canv_bounding_box = canv.getBoundingClientRect(); 

        const debug = true;
        
        /* event listener calls move when the canvas is clicked */
        canv.addEventListener("mousemove", move ,false);
        canv.addEventListener("click", fire ,false);

        // a constructor for a box class 
        function Box(x, y, width, height, colour, health, score, state) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.colour = colour;  // default is a black box
            this.health = 3;
            this.score = score;
            this.state = state;
            this.draw = function (ctx) { // a method
                ctx.save();
                    ctx.fillStyle = this.colour;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.restore();
            }
        }

        var me = new Box(canv.width/2, canv.height-30, 30, 20, "#f00", 3, 0, false);


        /* move calculates a new x position for the player */
        function move( e ) {
            e.preventDefault();
            me.x=(e.clientX-canv_bounding_box.left) *
                (canv.width/canv_bounding_box.width);	
        }

        // TODO: name bullet array entry so it can be accessed without need for second array
        function fire( e ) {
          // e.preventDefault();
            //the_bullets.bullets.push( new Bullet( me.x, me.y-20, -3, 5, "#00f" ));
            the_bullets.add_bullet(the_bullets.bullets[i]);
            if (debug) {console.log("DEBUG: BULLET ARRAY LENGTH: ", the_bullets.bullets.length);}
        }

        function was_i_hit( some_falling_box, me ) {

            if (
                (some_falling_box.left > (me.x + me.width))
                || (some_falling_box.right < me.x)
                || (some_falling_box.top > (me.y + me.height))
                || (some_falling_box.bottom < me.y)
            ) {
                
                me.state = false;
                return false;
                // do nothing, the box missed me
            } else { 
                // player hit
                //me.height -= 0.2*some_falling_box.mass*some_falling_box.dy;
                me.state = true;
                for(i = 0; i < 1; i++) {
                me.health -= 1;
                some_falling_box.health -= 3;
                //return true;

                    if (debug) {console.log("DEBUG: PLAYER WAS HIT ", me.health, "HP REMAINING. HIT BY ",some_falling_box, "at", some_falling_box.y)} else {
                        stop_game()
                    }
                
            } }
        }

        function bullet_collision(some_falling_box, bullet, me) {

            if (
                (some_falling_box.left > (bullet.x + bullet.width))
                || (some_falling_box.right < bullet.x)
                || (some_falling_box.top > (bullet.y + bullet.height)
                || (some_falling_box.bottom < bullet.y))
            ) {

            } else {
                console.log("DEBUG: BULLET ", bullet, "HIT ", some_falling_box)
                //increment player score on bullet hit
                me.score = me.score + some_falling_box.score;
                the_bullets.bullets.splice(i, 1);
                //some_falling_box.falling_boxes.splice(i, 1);
            }
            

        }
        var the_bullets = { // an object with an array of boxes and two functions to add boxes to the array

            /* an empty array to store falling_boxes */
            bullets: [],

            /* create a falling_box and add it to the array of falling_boxes */
            add_bullet: function () {

                var x = me.x;
                var y = canv.height + 20;
                const dy = 3;


                this.bullets.push( new Bullet( x, y, dy, "#000000", false) )
            },
        }

        /* constructor for creating new bullets */
        function Bullet( x, y, dy, colour, state) {
            this.x = x;
            this.y = y;
            this.dy = dy;
            this.colour = colour;
            this.state = state;

            this.height = 15;
            this.width = 15;
            this.top =this.y;
            this.bottom = this.y + this.height;
            this.left = this.x;
            this.right = this.x + this.width;

            this.update_position = function () {
                this.y -= dy;
                this.top = this.y;
                this.bottom = this.y + this.height;
            },

            this.draw = function ( context ) {
                var save_fillStyle = context.fillStyle;
                context.fillStyle = this.colour
                context.fillRect(
                    this.x, this.y,
                    this.width, this.height );
                context.fillStyle = save_fillStyle
            },

            this.explode = function ( explosion_colour ) {
                this.height += this.mass*this.dy;
                this.width += this.mass*this.dy;
                this.colour = explosion_colour
                this.dy = 0;
            }
        }

        /* constructor for creating new falling boxes */
        function Falling_box( x, y, dy, mass, colour, health, score ) {
            this.x = x;
            this.y = y;
            this.dy = dy;
            this.mass = mass;
            this.colour = colour;
            this.health = health;
            this.score = score;

            this.height = 2*this.mass;
            this.width = 3*this.mass;
            this.top =this.y;
            this.bottom = this.y + this.height;
            this.left = this.x;
            this.right = this.x + this.width;

            this.update_position = function () {
                this.y += dy;
                this.top = this.y;
                this.bottom = this.y + this.height;
            },

            this.draw = function ( context ) {
                var save_fillStyle = context.fillStyle;
                context.fillStyle = this.colour
                context.fillRect(
                    this.x, this.y,
                    this.width, this.height );
                context.fillStyle = save_fillStyle
            },

            this.explode = function ( explosion_colour ) {
                this.height += this.mass*this.dy;
                this.width += this.mass*this.dy;
                this.colour = explosion_colour
                this.dy = 0;
            }
        }

        var the_falling_boxes = { // an object with an array of boxes and two functions to add boxes to the array

            /* an empty array to store falling_boxes */
            falling_boxes: [],

            /* create a falling_box and add it to the array of falling_boxes */
            add_random_falling_box: function () {

                var x = Math.random() * canv.width;
                var y = Math.random() * (canv.height/2);
                var dy = (Math.random() * 3) + 1;
                var mass = (Math.random() * 5) + 1;

                this.falling_boxes.push( new Falling_box( x, y, dy, mass, "#000000", 3, 30) )
            },

            maybe_add_random_falling_box: function ( how_likely ) {
                var maybe = Math.random();
                if ( maybe < how_likely) {
                    this.add_random_falling_box()
                }
            }
        }

        var game_interval;

        function start_game() {
            game_interval = setInterval(game_loop, 50)
        }

        function draw_everything() {
            /* first thing to do each frame is clear the canvas */
            ctx.clearRect(0, 0, canv.width, canv.height);

            /* and draw the player */
            me.draw(ctx);

            /* and draw all the falling_boxes */
            for (i=0; i<the_falling_boxes.falling_boxes.length; i++) {
                if (the_falling_boxes.falling_boxes[i].health > 0) {
                    
                the_falling_boxes.falling_boxes[i].draw(ctx);}
            }

           for (i=0; i<the_bullets.bullets.length; i++) {
                the_bullets.bullets[i].draw(ctx);
                //if (debug) {console.log("DEBUG: BULLET DY VAL: " + the_bullets.bullets[i].dy)}
            }

            ctx.font = "24px pixelFont";
            ctx.fillText("SCORE: " + me.score, 20, 30)
            
        }

        function game_loop() {
            if (debug) {console.log("DEBUG: START GAME LOOP");}

            /* update falling_box positions and remove falling_boxes that have gone off the canvas */
            var i;
            var j;

            /* randomly add some new falling boxes */
            the_falling_boxes.maybe_add_random_falling_box( 0.05 );

            for (i=0; i<the_falling_boxes.falling_boxes.length; i++) {

                the_falling_boxes.falling_boxes[i].update_position();

                if ( (the_falling_boxes.falling_boxes[i].dy == 0)
                    || (the_falling_boxes.falling_boxes[i].y > canv.height)
                ) {
                    the_falling_boxes.falling_boxes.splice( i, 1 );
                    if (debug) {console.log("DEBUG: BOX SPLICED. BOX ARRAY LENGTH:", the_falling_boxes.falling_boxes.length);}
                }
            } 

            for (i=0; i<the_falling_boxes.falling_boxes.length; i++) {   
                //the_bullets.bullets[i].update_position();             
                was_i_hit( the_falling_boxes.falling_boxes[i], me );
                  /*if (was_i_hit(true)){
                    for (j = 0; j < 1; j++) {
                        me.health-=1
                        if (debug) {console.log("DEBUG: PLAYER HIT, HEALTH REDUCED")}
                     }
                }*/
                for (j = 0; j<the_bullets.bullets.length; j++) {
                bullet_collision(the_falling_boxes.falling_boxes[i], the_bullets.bullets[j], me);
                the_bullets.bullets[j].update_position();  
                
                if (  //delete this chunk if its broken 
                    (the_bullets.bullets[j].bottom < 0)
                ) {
                    the_bullets.bullets.splice( j, 1 );
                    if (debug) {console.log("DEBUG: BULLET SPLICED. BULLET ARRAY LENGTH: ", the_bullets.bullets.length);}
                }

                //if (debug){console.log("DEBUG: BULLET Y POS: ", the_bullets.bullets[j].y);}

                //add code to do something interesting when a falling black box is hit by a fired blue box
                }
            }
            
            draw_everything();
            document.getElementById("p1").innerHTML = "PLAYER HEALTH: " + me.health;
            document.getElementById("p2").innerHTML = "PLAYER SCORE: " + me.score;

            if (debug) {console.log("DEBUG: END GAME LOOP");}
        }

        /* stop updating and re-drawing the screen */
        function stop_game() {
            clearInterval(game_interval);
        }

        return { // an object with two attributes, start_game whose value is the function (method) start_game() and stop_game whose value is stop_game()
            start_game: start_game,
            stop_game: stop_game
        }
    }() // execute the anonymous function in order to return the object with attributes start_game and stop_game, which is assigned to falling_stuff_namespace

