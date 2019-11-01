import { GlobalEnv, Coord, Vector } from '../helpers/Interfaces'
import { BaseMap } from './Map'

export class Item {
  _params: {}
  _id: number = 0
  _stage: any = null
  x: number = 0				           	                                    // 位置坐标:横坐标
  y: number = 0					                                              // 位置坐标:纵坐标
  width: number = 20				                                          // 宽
  height: number = 20				                                          // 高
  type: number = 0					                                          // 对象类型,0表示普通对象(不与地图绑定),1表示玩家控制对象,2表示程序控制对象
  color: string = '#F00'			                                        // 标识颜色
  status: number = 1			       	                                    // 对象状态,0表示未激活/结束,1表示正常,2表示暂停,3表示临时,4表示异常
  orientation: number = 0			                                        // 当前定位方向,0表示右,1表示下,2表示左,3表示上
  speed: number = 0				                                            // 移动速度
  // 地图相关
  location!: BaseMap       			                                      // 定位地图,Map对象
  coord!: Coord		       		                                          // 如果对象与地图绑定,需设置地图坐标;若不绑定,则设置位置坐标
  vector!: Vector	       		                                          // 目标坐标
  path!: Vector[]			       	                                        // NPC自动行走的路径
  // 布局相关
  frames: number = 1				                                          // 速度等级,内部计算器times多少帧变化一次
  times: number = 0				                                            // 刷新画布计数(用于循环动画状态判断)
  timeout: number = 0				                                          // 倒计时(用于过程动画状态判断)
  control: any = {}				                                            // 控制缓存,到达定位点时处理
  constructor(params: {} = {}) {
    this._params = params
    this._id = 0                                                      // 标志符
    this._stage = null                                                // 与所属布景绑定
    Object.assign(this, this._params)
  }
  update: (globalObj: GlobalEnv) => void = () => { }                  // 更新参数信息
  draw: (context: any, globalObj: GlobalEnv) => void = () => { }		  // 绘制
}

export class LogoItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any) => {
      const t = Math.abs(5 - this.times % 10)
      context.fillStyle = '#FFE600'
      context.beginPath()
      context.arc(this.x, this.y, this.width / 2, t * .04 * Math.PI, (2 - t * .04) * Math.PI, false)
      context.lineTo(this.x, this.y)
      context.closePath()
      context.fill()
      context.fillStyle = '#000'
      context.beginPath()
      context.arc(this.x + 5, this.y - 27, 7, 0, 2 * Math.PI, false)
      context.closePath()
      context.fill()
    }
  }
}

export class NameItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any) => {
      context.font = 'bold 42px Helvetica'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = '#FFF'
      context.fillText('Pac Man', this.x, this.y)
    }
  }
}

export class ScoreLevelItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any, globalObj: GlobalEnv) => {
      context.font = 'bold 26px Helvetica'
      context.textAlign = 'left'
      context.textBaseline = 'bottom'
      context.fillStyle = '#C33'
      context.fillText('SCORE', this.x, this.y)
      context.font = '26px Helvetica'
      context.textAlign = 'left'
      context.textBaseline = 'top'
      context.fillStyle = '#FFF'
      context.fillText(globalObj.SCORE.toString(), this.x + 12, this.y)
      context.font = 'bold 26px Helvetica'
      context.textAlign = 'left'
      context.textBaseline = 'bottom'
      context.fillStyle = '#C33'
      context.fillText('LEVEL', this.x, this.y + 72)
      context.font = '26px Helvetica'
      context.textAlign = 'left'
      context.textBaseline = 'top'
      context.fillStyle = '#FFF'
      context.fillText((globalObj.LEVEL + 1).toString(), this.x + 12, this.y + 72)
    }
  }
}

export class StatusItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any) => {
      context.font = '24px Helvetica'
      context.textAlign = 'left'
      context.textBaseline = 'center'
      context.fillStyle = '#FFF'
      context.fillText('PAUSE', this.x, this.y)
    }
  }
}

export class LifeItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any, globalObj: GlobalEnv) => {
      for (let i = 0; i < globalObj.LIFE - 1; i++) {
        const shiftX = this.x + 40 * i
        context.fillStyle = '#FFE600'
        context.beginPath()
        context.arc(shiftX, this.y, this.width / 2, 0.15 * Math.PI, -0.15 * Math.PI, false)
        context.lineTo(shiftX, this.y)
        context.closePath()
        context.fill()
      }
      context.font = '26px Helvetica'
      context.textAlign = 'left'
      context.textBaseline = 'bottom'
      context.fillStyle = '#FFF'
      context.fillText('X ' + (globalObj.LIFE - 1), this.x - 15, this.y + 56)
    }
  }
}

export class PlayerItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any) => {
      context.fillStyle = '#FFE600'
      context.beginPath()
      if (this.times % 2) {
        context.arc(this.x, this.y, this.width / 2, (0.5 * this.orientation + 0.20) * Math.PI, (0.5 * this.orientation - 0.20) * Math.PI, false)
      } else {
        context.arc(this.x, this.y, this.width / 2, (0.5 * this.orientation + 0.01) * Math.PI, (0.5 * this.orientation - 0.01) * Math.PI, false)
      }
      context.lineTo(this.x, this.y)
      context.closePath()
      context.fill()
    }
    this.update = (globalObj: GlobalEnv) => {
      if (!this.coord.offset) {
        if (this.control.orientation !== 'undefined') {
          if (!globalObj.BaseMap.get(this.coord.x + globalObj.COS[this.control.orientation], this.coord.y + globalObj.SIN[this.control.orientation])) {
            this.orientation = this.control.orientation
          }
        }
        this.control = {}
        const value = globalObj.BaseMap.get(this.coord.x + globalObj.COS[this.orientation], this.coord.y + globalObj.SIN[this.orientation])
        if (value === 0) {
          this.x += this.speed * globalObj.COS[this.orientation]
          this.y += this.speed * globalObj.SIN[this.orientation]
        } else if (value < 0) {
          this.x -= globalObj.BaseMap.size * (globalObj.BaseMap.xLength - 1) * globalObj.COS[this.orientation]
          this.y -= globalObj.BaseMap.size * (globalObj.BaseMap.yLength - 1) * globalObj.SIN[this.orientation]
        }
      } else {
        if (!globalObj.BeanMap.get(this.coord.x, this.coord.y)) {
          // 吃豆
          globalObj.SCORE++
          globalObj.BeanMap.set(this.coord.x, this.coord.y, 1)
          if (globalObj.CONFIG.goods[this.coord.x + ',' + this.coord.y]) {
            // 吃到能量豆
            globalObj.NPCs.forEach((item) => {
              if (item.status === 1 || item.status === 3) {
                // 如果NPC为正常状态，则置为临时状态
                item.timeout = 450
                item.status = 3
              }
            })
          }
        }
        this.x += this.speed * globalObj.COS[this.orientation]
        this.y += this.speed * globalObj.SIN[this.orientation]
      }
    }
  }
}

export class NpcItem extends Item {
  constructor(options: {}) {
    super(options)
    this.draw = (context: any, globalObj: GlobalEnv) => {
      let isSick = false
      // Draw Body
      context.fillStyle = this.color
      context.beginPath()
      context.arc(this.x, this.y, this.width / 2, 0, Math.PI, true)
      switch (this.times % 2) {
        case 0:
          context.lineTo(this.x - this.width * .5, this.y + this.height * .4)
          context.quadraticCurveTo(this.x - this.width * .4, this.y + this.height * .5, this.x - this.width * .2, this.y + this.height * .3)
          context.quadraticCurveTo(this.x, this.y + this.height * .5, this.x + this.width * .2, this.y + this.height * .3)
          context.quadraticCurveTo(this.x + this.width * .4, this.y + this.height * .5, this.x + this.width * .5, this.y + this.height * .4)
          break
        case 1:
          context.lineTo(this.x - this.width * .5, this.y + this.height * .3)
          context.quadraticCurveTo(this.x - this.width * .25, this.y + this.height * .5, this.x, this.y + this.height * .3)
          context.quadraticCurveTo(this.x - this.width * .25, this.y + this.height * .5, this.x + this.width * .5, this.y + this.height * .3)
          break
      }
      context.fill()
      context.closePath()
      context.fillStyle = '#FFF'
      if (isSick) {
        // Draw Eyeball
        context.beginPath()
        context.arc(this.x - this.width * .15, this.y - this.height * .21, this.width * .08, 0, 2 * Math.PI, false)
        context.arc(this.x + this.width * .15, this.y - this.height * .21, this.width * .08, 0, 2 * Math.PI, false)
        context.fill()
        context.closePath()
      } else {
        // Draw Eyeball
        context.beginPath()
        context.arc(this.x - this.width * .15, this.y - this.height * .21, this.width * .12, 0, 2 * Math.PI, false)
        context.arc(this.x + this.width * .15, this.y - this.height * .21, this.width * .12, 0, 2 * Math.PI, false)
        context.fill()
        context.closePath()
        // Draw Pupil
        context.fillStyle = '#000'
        context.beginPath()
        context.arc(
          this.x - this.width * (.15 - .04 * globalObj.COS[this.orientation]),
          this.y - this.height * (.21 - .04 * globalObj.SIN[this.orientation]),
          this.width * .07, 0, 2 * Math.PI, false)
        context.arc(
          this.x + this.width * (.15 + .04 * globalObj.COS[this.orientation]),
          this.y - this.height * (.21 - .04 * globalObj.SIN[this.orientation]),
          this.width * .07, 0, 2 * Math.PI, false)
        context.fill()
        context.closePath()
      }
    }
    this.update = (globalObj: GlobalEnv) => {
      let newMap: any = null
      if (this.status === 3 && !this.timeout) {
        this.status = 1
      }
      // 到达坐标中心时计算
      if (!this.coord.offset) {
        if (this.status === 1) {
          // 定时器
          if (!this.timeout) {
            newMap = JSON.parse(JSON.stringify(globalObj.BaseMap.data).replace(/2/g, '0'))
            globalObj.NPCs.forEach((item) => {
              // NPC将其它所有还处于正常状态的NPC当成一堵墙
              if (item._id !== this._id && item.status === 1) {
                newMap[item.coord.y][item.coord.x] = 1
              }
            })
            this.path = globalObj.BaseMap.finder({
              map: newMap,
              start: this.coord,
              end: globalObj.PLAYER.coord
            })
            if (this.path.length) {
              this.vector = this.path[0]
            }
          }
        } else if (this.status === 3) {
          newMap = JSON.parse(JSON.stringify(globalObj.BaseMap.data).replace(/2/g, '0'))
          globalObj.NPCs.forEach((item) => {
            if (item._id !== this._id) {
              newMap[item.coord.y][item.coord.x] = 1
            }
          })
          this.path = globalObj.BaseMap.finder({
            map: newMap,
            start: globalObj.PLAYER.coord,
            end: this.coord,
            type: 'next'
          })
          if (this.path.length) {
            this.vector = this.path[Math.floor(Math.random() * this.path.length)]
          }
        } else if (this.status === 4) {
          // newMap = JSON.parse(JSON.stringify(globalObj.BaseMap.data).replace(/2/g, 0))
          // this.path = globalObj.BaseMap.finder({
          //   map: newMap,
          //   start: this.coord,
          //   end: this._params.coord
          // })
          // if (this.path.length) {
          //   this.vector = this.path[0]
          // } else {
          //   this.status = 1
          // }
        }
        // 是否转变方向
        if (this.vector.change) {
          this.coord.x = this.vector.x
          this.coord.y = this.vector.y
          const pos = globalObj.BaseMap.coord2position(this.coord.x, this.coord.y)
          this.x = pos.x
          this.y = pos.y
        }
        // 方向判定
        if (this.vector.x > this.coord.x) {
          this.orientation = 0
        } else if (this.vector.x < this.coord.x) {
          this.orientation = 2
        } else if (this.vector.y > this.coord.y) {
          this.orientation = 1
        } else if (this.vector.y < this.coord.y) {
          this.orientation = 3
        }
      }
      this.x += this.speed * globalObj.COS[this.orientation]
      this.y += this.speed * globalObj.SIN[this.orientation]
    }
  }
}
