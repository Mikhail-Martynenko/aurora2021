import CharacterFactory from "../src/characters/character_factory";
import auroraSpriteSheet from '../assets/sprites/characters/aurora.png'
import punkSpriteSheet from '../assets/sprites/characters/punk.png'
import blueSpriteSheet from '../assets/sprites/characters/blue.png'
import yellowSpriteSheet from '../assets/sprites/characters/yellow.png'
import greenSpriteSheet from '../assets/sprites/characters/green.png'
import slimeSpriteSheet from '../assets/sprites/characters/slime.png'
import Footsteps from "../assets/audio/footstep_ice_crunchy_run_01.wav";
import tilemapPng from '../assets/tileset/Dungeon_Tileset.png'

const TILE_MAPPING = {
    BLANK: 272,
    FLOOR: 218,
    BAD_SAND: 156,
    SAND: 206,
    COLUMN_UP: 256,
    COLUMN_DOWN: 272
};

const LEVEL_TO_TILE = {
    0: TILE_MAPPING.BLANK,
    1: TILE_MAPPING.FLOOR,
    2: TILE_MAPPING.BAD_SAND,
    3: TILE_MAPPING.SAND,
    4: TILE_MAPPING.COLUMN_UP,
    5: TILE_MAPPING.COLUMN_DOWN
}


let ProcGenNew = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function RandomScene() {
        Phaser.Scene.call(this, {key: 'ProcGenNew'})
    },

    characterFrameConfig: {frameWidth: 31, frameHeight: 31},
    slimeFrameConfig: {frameWidth: 32, frameHeight: 32},

    preload: function() {
        this.load.image("tiles", tilemapPng);
        this.load.spritesheet('aurora', auroraSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('blue', blueSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('green', greenSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('yellow', yellowSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('punk', punkSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('slime', slimeSpriteSheet, this.slimeFrameConfig);
        this.load.audio('footsteps', Footsteps);
        // this.load.glsl('fire', "./shaders/sample.frag");
        //  this.load.glsl('portal', "./shaders/portal.frag");
        //  this.load.glsl('something', "./shaders/something.frag");
        // this.load.glsl('spell', "./shaders/spell.frag");
    },

    create: function() {
        this.gameObjects = [];
        this.characterFactory = new CharacterFactory(this);
        this.hasPlayerReachedStairs = false;
        const width = 50; const height = 50;

        let levelMatrix = []
        for(let y = 0; y < height; y++){
            let col = [];
            for (let x = 0; x < width; x++)
                col.push(0);
            levelMatrix.push(col);
        }

        const tilesize = 32;
        this.map = this.make.tilemap({
            tileWidth: tilesize,
            tileHeight: tilesize,
            width: width,
            height: height
        });

        const tileset = this.map.addTilesetImage("tiles", null, tilesize, tilesize);
        const outsideLayer = this.map.createBlankDynamicLayer("Water", tileset);
        const groundLayer = this.map.createBlankDynamicLayer("Ground", tileset);
        const stuffLayer = this.map.createBlankDynamicLayer("Stuff", tileset);

        const r = Math.random() + 1
        if (r < 0.5)
            levelMatrix = sandMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer)
        else
            levelMatrix = dungeonMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer)

        this.player = this.characterFactory.buildCharacter('aurora', 60, 60, {player: true});
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, outsideLayer);
        this.gameObjects.push(this.player);

        const camera = this.cameras.main;
        camera.setZoom(0.75)
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.startFollow(this.player);
        camera.roundPixels = true;

        // this.fire = this.add.shader('fire', 300, 50, 400, 400);// Шейдер огня
        // this.spell = this.add.shader('spell', 10, 150, 500, 500);// Шейдер магического заклинания
        // this.something = this.add.shader('something', 300, 50, 600, 600);// Шейдер "something"
        // this.portal = this.add.shader('portal', 600, 150, 100, 100);// Шейдер portal

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
        groundLayer.setCollisionBetween(1, 500);
        stuffLayer.setDepth(10);
        outsideLayer.setDepth(9999);
        outsideLayer.setCollisionBetween(1, 500);
    },

    update: function() {
        if (this.gameObjects) {
            this.gameObjects.forEach( function(element) {
                element.update();
            })
        }
    },
    tilesToPixels(tileX, tileY) {
        return [tileX*this.tileSize, tileY*this.tileSize];
    }
})

export default ProcGenNew

function sandMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer) {
    for(let y = 0; y < height; y++)
    {
        for(let x = 0; x < width; x++)
        {
            let ind = levelMatrix[y][x];
            if(ind === 0 && y != 0 && x != 0 && x != width - 1 && y != height - 1)
                groundLayer.putTileAt(LEVEL_TO_TILE[3], x, y)
            else
                outsideLayer.putTileAt(LEVEL_TO_TILE[0], x, y)
        }
    }

    return levelMatrix
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function dungeonMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer) {
    for(let y = 0; y < height; y++)
    {
        for(let x = 0; x < width; x++)
        {
            let index = levelMatrix[y][x];
            if(index === 0 && y != 0 && x != 0 && x != width - 1 && y != height - 1)
                groundLayer.putTileAt(LEVEL_TO_TILE[1], x, y)
            else
                outsideLayer.putTileAt(LEVEL_TO_TILE[0], x, y)
        }
    }

    let matrix = []
    for(let y = 0; y < height; y++){
        let col = [];
        for (let x = 0; x < width; x++)
            col.push(0);
        matrix.push(col);
    }

    for (let k = 0; k < getRandomInt(20, 50); k++) {
        let x = getRandomInt(1, 48)
        let y = getRandomInt(1, 48)
        let tile_counter = 290
        let flag = false

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 1; i++) {
                if (matrix[y + j][x + i] != 0) {
                    flag = true
                    break
                }
            }
        }

        if (!flag) {
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 2; i++) {
                    outsideLayer.putTileAt(tile_counter + i, x + i, y + j)
                    matrix[y + j][x + i] = 1
                }
                tile_counter += 16
            }
        }
    }

    for (let i = 0; i < getRandomInt(50, 100); i++) {
        let x = getRandomInt(1, 49)
        let y = getRandomInt(2, 49)
        if (matrix[y][x] != 1 && matrix[y - 1][x] != 1) {
            outsideLayer.putTileAt(LEVEL_TO_TILE[5], x, y)
            stuffLayer.putTileAt(LEVEL_TO_TILE[4], x, y - 1)
            matrix[y][x] = 1
            matrix[y - 1][x] = 1
        }
    }

    return levelMatrix
}

