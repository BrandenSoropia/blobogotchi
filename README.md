# blobogotchi

A web virtual pet game using Phaser 3 (using its template project).

End Goal:
Standard pet care of feeding, cleaning and showing affection, however, word spreads that you are great with pets, that everyone dumps theirs on you! It's
now your job to take care of all of the unexpected visitors for the week (some amount of in game time). Can you handle these cute critters and make it through the week?

# Setup

1. Make sure you have [node](https://nodejs.org/en/) installed. I recommend using [nvm](https://github.com/nvm-sh/nvm) to make managing node versions painless!
2. Run `npm install`
3. Then run `nom start`
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

- Pets get hungry and show it! Die if not fed
- Pets need affection and show it! MVP: Die if not enough
- Pets can poo
- Clean up poo
- Add a different pet
- Pet will only eat certain food
- Fix eating fruit animation to use sprite and colour food being eaten
- Drag and drop a variety of food
- 1 minute timer, at end count how many pets are alive.
- (Funny and Fun) Pet tantrums: attack other pets, destroy food, run around and poop everywhere. Stopped by holding/petting.
- (Optional) Auto-move to dropped food


# Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading images via JavaScript module `import` is also supported.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.


After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Customizing Template

### Babel
You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

  ```
  "browsers": [
    ">0.25%",
    "not ie 11",
    "not op_mini all"
  ]
  ```

### Webpack
If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code
After you run the `npm run build` command, your code will be built into a single bundle located at 
`dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), 
you should be able to open `http://mycoolserver.com/index.html` and play your game.
