<template lang="pug">
.swiper-slide
  slot(name="default")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CarouselSlide'
})
</script>
