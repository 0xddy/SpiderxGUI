<template>

  <el-menu
      :default-active="active()"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleNavbarSelect">
    <div
        style="padding-left: 26px;padding-right:26px;justify-content: center; align-items:center;display: flex;color: white;font:18px bold">
      SPIDERX
    </div>
    <el-menu-item index="project">规则</el-menu-item>
    <el-sub-menu index="2">
      <template #title>存储仓库</template>
      <el-menu-item index="bookDataStore">书籍存储</el-menu-item>
      <el-menu-item index="urlDataStore">URL存储</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="category">分类</el-menu-item>
    <el-menu-item index="3">关于项目</el-menu-item>
  </el-menu>

</template>

<script>

export default {
  name: "NavBar",
  data() {
    return {
      activeIndex: 'project',
      handleNavbarSelect: (key) => {
        this.$router.push({name: key})
      }
    }
  },
  methods: {
    active() {
      return this.$store.state.nav
    }
  }
}
</script>

<style scoped>

</style>