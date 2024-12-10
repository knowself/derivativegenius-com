<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <router-link to="/" class="breadcrumb-link">Home</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link to="/chatbots" class="breadcrumb-link">Chatbots</router-link>
      </li>
      <li class="breadcrumb-item">
        <span class="breadcrumb-current">{{ currentPage }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'ChatbotBreadcrumb',
  props: {
    currentPage: {
      type: String,
      required: true
    }
  }
}
</script>
