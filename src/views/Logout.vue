<template>
    <div></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  onMounted(() => {
    // Clear all local storage
    localStorage.clear();
    
    // Redirect to login page
    router.push('/login');
  });
  </script>
  