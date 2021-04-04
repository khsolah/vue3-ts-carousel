<template lang="pug">
Carousel(:options="carouselOptions")/
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Carousel from './components/Carousel.vue'

export default defineComponent({
  name: 'App',
  setup() {
    const carouselOptions = {
      gap: 10,
      infinite: true,
      // data: ['First', 'Second', 'Third', 'Fourth', 'Fifth']
      data: ['First']
    }

    return {
      carouselOptions
    }
  },
  components: {
    Carousel
  }
})
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
