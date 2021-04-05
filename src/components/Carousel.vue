<template lang="pug">
.swiper(ref="swiper")
  .swiper-wrapper(ref="swiperWrapper" :style="carousel.transitionStyle" @transitionend="carousel.transitionEnd")
    slot(name="default")
  .swiper-btn.swiper-btn-prev(@click="carousel.slideTo(carousel.activatedIndex - 1)") L
  .swiper-btn.swiper-btn-next(@click="carousel.slideTo(carousel.activatedIndex + 1)") R
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Carousel } from '@/utility/Carousel'
export default defineComponent({
  name: 'Carousel',
  props: {
    options: Object
  },
  setup(props) {
    const carousel = reactive<Carousel>(new Carousel(props.options?.infinite))
    const swiperWrapper = ref<Document | null>(null)
    console.log(swiperWrapper)

    onMounted(() => {
      if (!swiperWrapper.value) return
      const children = swiperWrapper.value.children
      const childrenLength = children.length
      if (props.options?.infinite) {
        swiperWrapper.value.append(children[0].cloneNode(true))
        swiperWrapper.value.insertBefore(
          children[children.length - 2].cloneNode(true),
          children[0]
        )
      }

      carousel.init(
        children[0].clientWidth,
        parseInt(window.getComputedStyle(children[0]).marginRight),
        childrenLength + (props.options?.infinite ? 2 : 0)
      )
    })

    return {
      carousel,
      swiperWrapper
    }
  }
})
</script>

<style lang="scss">
.swiper {
  position: relative;
  width: 100%;
  height: auto;
  display: block;
  overflow: hidden;

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
  }

  &-btn {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    padding: 5px 10px;
    color: #fff;
    background-color: darkslateblue;

    &-prev {
      left: 0;
    }

    &-next {
      right: 0;
    }
  }
}
</style>
