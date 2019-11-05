<template>
  <div class="pac-man">
    <canvas id="canvas" class="canvas"></canvas>
    <button class="btn" @click="setStage(1)">Start</button>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'vue-property-decorator'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAP_DATA
} from './helpers/Constant'
import {
  GlobalEnv
} from './helpers/Interfaces'
import {
  getCanvasElementById,
  getCanvasRenderingContext2D
} from './helpers/Utils'
import {
  Stage,
  SplashStage,
  GameStage,
  EndStage
} from './components/Stage'
import {
  Map,
  BaseMap,
  BeanMap
} from './components/Map'
import {
  Item,
  LogoItem,
  NameItem,
  ScoreLevelItem,
  StatusItem,
  LifeItem,
  PlayerItem,
  NpcItem
} from './components/Item'


@Component
export default class PacMan extends Vue {
  // 画布级别变量
  $canvas!: HTMLCanvasElement
  $context!: CanvasRenderingContext2D
  WIDTH: number = CANVAS_WIDTH
  HEIGHT: number = CANVAS_HEIGHT
  stages: Stage[] = []
  currentIndex: number = 0
  // 动画变量
  currentFrame: number = 0
  handler: number = 0
  // 全局变量
  globalObj: GlobalEnv = {
    COLOR: ['#F00', '#F93', '#0CF', '#F9C'],  // NPC 颜色
    COS: [1, 0, -1, 0],
    SIN: [0, 1, 0, -1],
    SCORE: 0,
    LIFE: 5,
    NPC_COUNT: 4
  }
  mounted() {
    this.initCanvas()
    this.initStages()
    this.startAnimate()
  }
  initCanvas() {
    this.$canvas = getCanvasElementById('canvas')
    this.$canvas.width = this.WIDTH
    this.$canvas.height = this.HEIGHT
    this.$context = getCanvasRenderingContext2D(this.$canvas)
  }
  initStages() {
    this.initSplashStage()
    this.initMainStage()
    this.initEndStage()
  }
  initSplashStage() {
    const stage = new SplashStage({
      index: this.stages.length
    })
    stage.createItem('logo', {
      x: this.WIDTH / 2,
      y: this.HEIGHT * .45,
      width: 100,
      height: 100,
      frames: 3
    })
    stage.createItem('name', {
      x: this.WIDTH / 2,
      y: this.HEIGHT * .6
    })
    this.stages.push(stage)
  }
  initMainStage() {
    MAP_DATA.forEach((config: any) => {
      const stage = new GameStage({
        index: this.stages.length,
        CONFIG: config
      })
      stage.BaseMap = stage.createMap('base', {
        x: 60,
        y: 10,
        data: config.map,
        cache: true
      })
      stage.BeanMap = stage.createMap('bean', {
        x: 60,
        y: 10,
        data: config.map,
        frames: 8
      })
      stage.createItem('score_level', {
        x: 690,
        y: 80
      })
      stage.createItem('status', {
        x: 690,
        y: 285,
        frames: 25
      })
      stage.createItem('life', {
        x: 705,
        y: 510,
        width: 30,
        height: 30
      })
      for (let i = 0; i < this.globalObj.NPC_COUNT; i++) {
        const npcItem = stage.createItem('npc', {
          width: 30,
          height: 30,
          color: this.globalObj.COLOR[i],
          location: stage.BaseMap,
          coord: { x: 12 + i, y: 14 },
          vector: { x: 12 + i, y: 14 },
          orientation: 3,
          type: 2,
          speed: 1,
          frames: 10,
          timeout: Math.floor(Math.random() * 120)
        })
        stage.NPCs.push(npcItem)
      }
      stage.PLAYER = stage.createItem('player', {
        width: 30,
        height: 30,
        location: stage.BaseMap,
        coord: { x: 13.5, y: 23 },
        orientation: 2,
        type: 1,
        speed: 2,
        frames: 10
      })
      this.stages.push(stage)
    })
  }
  initEndStage() {
    const stage = new SplashStage({
      index: this.stages.length
    })
    stage.createItem('over', {
      x: this.WIDTH / 2,
      y: this.HEIGHT * .35
    })
    stage.createItem('final_score', {
      x: this.WIDTH / 2,
      y: this.HEIGHT * .5
    })
    this.stages.push(stage)
  }
  setStage(index: number) {
    this.currentIndex = index
    this.stages[index].reset()
  }
  nextStage() {
    if (this.currentIndex < this.stages.length - 1) {
      this.setStage(++this.currentIndex)
    } else {
      throw new Error('unfound new stage.')
    }
  }
  startAnimate() {
    const stage = this.stages[this.currentIndex]
    this.drawCanvas()
    this.currentFrame++
    if (stage.timeout) {
      stage.timeout--
    }
    const result = stage.update(this.globalObj)
    if (result !== false) {
      if (result) {
        this.nextStage()
      }
      stage.maps.forEach((map: Map) => {
        if (!(this.currentFrame % map.frames)) {
          map.times = this.currentFrame / map.frames
        }
        if (map.cache) {
          if (!map.imageData) {
            this.$context.save()
            map.draw(this.$context, this.globalObj)
            map.imageData = this.$context.getImageData(0, 0, this.WIDTH, this.HEIGHT)
            this.$context.restore()
          } else {
            this.$context.putImageData(map.imageData, 0, 0)
          }
        } else {
          map.draw(this.$context, this.globalObj)
        }
      })
      stage.items.forEach((item: Item) => {
        if (!(this.currentFrame % item.frames)) {
          item.times = this.currentFrame / item.frames
        }
        if (stage.status === 1 && item.status !== 2) {
          if (item.location) {
            item.coord = item.location.position2coord(item.x, item.y)
          }
          if (item.timeout) {
            item.timeout--
          }
          item.update(this.globalObj)
        }
        item.draw(this.$context, this.globalObj)
      })
    } else {
      this.gameOver()
    }
    this.handler = requestAnimationFrame(this.startAnimate)
  }
  drawCanvas() {
    this.$context.clearRect(0, 0, this.WIDTH, this.HEIGHT)
    this.$context.fillStyle = '#000000'
    this.$context.fillRect(0, 0, this.WIDTH, this.HEIGHT)
  }
  stopAnimate() {
    if (this.handler) { cancelAnimationFrame(this.handler) }
  }
  gameOver() {
    this.setStage(this.stages.length - 1)
    this.stopAnimate()
  }
}
</script>

<style scoped lang="scss">
.pac-man {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  z-index: 10;
  background: #14517a;
  font-size: 30px;
  color: #fff;
}
</style>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
canvas{
  display:block;
  background: #000;
}
</style>
