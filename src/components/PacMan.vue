<template>
  <div class="pac-man">
    <canvas id="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Constant from '../Helpers/Constant'
import Utils from '../Helpers/Utils'
import Stage from './Stage'
import Item from './Item'


const WIDTH = 960
const HEIGHT = 640


@Component
export default class PacMan extends Vue {
  $canvas: any
  $context: any
  width: number = Constant.CANVAS_WIDTH
  height: number = Constant.CANVAS_HEIGHT
  times: number = 0
  frames: number = 3
  currentFrame: number = 0
  hander: any = null
  stage: Stage | null = null
  maps: any = []
  items: Item[] = []
  mounted() {
    this.initCanvas()
    this.animate()
  }
  initCanvas() {
    this.$canvas = Utils.getCanvasElementById('canvas')
    this.$canvas.width = this.width
    this.$canvas.height = this.height
    this.$context = Utils.getCanvasRenderingContext2D(this.$canvas)
  }
  animate() {
    this.currentFrame++
    if(!(this.currentFrame % this.frames)){
      this.times = this.currentFrame / this.frames
      this.drawSplash()
      this.drawLogo()
      this.drawName()
    }
    this.hander = requestAnimationFrame(this.animate)
  }
  drawSplash() {
    this.$context.clearRect(0, 0, this.width, this.height)
    this.$context.fillStyle = '#000000'
    this.$context.fillRect(0, 0, this.width, this.height)
  }
  drawLogo() {
    const x = this.width / 2
    const y = this.height * .45
    const width = 100
    const height = 100
    const t = Math.abs(5 - this.times % 10)
    this.$context.fillStyle = '#FFE600'
    this.$context.beginPath()
    this.$context.arc(x, y, width/2, t*.04*Math.PI, (2-t*.04)*Math.PI, false)
    this.$context.lineTo(x, y)
    this.$context.closePath()
    this.$context.fill()
    this.$context.fillStyle = '#000'
    this.$context.beginPath()
    this.$context.arc(x+5, y-27, 7, 0, 2*Math.PI, false)
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
    this.$context.fillText('Pac-Man', x, y)
  }
}
</script>

<style scoped lang="scss">
.pac-man {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
