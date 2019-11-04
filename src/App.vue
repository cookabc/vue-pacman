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
  BaseMap,
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
  timeout: number = 0
  globalObj: GlobalEnv = {
    WIDTH: CANVAS_WIDTH,
    HEIGHT: CANVAS_HEIGHT,
    COLOR: ['#F00', '#F93', '#0CF', '#F9C'],
    COS: [1, 0, -1, 0],
    SIN: [0, 1, 0, -1],
    CONFIG: MAP_DATA,
    SCORE: 0,
    LEVEL: 0,
    LIFE: 5,
    PLAYER: null,
    NPCs: [],
    BaseMap: null,
    BeanMap: null,
    STATUS: 2 // 布景状态, 0表示未激活/结束, 1表示正常, 2表示暂停, 3表示临时状态
  }
  mounted() {
    this.initCanvas()
    this.initMaps()
    this.initItems()
    this.bindEvents()
    this.startAnimate()
  }
  initCanvas() {
    this.$canvas = getCanvasElementById('canvas')
    this.$canvas.width = this.globalObj.WIDTH
    this.$canvas.height = this.globalObj.HEIGHT
    this.$context = getCanvasRenderingContext2D(this.$canvas)
  }
  drawCanvas() {
    this.$context.clearRect(0, 0, this.globalObj.WIDTH, this.globalObj.HEIGHT)
    this.$context.fillStyle = '#000000'
    this.$context.fillRect(0, 0, this.globalObj.WIDTH, this.globalObj.HEIGHT)
  }
  resetItems() {
    this.globalObj.STATUS = 1
    this.items.forEach((item) => {
      Object.assign(item, item._params)
      if (item.location) {
        const position = item.location.coord2position(item.coord.x, item.coord.y)
        item.x = position.x
        item.y = position.y
      }
    })
  }
  updateStage() {
    if (this.globalObj.STATUS === 1) {
      this.globalObj.NPCs.forEach((item) => {
        if (this.globalObj.BaseMap
          && !this.globalObj.BaseMap.get(item.coord.x, item.coord.y)
          && !this.globalObj.BaseMap.get(this.globalObj.PLAYER.coord.x, this.globalObj.PLAYER.coord.y)) {
          const dx = item.x - this.globalObj.PLAYER.x
          const dy = item.y - this.globalObj.PLAYER.y
          // 物体检测
          if (dx * dx + dy * dy < 750 && item.status !== 4) {
            if (item.status === 3) {
              item.status = 4
              this.globalObj.SCORE += 10
            } else {
              this.globalObj.STATUS = 3
              // this.globalObj.timeout = 30
            }
          }
        }
      })
    } else if (this.globalObj.STATUS === 3) {
      if (this.globalObj.LIFE > 1) {
        this.globalObj.LIFE--
        this.resetItems()
      } else {
        // this.gameOver()
        return false
      }
    }
    return true
  }
  createMap(type: string, options: any) {
    let map: Map = new Map(options)
    if (type === 'base') { map = new BaseMap(options) }
    if (type === 'bean') { map = new BeanMap(options) }
    map.data = JSON.parse(JSON.stringify(this.globalObj.CONFIG.map))
    map.yLength = this.globalObj.CONFIG.map.length
    map.xLength = this.globalObj.CONFIG.map[0].length
    this.maps.push(map)
    return map
  }
  initMaps() {
    this.globalObj.BaseMap = this.createMap('base', {
      x: 60,
      y: 10,
      cache: true
    })
    this.globalObj.BeanMap = this.createMap('bean', {
      x: 60,
      y: 10,
      frames: 8
    })
  }
  createItem(type: string, options: any) {
    let item: Item = new Item(options)
    if (type === 'npc') { item = new NpcItem(options) }
    if (type === 'player') { item = new PlayerItem(options) }
    if (item.location) {
      const position = item.location.coord2position(item.coord.x, item.coord.y)
      item.x = position.x
      item.y = position.y
    }
    this.items.push(item)
    return item
  }
  initItems() {
    // this.items.push(new LogoItem({
    //   x: this.globalObj.WIDTH / 2,
    //   y: this.globalObj.HEIGHT * .45,
    //   width: 100,
    //   height: 100,
    //   frames: 3
    // }))
    // this.items.push(new NameItem({
    //   x: this.globalObj.WIDTH / 2,
    //   y: this.globalObj.HEIGHT * .6
    // }))
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
    for (let i = 0; i < 1; i++) {
      const npcItem = this.createItem('npc', {
        width: 30,
        height: 30,
        color: this.globalObj.COLOR[i],
        location: this.globalObj.BaseMap,
        coord: { x: 12 + i, y: 14 },
        vector: { x: 12 + i, y: 14 },
        orientation: 3,
        type: 2,
        speed: 1,
        frames: 10,
        timeout: Math.floor(Math.random() * 120)
      })
      this.globalObj.NPCs.push(npcItem)
    }
    this.globalObj.PLAYER = this.createItem('player', {
      width: 30,
      height: 30,
      location: this.globalObj.BaseMap,
      coord: { x: 13.5, y: 23 },
      orientation: 2,
      type: 1,
      speed: 2,
      frames: 10
    })
  }
  bindEvents() {
    window.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 13: // 回车
        case 32: // 空格
          this.globalObj.STATUS = this.globalObj.STATUS === 2 ? 1 : 2
          break
      }
      e.preventDefault()
    })
  }
  startAnimate() {
    this.drawCanvas()
    this.currentFrame++
    if (this.timeout) {
      this.timeout--
    }
    if (this.updateStage() !== false) {
      this.maps.forEach((map: Map) => {
        if (!(this.currentFrame % map.frames)) {
          map.times = this.currentFrame / map.frames
        }
        if (map.cache) {
          if (!map.imageData) {
            this.$context.save()
            map.draw(this.$context, this.globalObj)
            map.imageData = this.$context.getImageData(0, 0, this.globalObj.WIDTH, this.globalObj.HEIGHT)
            this.$context.restore()
          } else {
            this.$context.putImageData(map.imageData, 0, 0)
          }
        } else {
          map.draw(this.$context, this.globalObj)
        }
      })
      this.items.forEach((item: Item) => {
        if (!(this.currentFrame % item.frames)) {
          item.times = this.currentFrame / item.frames
        }
        if (this.globalObj.STATUS === 1 && item.status !== 2) {
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
    }
    this.handler = requestAnimationFrame(this.startAnimate)
  }
  stopAnimate() {
    if (this.handler) { cancelAnimationFrame(this.handler) }
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
