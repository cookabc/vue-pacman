<template>
  <div class="pac-man">
    <canvas id="canvas" class="canvas"></canvas>
    <button class="btn" @click="stopAnimate">Stop</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Constant from './helpers/Constant'
import { GlobalEnv } from './helpers/Interfaces'
import Utils from './helpers/Utils'
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

const WIDTH = 960
const HEIGHT = 640
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
  width: number = Constant.CANVAS_WIDTH
  height: number = Constant.CANVAS_HEIGHT
  logoTimes: number = 0
  logoFrames: number = 3
  beanTimes: number = 0
  beanFrames: number = 8
  npcTimes: number = 0
  npcFrames: number = 10
  currentFrame: number = 0
  handler: number = 0
  stage!: Stage
  items: Item[] = []
  maps: Map[] = []
  logoItem!: LogoItem
  globalObj: GlobalEnv = {
    SCORE: 0,
    LEVEL: 0,
    LIFE: 5,
    COLOR: ['#F00', '#F93', '#0CF', '#F9C'],
    COS: [1, 0, -1, 0],
    SIN: [0, 1, 0, -1],
    CONFIG: MAP_DATA
  }
  SCORE: number = 0
  LEVEL: number = 0
  LIFE: number = 5
  COLOR: string[] = ['#F00', '#F93', '#0CF', '#F9C']
  COS: number[] = [1, 0, -1, 0]
  SIN: number[] = [0, 1, 0, -1]
  mounted() {
    this.initCanvas()
    this.initItems()
    this.initMaps()
    this.animate()
  }
  initCanvas() {
    this.$canvas = Utils.getCanvasElementById('canvas')
    this.$canvas.width = this.width
    this.$canvas.height = this.height
    this.$context = Utils.getCanvasRenderingContext2D(this.$canvas)
  }
  initItems() {
    this.items.push(new LogoItem({
      x: this.width / 2,
			y: this.height * .45,
			width: 100,
			height: 100,
      frames: 3
    }))
    this.items.push(new NameItem({
      x: this.width / 2,
			y: this.height * .6
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
    this.$context.clearRect(0, 0, this.width, this.height)
    this.$context.fillStyle = '#000000'
    this.$context.fillRect(0, 0, this.width, this.height)
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
  drawLogo() {
    const x = this.width / 2
    const y = this.height * .45
    const width = 100
    const height = 100
    const frames = 3
    let times = 0
    if (!(this.currentFrame % frames)) {
      times = this.currentFrame / frames
    }
    const t = Math.abs(5 - times % 10)
    this.$context.fillStyle = '#FFE600'
    this.$context.beginPath()
    this.$context.arc(x, y, width / 2, t * .04 * Math.PI, (2 - t * .04) * Math.PI, false)
    this.$context.lineTo(x, y)
    this.$context.closePath()
    this.$context.fill()
    this.$context.fillStyle = '#000'
    this.$context.beginPath()
    this.$context.arc(x + 5, y - 27, 7, 0, 2 * Math.PI, false)
    this.$context.closePath()
    this.$context.fill()
  }
  drawName() {
    const x = this.width / 2
    const y = this.height * .6
    const frames = 1
    const times = 0
    this.$context.font = 'bold 42px Helvetica'
    this.$context.textAlign = 'center'
    this.$context.textBaseline = 'middle'
    this.$context.fillStyle = '#FFF'
    this.$context.fillText('Pac Man', x, y)
  }
  drawMap() {
    const x = 60
    const y = 10
    const data = MAP_DATA.map
    const xLength = data[0].length
    const yLength = data.length
    const size = 20
    const cache = true
    const get = (px: number, py: number) => {
      if (data[py] && typeof data[py][px] !== 'undefined') {
        return data[py][px]
      }
      return -1
    }
    const coord2position = (cx: number, cy: number) => {
      return {
        x: x + cx * size + size / 2,
        y: y + cy * size + size / 2
      }
    }
    this.$context.lineWidth = 2
    for (let j = 0; j < yLength; j++) {
      for (let i = 0; i < xLength; i++) {
        const value = get(i, j)
        if (value) {
          const code = [0, 0, 0, 0]
          if (get(i + 1, j) && !(get(i + 1, j - 1) && get(i + 1, j + 1) && get(i, j - 1) && get(i, j + 1))) {
            code[0] = 1
          }
          if (get(i, j + 1) && !(get(i - 1, j + 1) && get(i + 1, j + 1) && get(i - 1, j) && get(i + 1, j))) {
            code[1] = 1
          }
          if (get(i - 1, j) && !(get(i - 1, j - 1) && get(i - 1, j + 1) && get(i, j - 1) && get(i, j + 1))) {
            code[2] = 1
          }
          if (get(i, j - 1) && !(get(i - 1, j - 1) && get(i + 1, j - 1) && get(i - 1, j) && get(i + 1, j))) {
            code[3] = 1
          }
          if (code.includes(1)) {
            this.$context.strokeStyle = value === 2 ? '#FFF' : Constant.MAP_DATA[0].wall_color
            const pos = coord2position(i, j)
            switch (code.join('')) {
              case '1100':
                this.$context.beginPath()
                this.$context.arc(pos.x + size / 2, pos.y + size / 2, size / 2, Math.PI, 1.5 * Math.PI, false)
                this.$context.stroke()
                this.$context.closePath()
                break
              case '0110':
                this.$context.beginPath()
                this.$context.arc(pos.x - size / 2, pos.y + size / 2, size / 2, 1.5 * Math.PI, 2 * Math.PI, false)
                this.$context.stroke()
                this.$context.closePath()
                break
              case '0011':
                this.$context.beginPath()
                this.$context.arc(pos.x - size / 2, pos.y - size / 2, size / 2, 0, .5 * Math.PI, false)
                this.$context.stroke()
                this.$context.closePath()
                break
              case '1001':
                this.$context.beginPath()
                this.$context.arc(pos.x + size / 2, pos.y - size / 2, size / 2, .5 * Math.PI, 1 * Math.PI, false)
                this.$context.stroke()
                this.$context.closePath()
                break
              default:
                const dist = size / 2
                code.forEach((v, index) => {
                  if (v) {
                    this.$context.beginPath()
                    this.$context.moveTo(pos.x, pos.y)
                    this.$context.lineTo(pos.x - this.COS[index] * dist, pos.y - this.SIN[index] * dist)
                    this.$context.stroke()
                    this.$context.closePath()
                  }
                })
            }
          }
        }
      }
    }
  }
  drawBean() {
    const x = 60
    const y = 10
    const data = MAP_DATA.map
    const xLength = data[0].length
    const yLength = data.length
    const beans: string[] = MAP_DATA.goods
    const size = 20
    const times = 0
    const frames = 8
    const get = (px: number, py: number) => {
      if (data[py] && typeof data[py][px] !== 'undefined') {
        return data[py][px]
      }
      return -1
    }
    const coord2position = (cx: number, cy: number) => {
      return {
        x: x + cx * size + size / 2,
        y: y + cy * size + size / 2
      }
    }
    for (let j = 0; j < yLength; j++) {
      for (let i = 0; i < xLength; i++) {
        if (!get(i, j)) {
          const pos = coord2position(i, j)
          this.$context.fillStyle = '#F5F5DC'
          if (beans.includes(`${i},${j}`)) {
            this.$context.beginPath()
            this.$context.arc(pos.x, pos.y, 3 + this.beanTimes % 2, 0, 2 * Math.PI, true)
            this.$context.fill()
            this.$context.closePath()
          } else {
            this.$context.fillRect(pos.x - 2, pos.y - 2, 4, 4)
          }
        }
      }
    }
  }
  drawScoreLevel() {
    const x = 690
    const y = 80
    const frames = 1
    const times = 0
    this.$context.font = 'bold 26px Helvetica'
    this.$context.textAlign = 'left'
    this.$context.textBaseline = 'bottom'
    this.$context.fillStyle = '#C33'
    this.$context.fillText('SCORE', x, y)
    this.$context.font = '26px Helvetica'
    this.$context.textAlign = 'left'
    this.$context.textBaseline = 'top'
    this.$context.fillStyle = '#FFF'
    this.$context.fillText(this.SCORE.toString(), x + 12, y)
    this.$context.font = 'bold 26px Helvetica'
    this.$context.textAlign = 'left'
    this.$context.textBaseline = 'bottom'
    this.$context.fillStyle = '#C33'
    this.$context.fillText('LEVEL', x, y + 72)
    this.$context.font = '26px Helvetica'
    this.$context.textAlign = 'left'
    this.$context.textBaseline = 'top'
    this.$context.fillStyle = '#FFF'
    this.$context.fillText((this.LEVEL + 1).toString(), x + 12, y + 72)
  }
  drawLife() {
    const x = 705
    const y = 510
    const width = 30
    const height = 30
    const frames = 1
    const times = 0
    for (let i = 0; i < this.LIFE - 1; i++) {
      const shiftX = x + 40 * i
      this.$context.fillStyle = '#FFE600'
      this.$context.beginPath()
      this.$context.arc(shiftX, y, width / 2, 0.15 * Math.PI, -0.15 * Math.PI, false)
      this.$context.lineTo(shiftX, y)
      this.$context.closePath()
      this.$context.fill()
    }
    this.$context.font = '26px Helvetica'
    this.$context.textAlign = 'left'
    this.$context.textBaseline = 'bottom'
    this.$context.fillStyle = '#FFF'
    this.$context.fillText('X ' + (this.LIFE - 1), x - 15, y + 56)
  }
  drawPlayer() {
    const x = 200
    const y = 200
    const width = 30
    const height = 30
    const type = 1
    const location = 'map'
    const coord = { x: 13.5, y: 23 }
    const orientation = 0
    const speed = 2
    const frames = 10
    const times = 0
    this.$context.fillStyle = '#FFE600'
    this.$context.beginPath()
    if (this.npcTimes % 2) {
      this.$context.arc(x, y, width / 2, (0.5 * orientation + 0.20) * Math.PI, (0.5 *  orientation - 0.20) * Math.PI, false)
    } else {
      this.$context.arc(x, y, width / 2, (0.5 * orientation + 0.01) * Math.PI, (0.5 *  orientation - 0.01) * Math.PI, false)
    }
    this.$context.lineTo(x, y)
    this.$context.closePath()
    this.$context.fill()
  }
  drawNPC(index: number) {
    const x = 250 + index * 50
    const y = 200
    const width = 30
    const height = 30
    const color = this.COLOR[index]
    const type = 2
    const location = 'map'
    const coord = { x: 12 + index, y: 14 }
    const vector = { x: 12 + index, y: 14 }
    const orientation = 0
    const speed = 1
    const frames = 10
    const times = 0
    // Draw Body
    this.$context.fillStyle = color
    this.$context.beginPath()
    this.$context.arc(x, y, width / 2, 0, Math.PI, true)
    switch (this.npcTimes % 2) {
      case 0:
        this.$context.lineTo(x - width * .5, y + height * .4)
        this.$context.quadraticCurveTo(x - width * .4, y + height * .5, x - width * .2, y + height * .3)
        this.$context.quadraticCurveTo(x, y + height * .5, x + width * .2, y + height * .3)
        this.$context.quadraticCurveTo(x + width * .4, y + height * .5, x + width * .5, y + height * .4)
        break
      case 1:
        this.$context.lineTo(x - width * .5, y + height * .3)
        this.$context.quadraticCurveTo(x - width * .25, y + height * .5, x, y + height * .3)
        this.$context.quadraticCurveTo(x - width * .25, y + height * .5, x + width * .5, y + height * .3)
        break
    }
    this.$context.fill()
    this.$context.closePath()
    // Draw Eyeball
    this.$context.fillStyle = '#FFF'
    this.$context.beginPath()
    this.$context.arc(x - width * .15, y - height * .21, width * .12, 0, 2 * Math.PI, false)
    this.$context.arc(x + width * .15, y - height * .21, width * .12, 0, 2 * Math.PI, false)
    this.$context.fill()
    this.$context.closePath()
    // Draw Pupil
    this.$context.fillStyle = '#000'
    this.$context.beginPath()
    this.$context.arc(x - width * (.15 - .04 * this.COS[orientation]), y - height * (.21 - .04 * this.SIN[orientation]), width * .07, 0, 2 * Math.PI, false)
    this.$context.arc(x + width * (.15 + .04 * this.COS[orientation]), y - height * (.21 - .04 * this.SIN[orientation]), width * .07, 0, 2 * Math.PI, false)
    this.$context.fill()
    this.$context.closePath()
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
