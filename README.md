# blobogotchi

A web virtual pet game using Phaser 3.

# Setup

1. Make sure you have [node](https://nodejs.org/en/) installed. I recommend using [nvm](https://github.com/nvm-sh/nvm) to make managing node versions painless!
2. Install `http-server` globally by running `npm install -g http-server`. You'll need it for simple static file serving.
3. Once installed, navigate to this project's folder in terminal and run `http-server`.

Game should be up and running on localhost:8080! 🎉

To enable debug mode and see some helpful outlines around Game Objects and movement direction, in `config`, set `debug: true`. That's it!

# Project Architecture Overview

`SPRITES` and `ANIMATIONS`:
A categorized object of all loaded asset references. Phaser 3 uses unique strings to reference these assets when trying to use them in the game. It should be categorized by asset type.

Similar to `SPRITES`, `ANIMATIONS` is a object of animations reference keys categorized by sprite types. Animations are all defined in `defineAllAnimations`.

In order to have an animation, a sprite must be defined!

`PET_STATES`:
Describes all possible states any pet can have. This is used as the animation key for that state.

Example: if pet is in `PET_STATES.EATING`, then the associated animation should be accessible under that pet's `animations` property via the same key.

`FOOD_STATES`:
Describes all possible states any food can have. Similar to `PET_STATES`, it's used as the animation key for that food's state.

Example: If some bananas are in `FOOD_STATES.EATEN`, the animation for that should be accessible under that food's `animations` property via the same key.

`PET_CONFIGS` and `PET_CONFIG_KEYS`:
Each pet has a unique key, sprite and animations. These are all defined here in `PET_CONFIGS`. To access a specific config, I tried to make it simple by defining a list of all keys in `PET_CONFIGS_KEYS`.

Every pet should has every state defined in `PET_STATES`. Each state should have an animation defined for it too!

To do all these things in one function, use `createPet` given a specific `petConfigKey`.

# MVP Goals

✅ Animated sprite

✅ Move to clicked area

✅ Eating with animations

✅ Nice, simple background

✅ Cleaned up Pet a bit, less confusing hopefully!

✅ Cleaned up Food a bit too!

✅ Be able to pet!

TODO:

- Drag and drop a variety of food
- Somehow show pet name!
- (Optional) Auto-move to dropped food
