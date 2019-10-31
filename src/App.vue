<template>
  <div class="pac-man">
    <canvas id="canvas" class="canvas"></canvas>
    <button class="btn" @click="stopAnimate">Stop</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Constant from './helpers/Constant'
import Utils from './helpers/Utils'
import Stage from './components/Stage'
import Map from './components/Map'
import Item from './components/Item'

const WIDTH = 960
const HEIGHT = 640

@Component
export default class PacMan extends Vue {
  $canvas!: HTMLCanvasElement
  $context!: CanvasRenderingContext2D
  width: number = Constant.CANVAS_WIDTH
  height: number = Constant.CANVAS_HEIGHT
  times: number = 0
  frames: number = 3
  npcTimes: number = 0
  npcFrames: number = 10
  currentFrame: number = 0
  handler: number = 0
  stage!: Stage
  maps: Map[] = []
  items: Item[] = []
  SCORE: number = 0
  LEVEL: number = 0
  LIFE: number = 5
  COLOR: string[] = ['#F00', '#F93', '#0CF', '#F9C']
  COS: number[] = [1, 0, -1, 0]
  SIN: number[] = [0, 1, 0, -1]
  mounted() {
    this.initCanvas()
    this.drawCanvas()
    this.drawMap()
    this.drawScoreLevel()
    this.drawLife()
    this.animate()
  }
  initCanvas() {
    this.$canvas = Utils.getCanvasElementById('canvas')
    this.$canvas.width = this.width
    this.$canvas.height = this.height
    this.$context = Utils.getCanvasRenderingContext2D(this.$canvas)
  }
  drawCanvas() {
    this.$context.clearRect(0, 0, this.width, this.height)
    this.$context.fillStyle = '#000000'
    this.$context.fillRect(0, 0, this.width, this.height)
    this.$context.beginPath()
    this.$context.rect(610, 580, 10, 10)
    this.$context.stroke()
  }
  stopAnimate() {
    if (this.handler) { cancelAnimationFrame(this.handler) }
  }
  animate() {
    this.currentFrame++
    // Splash
    // if (!(this.currentFrame % this.frames)) {
    //   this.drawLogo()
    //   this.drawName()
    // }
    // Main stage
    if (!(this.currentFrame % this.npcFrames)) {
      this.npcTimes = this.currentFrame / this.npcFrames
      // this.drawPlayer()
      // for (let i = 0; i < 4; i++) {
      //   this.drawNPC(i)
      // }
    }
    this.handler = requestAnimationFrame(this.animate)
  }
  drawLogo() {
    const x = this.width / 2
    const y = this.height * .45
    const width = 100
    const height = 100
    const t = Math.abs(5 - this.times % 10)
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
    this.$context.font = 'bold 42px Helvetica'
    this.$context.textAlign = 'center'
    this.$context.textBaseline = 'middle'
    this.$context.fillStyle = '#FFF'
    this.$context.fillText('Pac Man', x, y)
  }
  drawMap() {
    const x = 60
    const y = 10
    const data = Constant.MAP_DATA[0].map
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
  drawScoreLevel() {
    const x = 690
    const y = 80
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
    const y = 560
    const width = 30
    const height = 30
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
