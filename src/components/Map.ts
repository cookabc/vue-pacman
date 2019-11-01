import { GlobalEnv } from '../helpers/Interfaces'

export class Map {
  _params: {}
  _id: number = 0
  _stage: any = null
  x: number = 0				           	                                // 地图起点坐标
  y: number = 0					                                          // 地图起点坐标
  size: number = 20       				                                // 地图单元的宽度
  data: any[] = []                                                // 地图数据
  xLength: number = 0				                                      // 二维数组x轴长度
  yLength: number = 0			      	                                // 二维数组y轴长度
  // 布局相关
  frames: number = 1				                                      // 速度等级,内部计算器times多少帧变化一次
  times: number = 0				                                        // 刷新画布计数(用于循环动画状态判断)
  cache: boolean = false		                                      // 是否静态（如静态则设置缓存）
  constructor(params: {} = {}) {
    this._params = params
    this._id = 0                                                  // 标志符
    this._stage = null                                            // 与所属布景绑定
    Object.assign(this, this._params)
  }
  update: () => void = () => { } 	                                // 更新地图数据
  draw: (context: any, globalObj: GlobalEnv) => void = () => { }  // 绘制
  get(px: number, py: number) {
    if (this.data[py] && typeof this.data[py][px] !== 'undefined') {
      return this.data[py][px]
    }
    return -1
  }
  coord2position(cx: number, cy: number) {
    return {
      x: this.x + cx * this.size + this.size / 2,
      y: this.y + cy * this.size + this.size / 2
    }
  }
}

export class WallMap extends Map {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any, globalObj: GlobalEnv) => {
      context.lineWidth = 2
      for (let j = 0; j < this.yLength; j++) {
        for (let i = 0; i < this.xLength; i++) {
          const value = this.get(i, j)
          if (value) {
            const code = [0, 0, 0, 0]
            if (this.get(i + 1, j) && !(this.get(i + 1, j - 1) && this.get(i + 1, j + 1) && this.get(i, j - 1) && this.get(i, j + 1))) {
              code[0] = 1
            }
            if (this.get(i, j + 1) && !(this.get(i - 1, j + 1) && this.get(i + 1, j + 1) && this.get(i - 1, j) && this.get(i + 1, j))) {
              code[1] = 1
            }
            if (this.get(i - 1, j) && !(this.get(i - 1, j - 1) && this.get(i - 1, j + 1) && this.get(i, j - 1) && this.get(i, j + 1))) {
              code[2] = 1
            }
            if (this.get(i, j - 1) && !(this.get(i - 1, j - 1) && this.get(i + 1, j - 1) && this.get(i - 1, j) && this.get(i + 1, j))) {
              code[3] = 1
            }
            if (code.includes(1)) {
              context.strokeStyle = value === 2 ? '#FFF' : globalObj.CONFIG.wall_color
              const pos = this.coord2position(i, j)
              switch (code.join('')) {
                case '1100':
                  context.beginPath()
                  context.arc(pos.x + this.size / 2, pos.y + this.size / 2, this.size / 2, Math.PI, 1.5 * Math.PI, false)
                  context.stroke()
                  context.closePath()
                  break
                case '0110':
                  context.beginPath()
                  context.arc(pos.x - this.size / 2, pos.y + this.size / 2, this.size / 2, 1.5 * Math.PI, 2 * Math.PI, false)
                  context.stroke()
                  context.closePath()
                  break
                case '0011':
                  context.beginPath()
                  context.arc(pos.x - this.size / 2, pos.y - this.size / 2, this.size / 2, 0, .5 * Math.PI, false)
                  context.stroke()
                  context.closePath()
                  break
                case '1001':
                  context.beginPath()
                  context.arc(pos.x + this.size / 2, pos.y - this.size / 2, this.size / 2, .5 * Math.PI, 1 * Math.PI, false)
                  context.stroke()
                  context.closePath()
                  break
                default:
                  const dist = this.size / 2
                  code.forEach((v, index) => {
                    if (v) {
                      context.beginPath()
                      context.moveTo(pos.x, pos.y)
                      context.lineTo(pos.x - globalObj.COS[index] * dist, pos.y - globalObj.SIN[index] * dist)
                      context.stroke()
                      context.closePath()
                    }
                  })
              }
            }
          }
        }
      }
    }
  }
}

export class BeanMap extends Map {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any, globalObj: GlobalEnv) => {
      for (let j = 0; j < this.yLength; j++) {
        for (let i = 0; i < this.xLength; i++) {
          if (!this.get(i, j)) {
            const pos = this.coord2position(i, j)
            context.fillStyle = '#F5F5DC'
            if (globalObj.CONFIG.goods.includes(`${i},${j}`)) {
              context.beginPath()
              context.arc(pos.x, pos.y, 3 + this.times % 2, 0, 2 * Math.PI, true)
              context.fill()
              context.closePath()
            } else {
              context.fillRect(pos.x - 2, pos.y - 2, 4, 4)
            }
          }
        }
      }
    }
  }
}
