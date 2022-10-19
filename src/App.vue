<template>
  <el-container>
    <el-header>
      <NavBar/>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>

</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  components: {NavBar},
  created() {
    document.title = 'SPIDER-X'
  },
  methods: {}
}

</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


.message-botton {
  --el-button-text-color: var(--el-color-white) !important;
  --el-button-bg-color: var(--el-color-success) !important;
  --el-button-border-color: var(--el-color-success) !important;
  --el-button-outline-color: var(--el-color-success-light-3) !important;
  --el-button-active-color: var(--el-color-success-dark-2) !important;
  --el-button-hover-text-color: var(--el-color-white) !important;
  --el-button-hover-link-text-color: var(--el-color-success-light-5) !important;
  --el-button-hover-bg-color: var(--el-color-success-light-3) !important;
  --el-button-hover-border-color: var(--el-color-success-light-3) !important;
  --el-button-active-bg-color: var(--el-color-success-dark-2) !important;
  --el-button-active-border-color: var(--el-color-success-dark-2) !important;
  --el-button-disabled-text-color: var(--el-color-white) !important;
  --el-button-disabled-bg-color: var(--el-color-success-light-5) !important;
  --el-button-disabled-border-color: var(--el-color-success-light-5) !important;
}

.message-botton-error {
  --el-button-text-color: var(--el-color-white) !important;
  --el-button-bg-color: var(--el-color-error) !important;
  --el-button-border-color: var(--el-color-error) !important;
  --el-button-outline-color: var(--el-color-error-light-3) !important;
  --el-button-active-color: var(--el-color-error-dark-2) !important;
  --el-button-hover-text-color: var(--el-color-white) !important;
  --el-button-hover-link-text-color: var(--el-color-error-light-5) !important;
  --el-button-hover-bg-color: var(--el-color-error-light-3) !important;
  --el-button-hover-border-color: var(--el-color-error-light-3) !important;
  --el-button-active-bg-color: var(--el-color-error-dark-2) !important;
  --el-button-active-border-color: var(--el-color-error-dark-2) !important;
  --el-button-disabled-text-color: var(--el-color-white) !important;
  --el-button-disabled-bg-color: var(--el-color-error-light-5) !important;
  --el-button-disabled-border-color: var(--el-color-error-light-5) !important;
}

.message-botton-cancel {
  color: var(--el-button-text-color) !important;
  background-color: var(--el-button-bg-color) !important;
  border-color: var(--el-button-border-color) !important;
}

</style>
