var GameState = {
    preload: function(){
        this.load.image('background', 'assets/images/background.png');
        this.load.image('arrow', 'assets/images/arrow.png');
        
        this.load.spritesheet('chicken', 'assets/images/chicken_spritesheet.png', 131, 200, 3);
        this.load.spritesheet('horse', 'assets/images/horse_spritesheet.png', 212, 200, 3);
        this.load.spritesheet('pig', 'assets/images/pig_spritesheet.png', 297, 200,3);
        this.load.spritesheet('sheep', 'assets/images/sheep_spritesheet.png', 244, 200,3);

        this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
        this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
        this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
        this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);
    },
    create: function(){

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.background = this.game.add.sprite(0, 0, 'background');

        let animalData = [
            {key:'chicken', text:'CHICKEN', audio: 'chickenSound'},
            {key:'horse', text:'HORSE',  audio: 'horseSound'},
            {key:'pig', text:'PIG', audio: 'pigSound'},
            {key:'sheep', text:'SHEEP', audio: 'sheepSound'}
        ]

        this.animals = this.game.add.group();

        let self = this;
        let animal;

        animalData.forEach(function(element){
            animal = self.animals.create(-1000, self.game.world.centerY, element.key)
            animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
            animal.anchor.setTo(0.5);
            
            animal.animations.add('animate', [0,1,2,1,0,1], 3, false)
            
            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, this);
        });

        this.currentAnimal = this.animals.next()
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

        this.showText(this.currentAnimal);

        this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.x = -1;
        this.leftArrow.customParams = {direction: -1};

        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this)
    
        this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {direction: 1};
        
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

    },
    update: function(){
    },
    animateAnimal: function(sprite, event) {
        sprite.play('animate');
        sprite.customParams.sound.play();
    },
    switchAnimal: function(sprite, event) {

        if(this.isMoving) {
            return false;
        }

        this.isMoving = true;

        this.animalText.visible = false;

        let newAnimal, endX;

        if(sprite.customParams.direction > 0){
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width/2
            endX = 640 + this.currentAnimal.width/2
        }
        else {
            newAnimal = this.animals.previous();
            newAnimal.x = 640 + newAnimal.width/2
            endX = -this.currentAnimal.width/2
        }

        let newAnimalMovement = this.game.add.tween(newAnimal);
        newAnimalMovement.to({x: this.game.world.centerX});
        newAnimalMovement.onComplete.add(function(){
            this.isMoving = false;
            this.showText(this.currentAnimal);
        }, this);
        newAnimalMovement.start();

        let currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x: endX});
        currentAnimalMovement.start();

        this.currentAnimal = newAnimal;
    },
    showText: function(animal) {
        if(!this.animalText) {
            let style = {
                font: 'bold 30pt Arail',
                fill: '#D0171B',
                align: 'center'
            }
            this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style)
            this.animalText.anchor.setTo(0.5);
        }
        this.animalText.setText(animal.customParams.text)
        this.animalText.visible = true;
    }

};
let game = new Phaser.Game(640, 360, Phaser.AUTO)

game.state.add('GameState', GameState);
game.state.start('GameState')