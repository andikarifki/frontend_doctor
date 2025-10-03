<template>
  <div id="app">
    <header class="app-header">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/dashboard">Dashboard</router-link> |
        <router-link to="/login">Login</router-link>
      </nav>
    </header>

    <main class="app-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>&copy; 2025 Aplikasi Vue Sanctum</p>
    </footer>
  </div>
</template>

<script>
// Anda bisa menempatkan logika global, seperti status otentikasi, di sini
export default {
  name: 'App',
  // Logika lain...
};
</script>

<style>
/* Style dasar untuk tampilan */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.app-header {
  padding: 20px;
  background: #3490dc;
}

.app-header a {
  font-weight: bold;
  color: #fff;
  margin: 0 10px;
  text-decoration: none;
}

.app-content {
  padding: 40px 20px;
}
</style>