import Phaser from "phaser";
import BGPink from "./assets/backgrounds/pink.png";
import PetRockIdleSpriteSheet from "./assets/pets/rock/idle.png";
import PetRockMovingSpriteSheet from "./assets/pets/rock/moving.png";
import FruitBananasSpriteSheet from "./assets/food/bananas.png";
import FruitStrawberrySpriteSheet from "./assets/food/strawberry.png";
import UICursorClickedSpriteSheet from "./assets/ui/clicked.png";
// TODO: Split apart code!

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Global variables.
let pet = null; // Individual pet Game Object
let movementDestinationMarker = null; // Game Object
let fruitsGroup = null; // Group to store all fruits
let gameArea = null; // Overlap game window to track clicks for movement
const game = new Phaser.Game(config);

// Asset constants
const BACKGROUNDS = {
  PINK: "background-pink"
};

// Describes all possible states any pet can have
const PET_STATES = {
  IDLE: "IDLE",
  MOVING: "MOVING",
  EATING: "EATING",
  PETTING: "PETTING"
};

// Describes all possible states any food can have
const FOOD_STATES = {
  DEFAULT: "DEFAULT",
  EATEN: "EATEN"
};

// I think I need this to help recognize difference Game Objects
const GAME_OBJECT_TYPES = {
  PET: "go-type-pet",
  FOOD: "go-type-pet"
};

/**
 * Every time a new sprite sheet is added, its reference key should be added here.
 */
const SPRITES = {
  PET: {
    ROCK: {
      IDLE: "sprite-rock-idle",
      MOVING: "sprite-rock-moving"
    }
  },
  UI: {
    MOVEMENT_DESTINATION_MARKER: {
      CLICK: "sprite-pointer-click"
    }
  },
  FOOD: {
    BANANAS: "sprite-bananas",
    STRAWBERRY: "sprite-strawberry"
  }
};

/**
 * Every time a new animation is added, its reference key should be added here. These
 * rely on associated SPRITE being defined as well!
 */
const ANIMATIONS = {
  PET: {
    ROCK: {
      IDLE: "animation-rock-idle",
      MOVING: "animation-rock-moving",
      EATING: "animation-rock-eating",
      PETTING: "animation-rock-petting"
    }
  },
  UI: {
    MOVEMENT_DESTINATION_MARKER: {
      CLICK: "animation-pointer-click"
    }
  },
  FOOD: {
    BANANAS: {
      DEFAULT: "animation-bananas"
    },
    STRAWBERRY: {
      DEFAULT: "animation-strawberry"
    }
  }
};

// Pet keys to reference PET_CONFIGS
const PET_CONFIG_KEYS = {
  ROCK: "ROCK"
};

// All pet properties defined here
const PET_CONFIGS = {
  ROCK: {
    sprite: SPRITES.PET.ROCK.IDLE, // Temp default sprite
    animations: {
      hi: "hello",
      [PET_STATES.IDLE]: ANIMATIONS.PET.ROCK.IDLE,
      [PET_STATES.MOVING]: ANIMATIONS.PET.ROCK.MOVING,
      [PET_STATES.EATING]: ANIMATIONS.PET.ROCK.EATING,
      [PET_STATES.PETTING]: ANIMATIONS.PET.ROCK.PETTING
    }
  }
};

const FOOD_CONFIG_KEYS = {
  BANANAS: "BANANAS",
  STRAWBERRY: "STRAWBERRY"
};

const FOOD_CONFIG = {
  BANANAS: {
    sprite: SPRITES.FOOD.BANANAS,
    animations: {
      [FOOD_STATES.DEFAULT]: ANIMATIONS.FOOD.BANANAS.DEFAULT
    }
  },
  STRAWBERRY: {
    sprite: SPRITES.FOOD.STRAWBERRY,
    animations: {
      [FOOD_STATES.DEFAULT]: ANIMATIONS.FOOD.STRAWBERRY.DEFAULT
    }
  }
};

/**
 * Load all assets here:
 * 1) Pet sprite
 */
function preload() {
  this.load.image(BACKGROUNDS.PINK, BGPink);
  this.load.spritesheet(SPRITES.PET.ROCK.IDLE, PetRockIdleSpriteSheet, {
    frameWidth: 38,
    frameHeight: 34
  });
  this.load.spritesheet(SPRITES.PET.ROCK.MOVING, PetRockMovingSpriteSheet, {
    frameWidth: 38,
    frameHeight: 34
  });
  this.load.spritesheet(
    SPRITES.UI.MOVEMENT_DESTINATION_MARKER.CLICK,
    UICursorClickedSpriteSheet,
    {
      frameWidth: 32,
      frameHeight: 32
    }
  );
  this.load.spritesheet(SPRITES.FOOD.BANANAS, FruitBananasSpriteSheet, {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.spritesheet(SPRITES.FOOD.STRAWBERRY, FruitStrawberrySpriteSheet, {
    frameWidth: 32,
    frameHeight: 32
  });
}

/**
 * GAME OBJECT CREATORS
 */
/**
 * @function createPet Instantiate and return Game Object for pet with type, state, animations and their associtated
 * helpers based off of given `petConfigKey`. Placed in the center of the canvas
 *
 * Note to self:
 * My JS chops are not as good as I thought, dealing with `this`, for now `.bind` works.
 */
const createPet = ({ petConfigKey, _this }) => {
  const petConfig = PET_CONFIGS[petConfigKey];

  const newPet = _this.physics.add.sprite(400, 300, petConfig.sprite);

  // Activate physics with world and interactions with user
  newPet.setCollideWorldBounds(true);
  newPet.setInteractive({ useHandCursor: true });

  // Handle Petting animation and transitions
  newPet
    .on("pointerdown", function() {
      if (newPet.getState() !== PET_STATES.PETTING) {
        newPet.setState(PET_STATES.PETTING);
        newPet.playCurrentStateAnimation();
      }
    })
    .on("pointerup", function() {
      newPet.setState(PET_STATES.IDLE);
      newPet.playCurrentStateAnimation();
    });

  // Setup all related data to specific pet based on id
  newPet.setData({
    type: GAME_OBJECT_TYPES.PET,
    state: PET_STATES.IDLE,
    animations: petConfig.animations
  });

  newPet.playAnimation = function(animationKey) {
    const animations = this.getData("animations");
    this.anims.play(animations[animationKey]);
  }.bind(newPet);

  newPet.getState = function() {
    return this.getData("state");
  }.bind(newPet);

  newPet.setState = function(newState) {
    this.setData({ state: newState });
  }.bind(newPet);

  newPet.playCurrentStateAnimation = function() {
    this.playAnimation(this.getState());
  }.bind(newPet);

  // Some actions should cause other actions to be ignored. Use this function to determine that!
  newPet.canAct = function() {
    return this.getState() !== PET_STATES.EATING;
  }.bind(newPet);

  newPet.getType = function() {
    return this.getData("type");
  }.bind(newPet);

  newPet.playCurrentStateAnimation();

  return newPet;
};

/**
 * LOAD GAME ASSETS, DEFINE ANIMATIONS, SETUP GAME OBJECTS ETC
 */
/**
 * @function createFruit Setup and instantiate a new fruit Game Object complete with
 * sprite, animations, physics, interactions, draggable, and helpers. Also trigger its
 * default animation to play on initialization.
 */
const createFruit = ({ foodConfigKey, phaser, coordinates }) => {
  const foodConfig = FOOD_CONFIG[foodConfigKey];
  // Create Game Object and turn on phyics and interactions with user
  const newFruit = phaser.physics.add
    .sprite(coordinates.x, coordinates.y, foodConfig.sprite)
    .setScale(1.25); // They are a little small so make them bigger without making them ugly
  newFruit.setInteractive({ useHandCursor: true });
  phaser.input.setDraggable(newFruit);

  newFruit.on("drag", function(_, dragX, dragY) {
    newFruit.x = dragX;
    newFruit.y = dragY;
  });

  newFruit.setData({
    type: GAME_OBJECT_TYPES.FOOD,
    state: FOOD_STATES.DEFAULT,
    animations: foodConfig.animations
  });

  newFruit.setState = function(newState) {
    this.setData({ state: newState });
  }.bind(newFruit);

  newFruit.getState = function() {
    return this.getData("state");
  }.bind(newFruit);

  newFruit.playAnimation = function(animationKey) {
    const animations = this.getData("animations");

    this.anims.play(animations[animationKey]);
  }.bind(newFruit);

  newFruit.playCurrentStateAnimation = function() {
    this.playAnimation(this.getData("state"));
  }.bind(newFruit);

  newFruit.getType = function() {
    return this.getData("type");
  }.bind(newFruit);

  newFruit.playCurrentStateAnimation();

  return newFruit;
};

/**
 * @function setupMovementPointer Initialize and return an invisible Game Object with sprite, physics and animations. Initially placed in (0, 0) of the canvas.
 *
 * This is used to mark movement destination, and should be moved back to (0, 0) once movement to this point is done.
 */
const setupMovementPointer = (pointerSprite, _this) => {
  const newPointer = _this.physics.add
    .sprite(0, 0, pointerSprite)
    .setVisible(false);

  newPointer.on("animationcomplete", () => {
    newPointer.setVisible(false);
  });

  return newPointer;
};

/**
 * @function setupTileBackground Build background given background tile sprite key.
 *
 * I figure that the create Game Objects don't need to be returned since they'll only be set once.
 */
const setupTileBackground = (backgroundTileSpriteKey, _this) => {
  const container = _this.add
    .container(400, 300)
    .setName("tile-background-container");
  const tileSprite = _this.add.tileSprite(0, 0, 800, 600, BACKGROUNDS.PINK);

  container.add(tileSprite);
};

const setupInputHandlers = _this => {
  moveInGamePointerAndMovePetTowardsIt(pet, movementDestinationMarker, _this);
};

/**
 * @function defineAllAnimations Define all animations.
 *
 * Trying to keep things cons
 */
const defineAllAnimations = _this => {
  _this.anims.create({
    key: ANIMATIONS.PET.ROCK.IDLE,
    frames: _this.anims.generateFrameNumbers(SPRITES.PET.ROCK.IDLE, {
      start: 0,
      end: 14
    }),
    frameRate: 10,
    repeat: -1
  });
  _this.anims.create({
    key: ANIMATIONS.PET.ROCK.MOVING,
    frames: _this.anims.generateFrameNumbers(SPRITES.PET.ROCK.MOVING, {
      start: 0,
      end: 14
    }),
    frameRate: 10,
    repeat: -1
  });

  _this.anims.create({
    key: ANIMATIONS.PET.ROCK.EATING,
    frames: _this.anims.generateFrameNumbers(SPRITES.PET.ROCK.IDLE, {
      frames: [14, 12, 14, 10]
    }),
    frameRate: 10,
    repeat: -1
  });

  _this.anims.create({
    key: ANIMATIONS.PET.ROCK.PETTING,
    frames: _this.anims.generateFrameNumbers(SPRITES.PET.ROCK.IDLE, {
      frames: [14, 13, 12, 11]
    }),
    frameRate: 5,
    repeat: -1
  });

  _this.anims.create({
    key: ANIMATIONS.FOOD.BANANAS.DEFAULT,
    frames: _this.anims.generateFrameNumbers(SPRITES.FOOD.BANANAS, {
      start: 0,
      end: 14
    }),
    frameRate: 10,
    repeat: -1
  });

  _this.anims.create({
    key: ANIMATIONS.FOOD.STRAWBERRY.DEFAULT,
    frames: _this.anims.generateFrameNumbers(SPRITES.FOOD.STRAWBERRY, {
      start: 0,
      end: 14
    }),
    frameRate: 10,
    repeat: -1
  });

  _this.anims.create({
    key: ANIMATIONS.UI.MOVEMENT_DESTINATION_MARKER.CLICK,
    frames: _this.anims.generateFrameNumbers(
      SPRITES.UI.MOVEMENT_DESTINATION_MARKER.CLICK,
      {
        start: 0,
        end: 6
      }
    ),
    frameRate: 15
  });
};

/**
 * MOVING GAME OBJECTS
 */
const moveInGamePointerAndAnimateOnClick = ({
  movementDestinationMarker,
  newCoordinates
}) => {
  movementDestinationMarker
    .setVisible(true)
    .setPosition(newCoordinates.x, newCoordinates.y);
  movementDestinationMarker.anims.play(
    ANIMATIONS.UI.MOVEMENT_DESTINATION_MARKER.CLICK
  );
};

/**
 * Note: Must move in game pointer first so pet can be directed towards it.
 */
const moveInGamePointerAndMovePetTowardsIt = (
  petToMove,
  ObjectToMoveTo,
  _this
) => {
  gameArea.on(
    "pointerdown",
    function(_pointer) {
      /**
       * Problem: when pet is clicked, this event is triggered. This causes in game
       * cursor to be placed and immediately overlapped, causing pet's state to be set to IDLE.
       * This overwrites on pet click.
       *
       * options:
       * 1) don't do this if clicked on pet
       * 2) disable all pointerdown's if pet clicked
       */
      if (petToMove.canAct() && !_this.physics.overlap(petToMove, _pointer)) {
        moveInGamePointerAndAnimateOnClick({
          movementDestinationMarker,
          newCoordinates: {
            x: _pointer.x,
            y: _pointer.y
          }
        });

        petToMove.setState(PET_STATES.MOVING);
        petToMove.playCurrentStateAnimation();

        _this.physics.moveToObject(petToMove, ObjectToMoveTo, 150);
      }
    },
    _this
  );
};

/**
 * Used to track click within the game display. Required for petting.
 */
const setupGameArea = _this => {
  gameArea = _this.add.sprite(400, 300, "").setInteractive();
  gameArea.displayWidth = 800;
  gameArea.displayHeight = 600;
};

/**
 * OBJECT INTERACTIONS
 */
const defineObjectInteractions = _this => {
  _this.physics.add.overlap(
    pet,
    movementDestinationMarker,
    (overlappedPet, overlappedMovementDestinationMarker) => {
      overlappedPet.body.stop();
      overlappedPet.setState(PET_STATES.IDLE);
      overlappedPet.playCurrentStateAnimation();

      overlappedMovementDestinationMarker.setPosition(0, 0);
    },
    null,
    _this
  );

  _this.physics.add.overlap(
    pet,
    fruitsGroup,
    (_pet, overlappedFruit) => {
      handleEating(_pet, overlappedFruit, _this);
    },
    null,
    _this
  );
};

/**
 * USER FEEDBACK EFFECTS
 * (things that help the user see something is happening)
 */
/**
 * @function flashingSpriteAnimation Create and apply a flashing silhouette over the object using graphics. Return graphics objects.
 *
 * TODO: Fix this to flash using the specific fruit's graphic. ATM this only uses yellow and a banana.
 */
const flashingSpriteAnimation = ({
  objectToAnimate,
  objectSpriteKey,
  colorInHEX,
  _this
}) => {
  // Create a graphics only copy of the object, with color
  const graphics = _this.add
    .graphics({
      x: objectToAnimate.x - objectToAnimate.width / 2,
      y: objectToAnimate.y - objectToAnimate.height / 2
    })
    .fillStyle(colorInHEX, 0.75)
    .setTexture(objectSpriteKey, undefined, 1)
    .fillRect(0, 0, objectToAnimate.width, objectToAnimate.height);

  // Apply fade-in/out effect on graphics
  _this.tweens.add({
    targets: graphics,
    alpha: 0,
    ease: "Cubic.easeOut",
    duration: 350,
    repeat: -1,
    yoyo: true
  });

  return graphics;
};

const handleEating = (petEating, objectBeingEaten, _this) => {
  if (petEating.canAct()) {
    petEating.setVelocity(0);
    petEating.setState(PET_STATES.EATING);
    petEating.playCurrentStateAnimation();

    objectBeingEaten.anims.stop();

    const flashingObjectGraphics = flashingSpriteAnimation({
      objectToAnimate: objectBeingEaten,
      objectSpriteKey: SPRITES.FOOD.BANANAS,
      colorInHEX: "0xffff00",
      _this
    });

    _this.time.delayedCall(
      3000,
      destroyObjects,
      [objectBeingEaten, flashingObjectGraphics],
      _this
    );

    _this.time.delayedCall(
      3000,
      _pet => {
        _pet.setState(PET_STATES.IDLE);
        _pet.playCurrentStateAnimation();
      },
      [petEating],
      _this
    );
  }
};

/**
 * HELPER FUNCTIONS
 */
/**
 * @function destroyObjects Useful helper to destroy all given objects
 */
const destroyObjects = (...args) => {
  args.forEach(arg => arg.destroy());
};

/**
 * Create all game objects and their relationships here:
 * 1) Pet
 * 2) Input handling
 */
function create() {
  setupGameArea(this);
  setupTileBackground(BACKGROUNDS.PINK, this);
  defineAllAnimations(this);

  pet = createPet({ petConfigKey: PET_CONFIG_KEYS.ROCK, _this: this });

  fruitsGroup = this.add.group();

  fruitsGroup.add(
    createFruit({
      foodConfigKey: FOOD_CONFIG_KEYS.BANANAS,
      phaser: this,
      coordinates: {
        x: 200,
        y: 300
      }
    })
  );

  fruitsGroup.add(
    createFruit({
      foodConfigKey: FOOD_CONFIG_KEYS.STRAWBERRY,
      phaser: this,
      coordinates: {
        x: 300,
        y: 200
      }
    })
  );

  movementDestinationMarker = setupMovementPointer(
    SPRITES.UI.MOVEMENT_DESTINATION_MARKER.CLICK,
    this
  );

  // Collisions
  defineObjectInteractions(this);
  setupInputHandlers(this);
}

/**
 *  Handle all interactions here
 */
function update() {}
