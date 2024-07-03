<template>
  <div class="flex flex-col h-screen">
    <div class="sticky top-0 z-10">
      <Hero />
    </div>
    <div class="grow overflow-hidden">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Hero from './components/Hero.vue';
</script>
