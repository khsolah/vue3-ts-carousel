export interface ICarousel {
  readonly activatedIndex: number
  readonly translate3dX: number
  readonly transitionDuration: string
  infinite: boolean
  init(slideWidth: number, slideGap: number, slideQuantities: number): void
  slideTo(targetIndex: number): void
  transitionEnd(): void
  startDragSlide(e: MouseEvent): void
  draggingSlide(e: MouseEvent): void
  endDragSlide(e: MouseEvent): void
}

export class Carousel implements ICarousel {
  private _index = 0
  private _slideWidth: number = 0
  private _slideGap: number = 0
  private _slideQuantities: number = 0
  private _allowTransition: boolean = false
  private _transitionActivated: boolean = false
  private _exceedLimit: boolean = false

  private _downPoint: number = 0
  private _mousePoint: number = 0

  /** constructor
   * @param {string} transitionDuration default: 300ms
   * @param {boolean} infinite infinite loop. default: false
   */
  constructor(
    public readonly infinite: boolean = false,
    public transitionDuration: string = '300ms'
  ) {
    if (infinite) this._index = 1
  }

  // get 目前的 slide index
  public get activatedIndex() {
    return this._index
  }

  // get 目前 wrapper 的 translate3d 的 x 值
  public get translate3dX(): number {
    return (
      -this._index * (this._slideWidth + this._slideGap) -
      this._mouseMoveDistance
    )
  }

  public get transitionStyle() {
    return {
      transform: `translate3d(${this.translate3dX}px, 0, 0)`,
      'transition-duration': this._transitionActivated
        ? this.transitionDuration
        : '0ms'
    }
  }

  private get _mouseMoveDistance() {
    return this._downPoint - this._mousePoint
  }

  /** 設定初始值
   * @param {number} slideWidth slide 寬度
   * @param {number} slideGap slide 間距
   * @param {number} slideQuantities slide 數量
   */
  public init(
    slideWidth: number,
    slideGap: number,
    slideQuantities: number
  ): void {
    this._slideWidth = slideWidth
    this._slideGap = slideGap
    this._slideQuantities = slideQuantities
  }

  /**slide to target index slide
   * @param {number} targetIndex target index
   */
  public slideTo(targetIndex: number): void {
    if (this._transitionActivated) return
    this._transitionActivated = true

    this._downPoint = this._mousePoint = 0

    if (!this.infinite) {
      targetIndex =
        targetIndex < 0
          ? -0.1
          : targetIndex >= this._slideQuantities
          ? this._slideQuantities - 0.95
          : targetIndex
    }

    this._index = targetIndex
  }

  /** transitionEnd event */
  public transitionEnd(): void {
    this._transitionActivated = false

    if (this.infinite) {
      this._index =
        this._index === 0
          ? this._slideQuantities - 2
          : this._index === this._slideQuantities - 1
          ? 1
          : this._index
    } else {
      if (this._index < 0) this.slideTo(0)
      else if (this._index > this._slideQuantities - 1) {
        this.slideTo(this._slideQuantities - 1)
      }
    }
  }

  public startDragSlide(e: MouseEvent) {
    e.preventDefault()
    this._downPoint = this._mousePoint = e.clientX

    document.onmouseup = this.endDragSlide.bind(this)
    document.onmousemove = this.draggingSlide.bind(this)
  }
  
  public draggingSlide(e: MouseEvent) {
    this._mousePoint = e.clientX
    return
  }

  public endDragSlide (e: MouseEvent) {
    e.preventDefault()
    document.onmouseup = null
    document.onmousemove = null
    if (this._mouseMoveDistance < -99) this.slideTo(this._index - 1)
    else if (this._mouseMoveDistance > 99) this.slideTo(this._index + 1)
  }
}
