   /* TODO: refactoring the constructors */
   const falling_stuff_namespace = function () { // use a function to hide all the identifiers except start_game and stop_game

        /* a canvas and a canvas context to let us draw stuff */
        const canv=document.getElementById("game_canvas");
        const ctx=canv.getContext("2d");
        const canv_bounding_box = canv.getBoundingClientRect(); 
        
        const debug = false;
        
        /* event listener calls move when the canvas is clicked */
        canv.addEventListener("mousemove", move ,false);
        


  

        // a constructor for a box class 
        function Box(x, y, width, height, colour, health, score, state) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.colour = colour;  // default is a black box
            this.health = health;
            this.score = score;
            this.state = state;
            this.draw = function (ctx) { // a method
                ctx.save();
                    ctx.fillStyle = this.colour;
                    const player_img = new Image();
                    player_img.src = "src/NicePng_spaceship-png_138961.png"
                    //ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.drawImage(player_img, this.x, this.y, this.width, this.height);

                ctx.restore();
            }
        }

        var me = new Box(canv.width/2, canv.height-50, 50, 40, "#f00", 100, 0, false);

        /* move calculates a new x position for the player */
        function move( e ) {
            e.preventDefault();
            me.x=(e.clientX-canv_bounding_box.left) *
                (canv.width/canv_bounding_box.width);	
        }

        function fire( e ) {
           e.preventDefault();
            //the_bullets.bullets.push( new Bullet( me.x, me.y-20, -3, 5, "#00f" ));
            the_bullets.add_bullet();
            if (debug) {console.log("DEBUG: BULLET ARRAY LENGTH: ", the_bullets.bullets.length);}
            if (me.health <= 0) {

            }

           // setTimeout("", 1000)
        }

        //player and asteroid hit detection
        function was_i_hit( some_falling_box, me) {

            if (
                (some_falling_box.left > (me.x + me.width))
                || (some_falling_box.right < me.x)
                || (some_falling_box.top > (me.y + me.height))
                || (some_falling_box.bottom < me.y)
            ) {
                if(debug){console.log("DEBUG: PLAYER STATE FALSE")}

                me.state = false;
                some_falling_box.state = false;
                // do nothing, the box missed me
            } else { 
                // player hit
                if(debug){console.log("DEBUG: PLAYER STATE TRUE")}

                me.state = true;
                some_falling_box.state = true;
                }
        }
        
        //player and powerup hit detection
        function pickup_collision(me, pickup) {
       
        if (
                (pickup.left > (me.x + me.width))
                || (pickup.right < me.x)
                || (pickup.top > (me.y + me.height))
                || (pickup.bottom  < me.y)
            ) {
                
                pickup.state = false;
                
                // do nothing, the box missed me
            }
            else {
                if(debug){console.log("DEBUG: PICKUP STATE TRUE")}
                pickup.state = true;
            }
        }
      
        //bullet and asteroid hit detection
        function bullet_collision(some_falling_box, bullet, me) {

            if (
                (some_falling_box.left > (bullet.x + bullet.width))
                || (some_falling_box.right < bullet.x)
                || (some_falling_box.top > (bullet.y + bullet.height))
                || (some_falling_box.bottom < bullet.y)
            ) {
            
            } else {
                if(debug){ console.log("DEBUG: BULLET ", bullet, "HIT ", some_falling_box);}
                //increment player score on bullet hit
                me.score = me.score + some_falling_box.score;
                bullet.state = true;
                some_falling_box.state = true;
                for (i = 0; i < 500; i++) {
                floating_text(some_falling_box, me);}
            
            }
            

        }
        var the_bullets = { // an object with an array of boxes and two functions to add boxes to the array

            /* an empty array to store falling_boxes */
            bullets: [],

            /* create a falling_box and add it to the array of falling_boxes */
            add_bullet: function () {

                var bullet_x = (me.x + me.width / 2 - 2);
                var bullet_y = me.y;
                var bullet_velocity = 2.5;


                this.bullets.push( new Bullet( bullet_x, bullet_y, bullet_velocity, "#ffffff", false) )
            },
        }

        //star constructor
        function Star(x, y, dy, w, h, colour) {
            this.x = x;
            this.y = y;
            this.dy = dy;
            this.width = w;
            this.height = h;
            this.colour = colour;

            this.draw = function ( context ) {
                var save_fillStyle = context.fillStyle;
                context.fillStyle = this.colour
                context.fillRect(
                    this.x, this.y,
                    this.width, this.height );
                context.fillStyle = save_fillStyle
            }

        }

        var the_stars = { // an object with an array of boxes and two functions to add boxes to the array

            /* an empty array to store falling_boxes */
            stars: [],

            /* create a falling_box and add it to the array of falling_boxes */
            add_star: function () {
                
                
                    var dy = 1;
                    var mass = Math.floor(Math.random()  * 2) + 1;
                    var height =  mass;
                    var width = mass;
                    var x = Math.random() * canv.width;
                    var y = Math.random() * canv.height;

                    this.stars.push( new Star( x, y, dy, mass, height, width, "#ffffff") )
                
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
            this.width = 5;
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

        //button constructor
        function Button(name, x, y, w, h) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.top = this.y;
            this.bottom = this.y + this.h;
            this.left = this.x;
            this.right = this.x + this.w;

            this.draw = function (context) {
                context.font = "48px pixelFont";
                context.fillStyle = "white";
                context.fillRect(this.x, this.y, this.w, this.h );
                
                context.fillStyle = "black";
                context.fillText(this.name, this.x + this.w / 2, this.y + this.h - 13)
            }


        }

        //powerup constructor
        function Pickup(name, x, y, w, h, dy, state) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.dy = dy;
            this.state = state;
            

            this.top = this.y;
            this.bottom = this.y + this.h;
            this.left = this.x;
            this.right = this.x + this.w;

            this.draw = function (context) {
                if (this.name == "+HEALTH") {
                    const heart_img = new Image();
                    heart_img.src = "src/heart pixel art 64x64.png"
                    var save_fillStyle = context.fillStyle;
                    context.fillStyle = this.colour
            
                    ctx.drawImage(heart_img, this.x, this.y, this.width, this.height);}
                    context.fillStyle = save_fillStyle;
                    context.fillStyle = "yellow";
                    context.fillRect(this.x, this.y, this.w, this.h );
                
            }

            this.update_position = function (canv) {
                this.y += dy;                
                this.top = this.y;
                this.bottom = this.y + this.height;
               
            }
        }

       function menu_click_handler(e) {
            
            
            var mousex = (e.clientX-canv_bounding_box.left) *
                                (canv.width/canv_bounding_box.width);	
            var mousey = (e.clientY-canv_bounding_box.top) *
                    (canv.height/canv_bounding_box.height);	
                    return mousex, mousey;
                    
           /*if ((mousex > play_button.left) && (mousex < play_button.right) && (mousey > play_button.top) && (mousey < play_button.bottom)) {
                start_game();
                if (debug){console.log("DEBUG: MENU CLICK")};
            } */
        } 

        /* constructor for creating new falling boxes */
        function Falling_box( x, y, dy, mass, height, width, colour, health, score ) {
            this.x = x;
            this.y = y;
            this.dy = dy;
            this.mass = mass;
            this.colour = colour;
            this.health = health;
            this.score = score;

            this.height = height;
            this.width = width;
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
                const asteroid_img = new Image();
                asteroid_img.src = "src/kindpng_1350584.png"
                context.drawImage(asteroid_img, this.x, this.y, this.width, this.height);
                context.fillStyle = save_fillStyle
            },

            this.explode = function ( explosion_colour ) {
                this.height += this.mass*this.dy;
                this.width += this.mass*this.dy;
                this.colour = explosion_colour
                this.dy = 0;
            }
        }

       

        var the_pickups = { // an object with an array of boxes and two functions to add boxes to the array

            /* an empty array to store falling_boxes */
          
            pickups: [],

            /* create a falling_box and add it to the array of falling_boxes */
            add_pickup: function (name) {
                var name = name;
                var x = Math.random() * canv.width;
                var y = Math.random() * (canv.height/2);
                var w = 15;
                var h = 15;
                var dy = 4;
               

                this.pickups.push( new Pickup( name, x, y, w, h, dy, false) )
            },

            maybe_add_pickup: function ( how_likely, name ) {
                var maybe = Math.random();
                if ( maybe < how_likely) {
                    this.add_pickup(name)
                    if(debug){console.log("DEBUG: ", name, "SPAWNED")};
                }
            }
        }

        //applies affect of powerup
        function apply_pickup(me, pickup, bullet) {

            if (pickup.name == "+HEALTH") {
                me.health += 20;
                if (debug){console.log("DEBUG: HEALTH PICKED UP. NEW HEALTH: ", me.health)};

            }

            if (pickup.name == "SHIELD") {
                var shield = new Box(me.x - 5, me.y - 5, 55, 45, "#f00", 100, 0, false);

                if (debug){console.log("DEBUG: SHIELD PICKED UP")};

            }

            if (pickup.name == "STAR") {
                me.score += 500;
                if (debug){console.log("DEBUG: SHIELD PICKED UP")};

            }

        }

        var the_falling_boxes = { // an object with an array of boxes and two functions to add boxes to the array

            /* an empty array to store falling_boxes */
            falling_boxes: [],

            /* create a falling_box and add it to the array of falling_boxes */
            add_random_falling_box: function () {

                
                var dy = (Math.random() * 3) + 4;
                var mass = Math.floor(Math.random()  * 20) + 18;
                var height = 2 * mass;
                var width = 3 * mass;
                var x = Math.random() * canv.width;
                var y = 0 - height;
                var score = mass;
                this.falling_boxes.push( new Falling_box( x, y, dy, mass, height, width, "#ffffff", 3, score) )
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
            if (debug){console.log("DEBUG: FUNC START_GAME ENTERED")}
            canv.removeEventListener("click", start_game);
            canv.addEventListener("click", fire ,false);
            game_interval = setInterval(game_loop, 50)
        }

        function main_menu() {
            canv.removeEventListener("click", main_menu);
            ctx.clearRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canv.width, canv.height); 
            ctx.fillStyle = "white";
            for (s = 0; s < the_stars.stars.length; s ++) {
                the_stars.stars[s].draw(ctx);}
            var play_button = new Button("PLAY", 220, 120, 200, 52);
            var help_button = new Button("HELP", 220, 220, 200, 52);
            var about_button = new Button("ABOUT", 220, 320, 200, 52);

            play_button.draw(ctx);
            help_button.draw(ctx);
            about_button.draw(ctx);

            canv.addEventListener("click", menu_click_handler, false);
            if ((menu_click_handler.mousex > play_button.x) && (menu_click_handler.mousex < play_button.x + play_button.width) && (menu_click_handler.mousey > play_button.y) && (menu_click_handler.mousey < play_button.y + play_button.height)) {
                start_game();
                if (debug){console.log("DEBUG: MENU CLICK. MOUSEX = ", mousex, "MOUSEY = ", mousey)};
            }  
        }

        function splash_screen() {
            ctx.clearRect(0, 0, canv.width, canv.height);
            
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "white";
            for (i = 0; i < 1000; i ++){
                the_stars.add_star();
                the_stars.stars[i].draw(ctx);
            }
            const asteroid_img = new Image();
            asteroid_img.src = "src/kindpng_1350584.png"
            ctx.drawImage(asteroid_img, canv.x + canv.width / 2, canv.y + canv.height / 2, 100, 80);

            ctx.font = "72px pixelFont";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("ASTEROID MINER", 320, 120)
            ctx.font = "48px pixelFont";
            ctx.fillStyle = "gray";
            ctx.fillText("CLICK TO CONTINUE", 320, 400)
            canv.addEventListener("click", main_menu, false);
        }

        function help_screen() {
            ctx.clearRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "white";
            for (s = 0; s < the_stars.stars.length; s ++) {
                the_stars.stars[s].draw(ctx);
                }
            ctx.font = "32px pixelFont";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("USE THE MOUSE TO MOVE, LEFT CLICK TO SHOOT", 320, 120)
            ctx.fillText("SHOOT ASTEROIDS TO SCORE POINTS", 320, 220)
            ctx.fillText("COLLECT YELLOW BOXES FOR POWERUPS", 320, 320)
            ctx.fillText("AVOID INCOMING ASTEROIDS!", 320, 420)
           
           // canv.addEventListener("click", main_menu(), false);
        }

        function about_screen() {
            ctx.clearRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "white";
            for (s = 0; s < the_stars.stars.length; s ++) {
                the_stars.stars[s].draw(ctx);
                }
            ctx.font = "32px pixelFont";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("SHIP SPRITE COURTESY OF NICEPNG", 320, 120)
            ctx.fillText("ASTEROID SPRITE COURTESY OF KINDPNG", 320, 220)
          
            //canv.addEventListener("click", main_menu(), false);
        }

        function draw_everything() {
            /* first thing to do each frame is clear the canvas */
            ctx.clearRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "white";
            for (s = 0; s < the_stars.stars.length; s ++) {
                the_stars.stars[s].draw(ctx);
                }
            /* and draw the player */
            me.draw(ctx);

            /* and draw all the falling_boxes */
            for (i=0; i<the_falling_boxes.falling_boxes.length; i++) {
                if (the_falling_boxes.falling_boxes[i].health > 0) {
                    
                the_falling_boxes.falling_boxes[i].draw(ctx);}
            }

           for (i=0; i<the_bullets.bullets.length; i++) {
                the_bullets.bullets[i].draw(ctx);
            }

            for (i=0; i<the_pickups.pickups.length; i++) {
                    
                the_pickups.pickups[i].draw(ctx);
            }           

            ctx.textAlign = "start";
            ctx.fillStyle = "white";
            ctx.font = "24px pixelFont";
            ctx.fillText("HEALTH: ", 20, 30)
            ctx.fillText("SCORE: " + me.score, 20, 65)
            ctx.fillStyle = "red";
            ctx.fillRect(20, 35, me.health, 8)
            
        }

        function floating_text(object, me) { 

            ctx.font = "16px pixelFont";
            ctx.fillStyle = "gray";
            ctx.textAlign = "start";
            ctx.clearRect(
                object.x, object.y,
                object.width, object.height );
            ctx.fillText(object.score, object.x + object.width, object.y + object.height);
            if(debug) {console.log("DEBUG: FLOATING TEXT WRITTEN")}
        }

        function game_over() {

            ctx.clearRect(0, 0, canv.width, canv.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canv.width, canv.height);
            ctx.font = "72px pixelFont";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", 320, 220)
            ctx.font = "48px pixelFont";
            ctx.fillStyle = "gray";
            ctx.fillText("SCORE: " + me.score, 320, 260)
            ctx.fillStyle = "white";
            ctx.fillRect(220, 380, 200 , 52)
            ctx.fillStyle = "black";
            ctx.fillText("CONTINUE", 320, 420);
            stop_game();
            if (debug) {console.log("DEBUG: GAME OVER");}
        }

        function game_loop() {
            //if (debug) {console.log("DEBUG: START GAME LOOP");}

            /* update falling_box positions and remove falling_boxes that have gone off the canvas */
            var i;
            var j;
            var k;
            var num = Math.floor(Math.random()  * 4) ;
            me.state = false;
            const pickup_types = ["+HEALTH","MINING LASER", "SHIELD", "POINTS"];
            /* randomly add some new falling boxes */
            the_falling_boxes.maybe_add_random_falling_box( 0.09 );
            the_pickups.maybe_add_pickup(0.005, pickup_types[num]);

            for (i=0; i<the_falling_boxes.falling_boxes.length; i++) {

                was_i_hit( the_falling_boxes.falling_boxes[i], me);
                the_falling_boxes.falling_boxes[i].update_position();
                if (the_falling_boxes.falling_boxes[i].state == true){
                    the_falling_boxes.falling_boxes.splice(i, 1);
                    if (debug) {console.log("DEBUG: BOX SPLICED. BOX ARRAY LENGTH: ", the_falling_boxes.falling_boxes.length);}
    
                  } 
                if ( (the_falling_boxes.falling_boxes[i].dy == 0)
                    || (the_falling_boxes.falling_boxes[i].y > canv.height)
                ) {
                    the_falling_boxes.falling_boxes.splice( i, 1 );
                    if (debug) {console.log("DEBUG: BOX SPLICED. BOX ARRAY LENGTH:", the_falling_boxes.falling_boxes.length);}
                }

               

                if (me.state == true) {
                    me.health -= 20;
                }
            } 

            for (i=0; i<the_falling_boxes.falling_boxes.length; i++) {                 
               
                for (j = 0; j<the_bullets.bullets.length; j++) {
                bullet_collision(the_falling_boxes.falling_boxes[i], the_bullets.bullets[j], me);
                the_bullets.bullets[j].update_position();  
                
                if (  //delete this chunk if its broken 
                    (the_bullets.bullets[j].bottom < 0)
                ) {
                    the_bullets.bullets[j].state = true;
                    //if (debug) {console.log("DEBUG: BULLET SPLICED. BULLET ARRAY LENGTH: ", the_bullets.bullets.length);}
                }

                if ((the_bullets.bullets[j].state == true)) {
                the_bullets.bullets.splice(j, 1);
                if (debug) {console.log("DEBUG: COLLISION DETECTED. BULLET SPLICED. BULLET ARRAY LENGTH: ", the_bullets.bullets.length);}
              /*  the_falling_boxes.falling_boxes.splice(i, 1);
                if (debug) {console.log("DEBUG: BOX SPLICED. BOX ARRAY LENGTH: ", the_falling_boxes.falling_boxes.length);} */

            }

            if (the_falling_boxes.falling_boxes[i].state == true) {
                the_falling_boxes.falling_boxes.splice(i, 1);
                if (debug) {console.log("DEBUG: COLLISION DETECTED. BOX SPLICED. BOX ARRAY LENGTH: ", the_falling_boxes.falling_boxes.length);}

            }
                          

                //if (debug){console.log("DEBUG: BULLET Y POS: ", the_bullets.bullets[j].y);}

                //add code to do something interesting when a falling black box is hit by a fired blue box
                }

                for (k = 0; k < the_pickups.pickups.length; k++){
                    the_pickups.pickups[k].state = false;
                    the_pickups.pickups[k].update_position(canv, the_pickups.pickups[k]);

                    pickup_collision( me, the_pickups.pickups[k]);

                  
                  
                if ((the_pickups.pickups[k].state == true)) {
                    apply_pickup(me, the_pickups.pickups[k], the_bullets.bullets[j]);
                    the_pickups.pickups.splice(k, 1);
                    if (debug) {console.log("DEBUG: PICKUP SPLICED. PICKUP ARRAY LENGTH: ", the_pickups.pickups.length);}
                    

                }

                }

                
                
            }
            
            draw_everything();
            document.getElementById("p1").innerHTML = "PLAYER HEALTH: " + me.health;
            document.getElementById("p2").innerHTML = "PLAYER SCORE: " + me.score;

            //if (debug) {console.log("DEBUG: END GAME LOOP");}

            if (me.health <= 0) {
                game_over();
            } 
        }

        /* stop updating and re-drawing the screen */
        function stop_game() {
            clearInterval(game_interval);
        }

        return { // an object with two attributes, start_game whose value is the function (method) start_game() and stop_game whose value is stop_game()
            start_game: start_game,
            stop_game: stop_game,
            splash_screen: splash_screen,
            about_screen: about_screen,
            help_screen: help_screen
        }
    }() // execute the anonymous function in order to return the object with attributes start_game and stop_game, which is assigned to falling_stuff_namespace

