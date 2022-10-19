<template>
  <h2 style="text-align: left;padding-left: 20px;padding-bottom: 20px">数据列表</h2>

  <el-row :gutter="10" style="margin-bottom: 20px">

    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" style="margin-left: 6px">
      <el-input clearable
                v-model="keyword"
                placeholder="小说名称"
                :prefix-icon="icon.search"/>
    </el-col>

    <div style="margin-left: 10px">
      <el-button type="primary" plain @click="handleFilter"
                 v-text="(keyword==='') ? '刷新' : '筛选' "></el-button>
    </div>

    <div style="margin-left: 10px">
      <el-dropdown @command="handleDropdownCommand">
        <el-button>
          更多操作
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="deleteByProject">删除规则数据</el-dropdown-item>
            <el-dropdown-item command="updateContent">替换规则URL</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>


  </el-row>

  <el-table :data="bookurl.records" stripe border style="width: 100%" v-loading="state.loading">
    <el-table-column prop="id" label="ID" width="120"/>
    <el-table-column prop="name" label="小说名称" width="290"/>
    <el-table-column prop="author" label="作者" width="150">
      <template #default="scope">
        <div style="align-items: center">
          <span style="color: #939292">{{ scope.row.author }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="bookState" label="状态" width="60">
      <template #default="scope">
        <div style="align-items: center">
          <span v-if="scope.row.status===0" style="color: #939292">未知</span>
          <span v-if="scope.row.status===1" style="color: #56b756">连载</span>
          <span v-if="scope.row.status===2" style="color: rgba(236,80,80,0.78)">完结</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="category.name" label="分类" width="110"/>
    <el-table-column prop="url" label="链接">
      <template #default="scope">
        <el-link :href="scope.row.url" type="primary" target="_blank">{{ scope.row.url }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="action" fixed="right" width="220">
      <template #default="scope">

        <el-button
            v-if="scope.row['project']!==null"
            size="small"
            :type="scope.row['project']['extendMap']['bookServiceState'] ? 'danger' : 'success'"
            plain
            :loading="scope.row['project']['extendMap']['bookServiceState']"
            v-on:click="handleStartupUpdate(scope.$index, scope.row)"> 运行更新
        </el-button>

        <el-button size="small" :loading="this.state.item.loading[scope.row['id']]"
                   @click="handleDelete(scope.$index,scope.row)" type="danger">删除
        </el-button>

      </template>
    </el-table-column>
    <el-table-column label="规则" width="140">
      <template #default="scope">
        <el-popover
            placement="top-start"
            :width="300"
            trigger="hover">
          <template #reference>
            {{ scope.row.project.project.id }}
          </template>
          <template #default>
            <el-card class="box-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <span style="font-size: larger"><b>{{ scope.row.project.project.name }}</b></span>
                </div>
              </template>
              <div style="margin-bottom: 4px">I&nbsp;&nbsp;&nbsp;D：{{ scope.row.project.project.id }}</div>
              <div style="margin-bottom: 4px">规则：{{ scope.row.project.rejs }}</div>
              <div style="margin-bottom: 4px">作者：{{ scope.row.project.project.author }}</div>
              <div style="margin-bottom: 4px">版本：{{ scope.row.project.project.version }}</div>
              <div>网址：
                <el-link :href="scope.row.project.project.url" type="primary" target="_blank">
                  {{ scope.row.project.project.url }}
                </el-link>
              </div>
            </el-card>
          </template>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>

  <div class="box-page" style="margin-top: 22px">

    <el-pagination
        style="padding-left: 0"
        v-model:currentPage="pager.currentPage"
        v-model:page-size="pager.pageSize"
        small="small"
        :disabled="false"
        :background="true"
        layout="total,prev, pager, next, jumper"
        :total="pager.total"
        @current-change="handlePageChange"
    />
  </div>

  <el-dialog v-model="state.deleteByProjectDialog.visible" width="20%" title="清空规则数据" v-on:close="form={}">
    <el-form :model="form">
      <el-form-item label="规则ID">
        <el-input v-model="form.projectId" class="el-input-danger" autocomplete="off" style="width: 100%"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.deleteByProjectDialog.visible = false">取消</el-button>
        <el-button type="danger" @click="handleDeleteByProject"
                   :loading="state.deleteByProjectDialog.delete.loading">删除</el-button>
      </span>
    </template>

  </el-dialog>

  <el-dialog v-model="state.updateDialog.visible" width="22%" title="替换规则URL" v-on:close="form={}">
    <el-form :model="form" label-width="80px">
      <el-form-item label="规则ID">
        <el-input v-model="form.projectId" autocomplete="off" style="width: 70%"/>
      </el-form-item>
      <el-form-item label="匹配内容">
        <el-input v-model="form.content1" autocomplete="off" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="替换成">
        <el-input v-model="form.content2" autocomplete="off" style="width: 100%"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.updateDialog.visible = false">取消</el-button>
        <el-button type="danger" @click="handleUpdateDialog"
                   :loading="state.updateDialog.update.loading">替换</el-button>
      </span>
    </template>

  </el-dialog>

</template>

<script>
import {bookServiceStartup, queryBookurl, deleteBookurl, updateBookUrl} from "@/repository"
import {ElMessage, ElMessageBox} from "element-plus"
import {Lock, Search} from "@element-plus/icons-vue"


export default {
  name: "UrlDataStoreView",
  beforeMount() {
    this.$store.state.nav = "urlDataStore"
  },
  async mounted() {
    this.state.loading = true
    await delay(500)
    this.bookurl = await getBookurl({
      keyword: this.keyword,
      categoryId: this.categoryId,
      projectId: this.projectId,
      page: 1
    })
    this.pager.total = this.bookurl.total
    this.pager.pageSize = this.bookurl.size
    this.pager.currentPage = this.bookurl.current
    this.state.loading = false
  },

  methods: {
    async handleUpdateDialog() {
      let projectId = this.form.projectId
      let content1 = this.form.content1
      let content2 = this.form.content2
      if (content1 === undefined || content1 === '') {
        ElMessage({
          type: 'error',
          message: '请先填写匹配条件',
        })
        return
      }
      this.state.updateDialog.update.loading = true
      let replaceReuslt = await replaceBookUrl(projectId, content1, content2)
      this.state.updateDialog.update.loading = false
      if (replaceReuslt) {
        ElMessage({
          type: 'success',
          message: '替换操作完成',
        })
        this.state.updateDialog.visible =  false
        await this.refresh()
      }
    },
    async handleDeleteByProject() {
      this.state.deleteByProjectDialog.delete.loading = true
      await delay(500)
      let projectId = this.form.projectId
      let deleteResult = await deleteBookurlByProject(projectId)
      this.state.deleteByProjectDialog.delete.loading = false
      if (deleteResult) {
        ElMessage({
          type: 'success',
          message: '删除操作完成',
        })
        await this.refresh()
      }
    },
    handleDropdownCommand(command) {
      if (command === 'deleteByProject') {
        this.state.deleteByProjectDialog.visible = true
      } else if (command === 'updateContent') {
        this.state.updateDialog.visible = true
      }
    },
    handleDelete(index, data) {

      ElMessageBox.confirm(
          '是否确认删除？',
          '警告',
          {
            confirmButtonClass: 'message-botton-error',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        this.state.item.loading[data['id']] = true
        await delay(500)
        let deleteResult = await deleteBookurlById(data.id)
        this.state.item.loading[data['id']] = false
        if (deleteResult) {
          ElMessage({
            type: 'success',
            message: '删除操作完成',
          })

          let position = -1
          let originBooks = this.bookurl.records
          for (let i = 0; i < originBooks.length; i++) {
            if (originBooks[i].id === data.id) {
              position = i
              break
            }
          }
          if (position !== -1) {
            originBooks.splice(position, 1)
            this.pager.total -= 1
          }

        } else {
          ElMessage({
            type: 'error',
            message: '删除操作失败',
          })
        }

      }).catch(() => {
      })
    },
    async handleStartupUpdate(index, data) {
      ElMessageBox.confirm(
          '是否启动采集服务?',
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
        data.project.extendMap.bookServiceState = true
        await delay(600)
        let rejs = data.project.rejs
        let res = await bookServiceStartup(rejs, [data.id])
        if (res.code === 200) {
          ElMessage.success('已提交至更新服务 ~ ')
        } else if (res.code === 202) {
          data.project.extendMap.bookServiceState = true
          ElMessage.error('进程已在运行中..')
        } else {
          ElMessage.error(res.message)
          data.project.extendMap.bookServiceState = false
        }
      }).catch(() => {
      })
    },
    async handleFilter() {
      if (this.$data.keyword !== '') {
        this.pager.currentPage = 1
      }
      await this.refresh()
    },
    async handlePageChange(curPage) {
      this.pager.currentPage = curPage
      await this.refresh()
    },
    async refresh() {
      this.state.loading = true
      await delay(500)
      this.bookurl = await getBookurl(
          {
            keyword: this.keyword,
            categoryId: this.categoryId,
            projectId: this.projectId,
            page: this.pager.currentPage
          }
      )
      this.pager.total = this.bookurl.total
      this.pager.pageSize = this.bookurl.size
      this.pager.currentPage = this.bookurl.current
      this.state.loading = false
    },

  },


  data() {
    return {
      pager: {
        currentPage: 1,
        pageSize: 0,
        total: 0
      },
      form: {},
      state: {
        loading: true,
        table: {
          delete: {
            loading: false
          }
        },
        item: {
          loading: {}
        },
        deleteByProjectDialog: {
          visible: false,
          delete: {
            loading: false
          }
        },
        updateDialog: {
          visible: false,
          update: {
            loading: false
          }
        }

      },
      bookurl: {},
      keyword: '',
      projectId: '',
      icon: {
        search: Search,
        lock: Lock
      },
    }
  }
}

async function replaceBookUrl(projectId, content1, content2) {
  try {
    let res = await updateBookUrl({
      projectId: projectId,
      content1: content1,
      content2: content2
    })
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return false
    }
    return res.code === 200 && res.data
  } catch (e) {
    console.log(e)
  }
}

async function deleteBookurlById(id) {
  try {
    let res = await deleteBookurl({
      id: id
    })
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return false
    }
    return res.code === 200 && res.data
  } catch (e) {
    console.log(e)
  }
}

async function deleteBookurlByProject(projectId) {
  try {
    let res = await deleteBookurl({
      projectId: projectId
    })
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return false
    }
    return res.code === 200 && res.data
  } catch (e) {
    console.log(e)
  }
}

async function getBookurl(data) {
  try {
    let res = await queryBookurl(data)
    if (res.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.message)
      return null
    }
  } catch (e) {
    ElMessage.error('加载数据失败。')
    return null
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

<style scoped>
.el-input-danger {
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-border: var(--el-border);
  --el-input-hover-border: var(--el-border-color-hover);
  --el-input-focus-border: var(--el-color-danger);
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: var(--el-border-color);
  --el-input-border-radius: var(--el-border-radius-base);
  --el-input-bg-color: var(--el-fill-color-blank);
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: var(--el-border-color-hover);
  --el-input-clear-hover-color: var(--el-text-color-secondary);
  --el-input-focus-border-color: var(--el-color-danger);
}
</style>