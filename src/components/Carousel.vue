<template lang="pug">
#swiper.swiper
  .swiper-wrapper(:style="wrapperStyle" ref="slideWrapper" @transitionend="carousel.transitionEnd")
    .swiper-slide(v-for="item in options.data" :key="item" :style="slideStyle") {{ item }}
  .swiper-btn.swiper-btn-prev(@click="carousel.slideTo(activatedIndex - 1)") L
  .swiper-btn.swiper-btn-next(@click="carousel.slideTo(activatedIndex + 1)") R
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref
} from '@vue/runtime-core'

interface ICarousel {
  index: number
  translate3dX: number
  slideTransform: string
  slideTransitionDuration: string
  slideTo(targetIndex: number): void
  init(slideQuantities: number, slideWidth: number): void
  transitionEnd(): void
}

class Carousel implements ICarousel {
  public index: number = 0
  // public slideTransform: string = 'translate3d(0, 0, 0)'
  private _transitioning: boolean = false
  private _allowTransition: boolean = false
  private _slideWidth: number = 0
  private _slideQuantities: number = 0
  private _isExceedLimit: boolean = false

  constructor(
    private _slidesGap: number = 10,
    private _infinite: boolean = false
  ) {}

  public get translate3dX() {
    return -this.index * (this._slideWidth + this._slidesGap)
  }

  public get slideTransform() {
    return `translate3d(${this.translate3dX}px, 0, 0)`
  }

  public get slideTransitionDuration() {
    return this._allowTransition ? '300ms' : ''
  }

  public slideTo(targetIndex: number) {
    if (this._transitioning) return
    this._transitioning = true
    this._allowTransition = true

    if (!this._infinite) {
      if (targetIndex < 0) {
        targetIndex = -0.05
        this._isExceedLimit = true
      } else if (targetIndex >= this._slideQuantities) {
        targetIndex = this._slideQuantities - 0.95
        this._isExceedLimit = true
      }
    }

    this.index = targetIndex
  }

  public init(slideQuantities: number, slidesWidth: number) {
    this._slideWidth = slidesWidth
    this._slideQuantities = slideQuantities

    this.index = this._infinite ? 1 : 0
    this._transitioning = false
  }

  public transitionEnd(): void {
    this._transitioning = false
    this._allowTransition = false

    if (this._isExceedLimit) {
      this.slideTo(this.index < 0 ? 0 : this._slideQuantities - 1)
      this._isExceedLimit = false
    } else if (
      this._infinite &&
      (this.index === 0 || this.index === this._slideQuantities - 1)
    ) {
      this._allowTransition = false
      this.index = this.index === 0 ? this._slideQuantities - 2 : 1
      this._transitioning = false
    }
  }
}

export default defineComponent({
  name: 'Carousel',
  props: {
    options: Object
  },
  setup(props) {
    const slideWrapper = ref(document)
    const carousel = reactive<Carousel>(
      new Carousel(props.options?.gap, props.options?.infinite)
    )
    const activatedIndex = computed(() => carousel.index)
    const wrapperStyle = computed(() => {
      return {
        transform: carousel.slideTransform,
        'transition-duration': carousel.slideTransitionDuration
      }
    })

    const slideStyle = computed(() => ({
      'margin-right': `${props.options?.gap}px` || '0'
    }))

    onMounted(() => {
      let slideQuantities = slideWrapper.value.children.length
      const firstChild = slideWrapper.value.children[0]

      if (props.options?.infinite) {
        slideWrapper.value.appendChild(firstChild.cloneNode(true))
        slideWrapper.value.insertBefore(
          slideWrapper.value.children[slideQuantities - 1].cloneNode(true),
          firstChild
        )
        slideQuantities += 2
      }

      carousel.init(slideQuantities, firstChild.clientWidth)
    })

    return {
      carousel,
      activatedIndex,
      slideStyle,
      slideWrapper,
      wrapperStyle
    }
  }
})
</script>

<style lang="scss">
#swiper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  overflow: hidden;
  background-color: #eee;
}

.swiper {
  &-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    transition-property: transform;
  }

  &-slide {
    flex: 1 0 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: darkslateblue;
    background-color: #ccc;
  }

  &-btn {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    color: #fff;
    background-color: #333;
    user-select: none;

    &-prev {
      left: 0;
    }

    &-next {
      right: 0;
    }
  }
}
</style>
