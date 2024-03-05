import bgMusic from '@assets/audio/duckcing.mp3'
import bg from '@assets/game/background.png'
import idle from '@assets/game/idle.png'
import walk from '@assets/game/walking.png'
import walkMirrored from '@assets/game/walking-mirrored.png'
import idleMirrored from '@assets/game/idle-mirrored.png'
import lowKick from '@assets/game/lowkick.png'
import lowKickMirrored from '@assets/game/lowkick-mirrored.png'
import frontKick from '@assets/game/frontkick.png'
import frontKickMirrored from '@assets/game/frontkick-mirrored.png'

type Coor = {
    x: number;
    y: number;
}

type PlayerAttributes = {
    position: Coor;
    size:Coor;
    velocity: Coor;
    speed:number;
    imageSrc?: string;
    scale?: number;
    maxFrames?: number;
    offset: Coor;
    sprites:any
    flipHorizontal?:boolean
}
type HitBox = {
    offset:Coor
    position: Coor
    size: Coor
}

enum AttackType {
    LowKick,
    FrontKick
}

export default class Game {
    private backgroundMusic: HTMLAudioElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly player1Hp: HTMLDivElement;
    private readonly player2Hp: HTMLDivElement;
    private readonly timer: HTMLDivElement;
    private readonly msg: HTMLDivElement;
    private readonly c: CanvasRenderingContext2D;
    private lastTime = 0;
    private player1: Player;
    private player2: Player;
    private duration:number
    private timerInterval?: number;
    private gameOver: boolean 
    private background: Background
    private keyStates: any

    private targetFPS: number = 60;
    private frameInterval: number = 1000 / this.targetFPS;
    private lastFrameTime: number = 0;

    
    

    constructor(canvas: HTMLCanvasElement, player1Hp: HTMLDivElement, player2Hp: HTMLDivElement, timer:HTMLDivElement, msg:HTMLDivElement ) {
        this.duration = 60
        this.canvas = canvas;
        this.player1Hp = player1Hp
        this.player2Hp = player2Hp
        this.msg = msg
        this.timer = timer
        this.canvas.width = 1400;
        this.canvas.height = 800;
        this.msg.style.display = 'none'
        this.gameOver = false;
        this.backgroundMusic = new Audio(bgMusic);
        this.keyStates = {};
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context');
        }
        this.c = context;

        this.background = new Background(this.c,{
            position:{
                x:0,
                y:0
            },
            imageSrc: bg,
        })

        this.player1 = new Player(this.c, {
            speed:15,
            position: {
                x: 0,
                y: 0
            },
            size: {
                x: 200,
                y: 250
            },
            velocity: {
                x: 0,
                y: 0
            },
            offset :{
                x:50,
                y:0
            },
            imageSrc:idle,
            maxFrames:6,
            scale:1,
            sprites:{
                idle:{
                    imageSrc: idle,
                    maxFrames:6,
                },
                right:{
                    imageSrc: walk,
                    maxFrames:3,
                },
                left:{
                    imageSrc: walk,
                    maxFrames:3,
                },
                lowKick:{
                    imageSrc: lowKick,
                    maxFrames:4,
                },
                frontKick:{
                    imageSrc: frontKick,
                    maxFrames:3,
                }
            }
        });

        this.player2 = new Player(this.c, {
            flipHorizontal:true,
            speed:15,
            position: {
                x: 500,
                y: 0
            },
            size: {
                x: 200,
                y: 250
            },
            velocity: {
                x: 0,
                y: 0
            },
            offset :{
                x:-50,
                y:0
            },
            imageSrc:idleMirrored,
            maxFrames:6,
            sprites:{
                idle:{
                    imageSrc: idleMirrored,
                    maxFrames:6,
                },
                right:{
                    imageSrc: walkMirrored,
                    maxFrames:3,
                },
                left:{
                    imageSrc: walkMirrored,
                    maxFrames:3,
                },
                lowKick:{
                    imageSrc: lowKickMirrored,
                    maxFrames:4,
                },
                frontKick:{
                    imageSrc: frontKickMirrored,
                    maxFrames:3,
                }
            }
        });

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
    }

    handleKeyDown(event:any) {
        this.keyStates[event.key] = true;
        this.updatePlayerActions();
    }

    handleKeyUp(event:any) {
        this.keyStates[event.key] = false;
        this.updatePlayerActions();
    }
    updatePlayerOrientation() {
        const player1IsLeft = this.player1.position.x < this.player2.position.x;

        this.player1.flipHorizontal = !player1IsLeft  
        this.player2.flipHorizontal = !player1IsLeft; 
    }


    updatePlayerActions() {
        if (this.gameOver) return;
        if (this.keyStates['w']) this.player1.jump();
        if (this.keyStates['a']) this.player1.moveLeft(true);
        if (this.keyStates['d']) this.player1.moveRight(true);
        if (this.keyStates[' '] ) this.checkForAttack(this.player1,{
            l:'a',
            r:'d',
            d:'s',
            trig:' '
        });

        if (!this.keyStates['a'] && !this.keyStates['d']) this.player1.stop();


        if (this.keyStates['i']) this.player2.jump();
        if (this.keyStates['j']) this.player2.moveLeft(true);
        if (this.keyStates['l']) this.player2.moveRight(true);
        if (this.keyStates['m']) this.checkForAttack(this.player2,{
            l:'j',
            r:'l',
            d:'k',
            trig:'m'
        });

        if (!this.keyStates['j'] && !this.keyStates['l']) this.player2.stop();
    }

    checkForAttack(player:Player,{l,r,d,trig}:any) {
        if (this.keyStates[d] && this.keyStates[trig]) {
            player.attack(AttackType.LowKick);
        } else if ((this.keyStates[l] || this.keyStates[r]) && this.keyStates[trig]) {
            player.attack(AttackType.FrontKick);
        }
    }

    private update(deltaTime: number) {
        this.detectCollision()
        if(this.player1.health <=0 || this.player2.health <=0){
            this.winWinChickenDinner(this.player1, this.player2)
        }
    }

    private draw() {
        this.background.update()
        this.player1.update();
        this.player2.update();
    }

    private gameLoop(timestamp: number) {
        requestAnimationFrame(this.gameLoop.bind(this));

        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime >= this.frameInterval) {
            this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);

            this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.updatePlayerOrientation();
            this.update(deltaTime);
            this.draw();
        }
    }

    public start() {
        this.clock()
        this.backgroundMusic.play().catch(error => console.error("Playback failed", error));
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    
    public getContext() {
        return this.c;
    }

    private collision(box1:any, box2:any){
        return(box1.attackBox.position.x + box1.attackBox.size.x >= box2.position.x
            && box1.attackBox.position.x <= box2.position.x + box2.size.x
            && box1.attackBox.position.y + box1.attackBox.size.y >= box2.position.y
            && box1.attackBox.position.y <= box2.position.y + box2.size.y
            && (box1.isAttacking))
    }
    private detectCollision() {
        if(this.collision(this.player1, this.player2) && (this.player1.isAttacking) ){
                console.log('p1 collision att')
                this.player1.isAttacking = false
                if((this.player2.health -= this.player1.damage) <= 0 ){
                    this.player2.health = 0
                }
                this.player2Hp.style.width = `${this.player2.health}%`
        }

        if(this.collision(this.player2, this.player1)&& (this.player2.isAttacking) ){
                console.log('p2 collision att')

                this.player2.isAttacking = false
                if((this.player1.health -= this.player2.damage) <= 0){
                    this.player1.health = 0
                }
                this.player1Hp.style.width = `${this.player1.health}%`
        }
    }

    private clock(){
        this.timerInterval = setInterval(() => {
            if(this.duration > 0){
                this.duration--;
                this.timer.innerHTML = this.duration.toString();
            } else {
                clearInterval(this.timerInterval);
                this.winWinChickenDinner(this.player1, this.player2)
            }
        }, 1000);
    }

    private winWinChickenDinner(player1:Player, player2:Player){
        clearInterval(this.timerInterval);
        this.backgroundMusic.pause()
        this.backgroundMusic.currentTime =0
        this.gameOver = true
        if(player1.health == player2.health){
            this.msg.style.display = 'flex'
            this.msg.innerHTML = 'YOU TIED'
        }
        else if(player1.health > player2.health){
            this.msg.style.display = 'flex'
            this.msg.innerHTML = 'PLAYER 1 WINS'
        }
        else if(player1.health < player2.health){
            this.msg.style.display = 'flex'
            this.msg.innerHTML = 'PLAYER 2 WINS'
        }
    }
    
}

//TODO:===================================
class Sprite {
    protected c: CanvasRenderingContext2D;
    public position: Coor;
    public size: Coor;
    public image: HTMLImageElement;
    protected scale: number
    protected maxFrames :number
    protected frame : number
    protected hold :number
    public frameElapsed:number
    public flipHorizontal: boolean;

    constructor(c: CanvasRenderingContext2D, { position, size, imageSrc , scale = 1, maxFrames = 1, flipHorizontal}: any) {
        this.c = c;
        this.position = position;
        this.size = size;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale
        this.maxFrames = maxFrames
        this.frame = 0
        this.hold = 10
        this.frameElapsed= 0
        this.flipHorizontal = flipHorizontal;
    }

    draw() {
    if (this.flipHorizontal) {
        this.c.save();
        this.c.scale(-1, 1);
        this.c.drawImage(
            this.image,
            this.frame * (this.image.width / this.maxFrames),
            0,
            this.image.width / this.maxFrames,
            this.image.height,
            -(this.position.x + this.size.x * this.scale / 2), 
            this.position.y,
            this.size.x * this.scale,
            this.size.y * this.scale
        );
        this.c.restore(); 
    } else {
        this.c.drawImage(
            this.image,
            this.frame * (this.image.width / this.maxFrames),
            0,
            this.image.width / this.maxFrames,
            this.image.height,
            this.position.x,
            this.position.y,
            this.size.x * this.scale,
            this.size.y * this.scale
        );
    }
}


    

    animate() {
        this.frameElapsed++;
        if (this.frameElapsed % this.hold === 0) {
            if (this.frame < this.maxFrames - 1) {
                this.frame++;
            } else {
                this.frame = 0;
            }
        }
        
    }
    

    update() {
        this.draw();
        this.animate()
        
    }
}


//TODO:===================================
class Player extends Sprite {

    private velocity: Coor;

    private gravity: number
    private speed: number;
    public health: number
    public damage



    public isJumping: boolean;
    public isAttacking: boolean
    private movingLeft: boolean
    private movingRight: boolean

    public sprites : any
    public attackBox:HitBox;
    private currentSprite: HTMLImageElement;
    private isLowKicking: boolean 
    private isFrontKicking: boolean

    constructor(c: CanvasRenderingContext2D, attributes: PlayerAttributes) {
        super(c, attributes);
        this.velocity = attributes.velocity;
        this.speed = attributes.speed;
        this.sprites = attributes.sprites;
        this.currentSprite = this.sprites.idle.image; 
        this.maxFrames = this.sprites.idle.maxFrames;

        this.damage = 10
        this.isJumping = false;
        this.health = 100;
        this.gravity = 0.98;
        this.attackBox = {
            offset:{
                x: attributes.offset.x,
                y: attributes.offset.y,

            },
            position: {
                x: attributes.position.x + attributes.offset.x,
                y: attributes.position.y + attributes.offset.y
            },
            size: {
                x: 150,
                y: 50
            }
        };

        this.isAttacking = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.isLowKicking = false;
        this.isFrontKicking = false;


        //@ts-ignore
        Object.keys(this.sprites).forEach((key) => {
            this.sprites[key].image = new Image();
            this.sprites[key].image.src = this.sprites[key].imageSrc;
        });
        
    }

    handleLowKick() {
        this.isAttacking = true; 
        this.isLowKicking = true;
        this.damage = 15
        setTimeout(() => {
            this.isLowKicking = false
            this.isAttacking = false
        }, 500); 
    }

    handleFrontKick() {
        this.isAttacking = true; 
        this.isFrontKicking = true;
        this.damage = 10
        setTimeout(() => {
            this.isFrontKicking = false
            this.isAttacking = false
        }, 500); 
    }

    jump() {
        if (!this.isJumping) {
            this.velocity.y -= 15; 
            this.isJumping = true;
        }
    }

    moveLeft(flag: boolean) {
        this.movingLeft = flag;
    }

    moveRight(flag: boolean) {
        this.movingRight = flag;
    }

    stop() {
        this.movingLeft = false;
        this.movingRight = false;
    }
    drawHitbox() {
        this.c.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.size.x,
            this.attackBox.size.y
        );
    }
    update() {
        this.applyGravity();
        this.applyBoundaries();
        this.handleMovement();
        // this.drawHitbox()

        super.update();


        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
    }

public adjustHitbox() {
    if (this.flipHorizontal) {
        this.attackBox.position.x = this.position.x + this.size.x - this.attackBox.offset.x - this.attackBox.size.x;
    } else {
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    }
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
}


    private handleMovement() {

        if (this.movingLeft) {
            this.velocity.x = -this.speed;
            this.currentSprite = this.sprites.left.image;
            this.maxFrames = this.sprites.left.maxFrames;
        } 
        else if (this.movingRight) {
            this.velocity.x = this.speed;
            this.currentSprite = this.sprites.right.image;
            this.maxFrames = this.sprites.right.maxFrames;
        } 
        else {
            this.velocity.x = 0;
            this.currentSprite = this.sprites.idle.image;
            this.maxFrames = this.sprites.idle.maxFrames;
        }
        
        if (this.isLowKicking) {
            this.currentSprite = this.sprites.lowKick.image;
            this.maxFrames = this.sprites.lowKick.maxFrames;
            // this.hold = 30
        }

        else if (this.isFrontKicking) {
            this.currentSprite = this.sprites.frontKick.image;
            this.maxFrames = this.sprites.frontKick.maxFrames;
        }

        this.image = this.currentSprite; 
    }


    private applyGravity() {
        if (this.position.y + this.size.y + this.velocity.y <= this.c.canvas.height) {
            this.velocity.y += this.gravity;
        } else {
            this.velocity.y = 0;
            this.isJumping = false;
        }
    }
    private applyBoundaries() {
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0; 
        } else if (this.position.x + this.size.x > this.c.canvas.width) {
            this.position.x = this.c.canvas.width - this.size.x;
            this.velocity.x = 0; 
        }
    }

    attack(type: AttackType) {
        switch (type) {
            case AttackType.LowKick:
                this.handleLowKick();
                break;
            case AttackType.FrontKick:
                this.handleFrontKick();
                break;
        }
    }
}

//TODO:===================================
class Background {
    private c: CanvasRenderingContext2D;
    public position: Coor;
    public size: Coor;
    private image: HTMLImageElement;

    constructor(c: CanvasRenderingContext2D, { position, size, imageSrc,  }: any) {
        this.c = c;
        this.position = position;
        this.size = size;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw() {
        const scale = Math.max(this.c.canvas.width / this.image.width, this.c.canvas.height / this.image.height);
        const scaledWidth = this.image.width * scale;
        const scaledHeight = this.image.height * scale;

        const x = (this.c.canvas.width - scaledWidth) / 2;
        const y = (this.c.canvas.height - scaledHeight) / 2;

        this.c.drawImage(this.image, x, y, scaledWidth, scaledHeight);
    }

    update() {
        this.draw();
    }
}