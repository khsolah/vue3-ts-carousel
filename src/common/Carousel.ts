export interface ICarousel {
  readonly activatedIndex: number
  readonly translate3dX: number
  readonly transitionDuration: string
  infinite: boolean
  init(slideWidth: number, slideGap: number, slideQuantities: number): void
  slideTo(targetIndex: number): void
  transitionEnd(): void
}

export class Carousel implements ICarousel {
  private _index = 0
  private _slideWidth: number = 0
  private _slideGap: number = 0
  private _slideQuantities: number = 0
  private _allowTransition: boolean = false
  private _transitionActivated: boolean = false
  private _exceedLimit: boolean = false

  /** constructor 
   * @param {string} transitionDuration default: 300ms
   * @param {boolean} infinite infinite loop. default: false
  */
  constructor(public readonly infinite: boolean = false, public transitionDuration: string = '300ms') {
    console.log(infinite)
    if (infinite) this._index = 1
  }

  // get 目前的 slide index
  public get activatedIndex() {
    return this._index
  }

  // get 目前 wrapper 的 translate3d 的 x 值
  public get translate3dX(): number {
    return -this._index * (this._slideWidth + this._slideGap)
  }

  public get transitionStyle() {
    return {
      transform: `translate3d(${this.translate3dX}px, 0, 0)`,
      'transition-duration': this._transitionActivated ? this.transitionDuration : '0ms'
    }
  }

  /** 設定初始值
   * @param {number} slideWidth slide 寬度
   * @param {number} slideGap slide 間距
   * @param {number} slideQuantities slide 數量
   */
  public init(slideWidth: number, slideGap: number, slideQuantities: number): void {
    this._slideWidth = slideWidth
    this._slideGap = slideGap
    this._slideQuantities = slideQuantities
    console.log('after init', this)
  }

  /**slide to target index slide
   * @param {number} targetIndex target index
   */
  public slideTo(targetIndex: number): void {
    if (this._transitionActivated) return
    this._transitionActivated = true

    if (!this.infinite) {
      console.log(targetIndex < 0
        ? -.05
        : targetIndex >= this._slideQuantities
          ? this._slideQuantities - .9
          : targetIndex)
      targetIndex = targetIndex < 0
        ? -.1
        : targetIndex >= this._slideQuantities
          ? this._slideQuantities - .95
          : targetIndex
    }

    this._index = targetIndex
  }

  /** transitionEnd event */
  public transitionEnd(): void {
    this._transitionActivated = false

    console.log('transitionend')
    if (this.infinite) {
      this._index = this._index === 0
        ? this._slideQuantities - 2
        : this._index  === this._slideQuantities - 1
          ? 1
          : this._index
    } else {
      if (this._index < 0) this.slideTo(0)
      else if (this._index > this._slideQuantities - 1) this.slideTo(this._slideQuantities - 1)
    }
  }
}
