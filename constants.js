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
    POINTER: {
      CLICK: "sprite-pointer-click"
    }
  },
  FOOD: {
    BANANAS: "sprite-bananas"
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
    POINTER: {
      CLICK: "animation-pointer-click"
    }
  },
  FOOD: {
    BANANAS: {
      DEFAULT: "animation-bananas"
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
      [PET_STATES.IDLE]: ANIMATIONS.PET.ROCK.IDLE,
      [PET_STATES.MOVING]: ANIMATIONS.PET.ROCK.MOVING,
      [PET_STATES.EATING]: ANIMATIONS.PET.ROCK.EATING
    }
  }
};

const FOOD_CONFIG_KEYS = {
  BANANAS: "BANANAS"
};

const FOOD_CONFIG = {
  BANANAS: {
    sprite: SPRITES.FOOD.BANANAS,
    animations: {
      [FOOD_STATES.DEFAULT]: ANIMATIONS.FOOD.BANANAS.DEFAULT
    }
  }
};
