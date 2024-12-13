<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <router-link to="/" class="home-link">Go to Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 8rem;
  margin: 0;
  color: var(--color-primary, #42b983);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

h2 {
  font-size: 3.5rem;
  margin: 1.5rem 0;
  color: var(--color-primary, #42b983);
  font-weight: 800;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
}

h2::after {
  content: "Page Not Found";
  position: absolute;
  left: 0;
  right: 0;
  z-index: -1;
  color: var(--color-text, #2c3e50);
  text-shadow: none;
  opacity: 0.1;
  transform: translateY(3px);
}

p {
  font-size: 1.2rem;
  color: var(--color-text-light, #666);
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.5;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary, #42b983);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.home-link:hover {
  background-color: var(--color-primary-dark, #3aa876);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (prefers-color-scheme: dark) {
  h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
  }
  
  h2 {
    color: #fff;
    text-shadow: 
      0 0 10px var(--color-primary, #42b983),
      0 0 20px var(--color-primary, #42b983),
      0 0 30px var(--color-primary, #42b983);
  }

  h2::after {
    color: var(--color-text-dark, #e0e0e0);
    opacity: 0.15;
  }
  
  p {
    color: var(--color-text-light-dark, #bbb);
  }
  
  .home-link {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .home-link:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>
