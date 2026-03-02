<script setup lang="ts">
defineOptions({
  name: 'GlobalFooter'
});
</script>

<template>
  <DarkModeContainer class="h-full flex-center">
    <a href="https://xundiesoft.com" target="_blank" rel="noopener noreferrer">
      ©{{ new Date().getFullYear() }} Xundiesoft all rights reserved
    </a>
  </DarkModeContainer>
</template>

<style scoped></style>
