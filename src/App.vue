<template>
  <div class="pac-man">
    <canvas id="canvas" class="canvas"></canvas>
    <button class="btn" @click="stopAnimate">Stop</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './helpers/Constant'
import { GlobalEnv } from './helpers/Interfaces'
import {
  getCanvasElementById,
  getCanvasRenderingContext2D
} from './helpers/Utils'
import Stage from './components/Stage'
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
import {
  Map,
  WallMap,
  BeanMap
} from './components/Map'

const MAP_DATA = {
  map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  wall_color: '#09f',
  goods: ['1,3', '26,3', '1,23', '26,23']
}

@Component
export default class PacMan extends Vue {
  $canvas!: HTMLCanvasElement
  $context!: CanvasRenderingContext2D
  currentFrame: number = 0
  handler: number = 0
  stage!: Stage
  items: Item[] = []
  maps: Map[] = []
  globalObj: GlobalEnv = {
    WIDTH: CANVAS_WIDTH,
    HEIGHT: CANVAS_HEIGHT,
    COLOR: ['#F00', '#F93', '#0CF', '#F9C'],
    COS: [1, 0, -1, 0],
    SIN: [0, 1, 0, -1],
    CONFIG: MAP_DATA,
    SCORE: 0,
    LEVEL: 0,
    LIFE: 5
  }
  mounted() {
    this.initCanvas()
    this.initItems()
    this.initMaps()
    // this.animate()
  }
  initCanvas() {
    this.$canvas = getCanvasElementById('canvas')
    this.$canvas.width = this.globalObj.WIDTH
    this.$canvas.height = this.globalObj.HEIGHT
    this.$context = getCanvasRenderingContext2D(this.$canvas)
  }
  initItems() {
    this.items.push(new LogoItem({
      x: this.globalObj.WIDTH / 2,
      y: this.globalObj.HEIGHT * .45,
      width: 100,
      height: 100,
      frames: 3
    }))
    this.items.push(new NameItem({
      x: this.globalObj.WIDTH / 2,
      y: this.globalObj.HEIGHT * .6
    }))
    this.items.push(new ScoreLevelItem({
      x: 690,
      y: 80
    }))
    this.items.push(new StatusItem({
      x: 690,
      y: 285,
      frames: 25
    }))
    this.items.push(new LifeItem({
      x: 705,
      y: 510,
      width: 30,
      height: 30
    }))
    for (let i = 0; i < 4; i++) {
      this.items.push(new NpcItem({
        x: 250 + i * 50,
        y: 250,
        width: 30,
        height: 30,
        orientation: 3,
        color: this.globalObj.COLOR[i],
        // location: map,
        coord: { x: 12 + i, y: 14 },
        vector: { x: 12 + i, y: 14 },
        type: 2,
        frames: 10,
        speed: 1,
        timeout: Math.floor(Math.random() * 120)
      }))
    }
    this.items.push(new PlayerItem({
      x: 200,
      y: 200,
      width: 30,
      height: 30,
      type: 1,
      // location: map,
      coord: { x: 13.5, y: 23 },
      orientation: 2,
      speed: 2,
      frames: 10
    }))
  }
  initMaps() {
    this.maps.push(new WallMap({
      x: 60,
      y: 10,
      data: this.globalObj.CONFIG.map,
      yLength: this.globalObj.CONFIG.map.length,
      xLength: this.globalObj.CONFIG.map[0].length,
      cache: true
    }))
    this.maps.push(new BeanMap({
      x: 60,
      y: 10,
      data: this.globalObj.CONFIG.map,
      yLength: this.globalObj.CONFIG.map.length,
      xLength: this.globalObj.CONFIG.map[0].length,
      frames: 8
    }))
  }
  drawCanvas() {
    this.$context.clearRect(0, 0, this.globalObj.WIDTH, this.globalObj.HEIGHT)
    this.$context.fillStyle = '#000000'
    this.$context.fillRect(0, 0, this.globalObj.WIDTH, this.globalObj.HEIGHT)
  }
  stopAnimate() {
    if (this.handler) { cancelAnimationFrame(this.handler) }
  }
  animate() {
    this.drawCanvas()
    this.currentFrame++
    this.items.forEach((item: Item) => {
      if (!(this.currentFrame % item.frames)) {
        item.times = this.currentFrame / item.frames
      }
      item.draw(this.$context, this.globalObj)
    })
    this.maps.forEach((map: Map) => {
      if (!(this.currentFrame % map.frames)) {
        map.times = this.currentFrame / map.frames
      }
      map.draw(this.$context, this.globalObj)
    })
    this.handler = requestAnimationFrame(this.animate)
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
