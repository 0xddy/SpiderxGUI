<template>

  <h2>规则任务</h2>

  <div class="box-panel">

    <el-empty description="暂无任何规则" v-show="!state.loading && projects.length===0 && !state.error">

    </el-empty>


    <el-space :fill="true" wrap class="box-space">

      <el-skeleton style="width: 240px" :loading="state.loading" animated :throttle="500">
        <template #template>

          <div style="padding: 14px;margin-top: 20px" v-for="key in 4" :key="key">
            <el-skeleton-item variant="h3" style="width: 50%"/>
            <el-skeleton-item variant="text"/>
            <el-skeleton-item variant="text"/>
          </div>

        </template>

        <template #default>

          <el-card v-for="(project,index) in projects" :key="index" class="box-card text" style="margin-left: 14px">
            <template #header>
              <div class="card-header">
                <span>{{ project['project'].name + ' ' + project['project'].version }}</span>

                <el-badge :value="project['metas'].dataCount + '本'" :max="999999">

                </el-badge>

              </div>

            </template>

            <div class="card-content-list">
              <!-- 源站地址 -->
              <div class="list-text item">源：{{ project['project'].url }}</div>

              <div class="list-text item-button" style="margin-top: 10px">

                <el-button size="small" :autofocus="false"
                           :type="project['metas'].categoryServiceState ? 'danger' : 'success'"
                           plain
                           :loading="project['metas'].categoryServiceState"
                           v-on:click="onCategoryServiceClick(project)"> 采集分类
                </el-button>

                <el-button size="small" :autofocus="false"
                           :type="project['metas'].bookServiceState ? 'danger' : 'success'"
                           :loading="project['metas'].bookServiceState"
                           v-on:click="onBookServiceClick(project)"> 采集小说
                </el-button>

                <el-dropdown
                    v-if="project['metas'].bookServiceState || project['metas'].categoryServiceState"
                    style="margin-left: 12px" @command="handleDropdownCommand">
                  <el-button :loading="state.dropdown.loading" size="small" :type="'danger'">
                    关闭命令
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </el-button>

                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                          v-if="project['metas'].categoryServiceState"
                          :command="__dropdownProxy(project['metas'].categoryServiceId,'categoryServiceKill')"
                      >
                        停止分类服务
                      </el-dropdown-item>
                      <el-dropdown-item v-if="project['metas'].bookServiceState"
                                        :command="__dropdownProxy(project['metas'].bookServiceId,'bookServiceKill')">
                        停止小说服务
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>


              </div>

            </div>

          </el-card>
        </template>

      </el-skeleton>


    </el-space>

  </div>

</template>

<script>
import {ElMessage, ElMessageBox} from 'element-plus'
import {bookServiceStartup, categoryServiceStartup, getProjects, killService} from "@/repository";

async function categoryServiceStartLogic(projectObject) {
  let metas = projectObject.metas
  let categoryServiceState = metas.categoryServiceState
  if (!categoryServiceState) {
    let res = await categoryServiceStartup(metas.rejs)
    if (res.code === 200) {
      projectObject.metas.categoryServiceState = true
      ElMessage.success('启动成功 ~ ')
    } else if (res.code === 202) {
      projectObject.metas.categoryServiceState = true
      ElMessage.error('进程已在运行中..')
    } else {
      ElMessage.error(res.message)
    }
  }
}

async function bookServiceStartLogic(projectObject) {
  let metas = projectObject.metas
  let bookServiceState = metas.bookServiceState
  if (!bookServiceState) {
    let res = await bookServiceStartup(metas.rejs, [])
    if (res.code === 200) {
      projectObject.metas.bookServiceState = true
      ElMessage.success('启动成功 ~ ')
    } else if (res.code === 202) {
      projectObject.metas.bookServiceState = true
      ElMessage.error('进程已在运行中..')
    } else {
      ElMessage.error(res.message)
    }
  }
}

async function killServiceById(id, type) {
  try {
    let res = await killService(id, type)
    return res.code === 200
  } catch (e) {
    return false
  }
}

export default {
  name: "ProjectPanelView",
  beforeMount() {
    this.$store.state.nav = "project"
  },

  async mounted() {
    try {
      let res = await getProjects()
      if (res !== null) {
        if (res.code === 200) {
          this.projects = res.data
          this.state.loading = false
        } else {
          ElMessage.error(res.message)
        }
      }
    } catch (e) {
      ElMessage.error(e)
      this.state.error = true
    }
  },

  methods: {
    __dropdownProxy(id, type) {
      return {id: id, type: type}
    },
    async handleDropdownCommand(command) {

      this.state.dropdown.loading = true
      await delay(500)
      if (command.type === 'categoryServiceKill') {
        await killServiceById(command.id, command.type)
      } else if (command.type === 'bookServiceKill') {
        await killServiceById(command.id, command.type)
      }
      this.state.dropdown.loading = false
      ElMessage.success('命令已发送')
    },
    async onCategoryServiceClick(projectObject) {

      ElMessageBox.confirm(
          '是否启动采集分类列表服务?',
          '提示',
          {
            autofocus: true,
            confirmButtonClass: 'message-botton',
            cancelButtonClass: 'message-botton-cancel',
            confirmButtonText: '启动',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        await categoryServiceStartLogic(projectObject)
      }).catch(() => {

      })

    },

    async onBookServiceClick(projectObject) {
      let metas = projectObject.metas
      let categoryServiceState = metas.categoryServiceState
      if (categoryServiceState) {
        // 分类采集运行状态 给予提示
        ElMessageBox.confirm(
            '采集分类服务正在运行中，是否忽略并强制启动?',
            '提示',
            {
              autofocus: true,
              confirmButtonClass: 'message-botton-error',
              cancelButtonClass: 'message-botton-cancel',
              confirmButtonText: '启动',
              cancelButtonText: '取消',
              type: 'error',
            }
        ).then(async () => {
          await categoryServiceStartLogic(projectObject)
        }).catch(() => {

        })
      } else {
        ElMessageBox.confirm(
            '是否启动采集内容服务?',
            '提示',
            {
              autofocus: true,
              confirmButtonClass: 'message-botton',
              cancelButtonClass: 'message-botton-cancel',
              confirmButtonText: '启动',
              cancelButtonText: '取消',
              type: 'warning',
            }
        ).then(async () => {
          await bookServiceStartLogic(projectObject)
        }).catch(() => {

        })
      }
    }

  },

  data() {
    return {
      projects: [],
      state: {
        loading: true,
        error: false,
        dropdown: {
          loading: false
        }
      }
    }
  }
}

function delay(ms) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, _) => {
    setTimeout(function () {
      resolve(true)
    }, ms)
  })
}
</script>

<style>

h2 {
  text-align: left;
  padding-left: 20px;
  padding-bottom: 20px;
}

.box-panel {
  width: 100%;
  height: auto;
}

.box-space {
  width: 100%
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.item-button {
  padding-left: 10px;
  padding-top: 10px;
}

.list-text {
  font-size: 14px;
}

.card-content-list {
  text-align: left;
}

.text {
  font-size: 16px;
}


.el-badge {
  --el-badge-bg-color: var(--el-color-danger);
}

.el-dropdown-menu__item:not(.is-disabled):focus {
  background-color: #fff0f0 !important;
  color: #ff6161 !important;
}

</style>