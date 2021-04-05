<template lang="pug">
Carousel(:options="carouselOptions" class="carousel-container")
  CarouselSlide(v-for="item in carouselData" :key="item" class="carousel-item") {{ item }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Carousel from './components/Carousel.vue'
import CarouselSlide from './components/CarouselSlide.vue'

export default defineComponent({
  name: 'App',
  setup() {
    const carouselOptions = {
      infinite: true
    }

    const carouselData = ['First-slide', 'Second-slide', 'Third-slide', 'Fourth-slide', 'Fifth-slide']

    return {
      carouselOptions,
      carouselData
    }
  },
  components: {
    Carousel,
    CarouselSlide
  }
})
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.carousel {
  &-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
  }

  &-item {
    background-color: #eee;
  }
}
</style>
