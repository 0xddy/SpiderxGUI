<template>

  <h2 style="text-align: left;padding-left: 20px;padding-bottom: 20px">数据列表</h2>

  <div>
    <el-row :gutter="10" style="margin-bottom: 20px">

      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2">

        <el-select v-model="categoryId" clearable placeholder="Select">
          <el-option
              v-for="item in categoryOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>

      </el-col>

      <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" style="margin-left: 6px">
        <el-input clearable
                  v-model="keyword"
                  placeholder="小说名称"
                  :prefix-icon="icon.search"/>
      </el-col>

      <el-col :span="1">
        <el-button type="primary" plain @click="handleFilter"
                   v-text="(categoryId===''&&keyword==='')?'刷新':'筛选'"></el-button>
      </el-col>

      <el-col :span="5"></el-col>

    </el-row>

    <el-table :data="this.$data.books.records" stripe border style="width: 100%" v-loading="state.isLoading">
      <el-table-column prop="id" label="ID" width="120"/>
      <el-table-column prop="name" label="小说名称" width="290"/>
      <el-table-column prop="author" label="作者" width="150">
        <template #default="scope">
          <div style="align-items: center">
            <span style="color: #939292">{{ scope.row.author }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="bookState" label="状态" width="140">
        <template #default="scope">
          <div style="align-items: center">
            <span v-if="scope.row.status===0" style="color: #939292">未知</span>
            <span v-if="scope.row.status===1" style="color: #56b756">连载</span>
            <span v-if="scope.row.status===2" style="color: rgba(236,80,80,0.78)">完结</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="chapterCount" label="章节数" width="100">
        <template #default="scope">
          <div style="align-items: center">
            <span v-html="fmtChapterCount(scope.row.chapterCount)"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category.name" label="分类" width="120"/>
      <el-table-column prop="cover" label="封面" width="70">

        <template #default="scope">
          <div>
            <el-popover effect="light" trigger="hover" placement="top"
                        v-if="scope.row.thumb!==null && scope.row.thumb!==''">
              <template #default>
                <div>
                  <el-image :src="this.$data.thumbBaseUrl+'/thumb'+scope.row.thumb"></el-image>
                </div>
              </template>

              <template #reference>

                <div>
                  <el-switch
                      :loading="state.switch[scope.row.id]"
                      v-model="scope.row.thumbState"
                      v-show="scope.row.thumb!==null && scope.row.thumb!==''"
                      size="small"
                      style="--el-switch-on-color: #ff4949;"
                      v-on:change="coverLockChange(scope.row.thumbState, scope.row.id, scope.row)"
                  />

                  <span v-show="scope.row.thumb==null || scope.row.thumb===''"> - </span>

                </div>


              </template>
            </el-popover>

            <span v-if="scope.row.thumb==null || scope.row.thumb===''"> - </span>

          </div>

        </template>

      </el-table-column>
      <el-table-column prop="time" label="时间" width="170">
        <template #default="scope">
          <div style="align-items: center">
            <span>{{ fmtLastTime(scope.row.lastime * 1000) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="action" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

          <el-button size="small" plain type="success" @click="handleSpider(scope.$index, scope.row)">更新</el-button>

          <el-button size="small" type="primary" plain @click="handleChapterPreview(scope.$index, scope.row)">章节目录
          </el-button>

          <el-button size="small" :loading="state.table.delete.loading"
                     @click="handleDelete(scope.$index,scope.row)" type="danger">删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--  分页  -->
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

  </div>

  <!-- 编辑弹出框 -->
  <el-dialog v-model="state.editDialog.visible" :title="state.editDialog.title">
    <el-form :model="bookEdit.form" label-position="right"
             label-width="100px">

      <el-form-item label="ID" style="width: 30%">
        <el-input v-model="bookEdit.form.id" disabled/>
      </el-form-item>

      <el-form-item label="小说名称" style="width: 50%">
        <el-input v-model="bookEdit.form.name" clearable show-word-limit maxlength="30"/>
      </el-form-item>

      <el-form-item label="作者" style="width: 50%">
        <el-input v-model="bookEdit.form.author" clearable show-word-limit maxlength="15"/>
      </el-form-item>


      <el-form-item label="章节数" style="width: 30%">
        <el-input v-model="bookEdit.form.chapterCount" disabled/>
      </el-form-item>

      <el-form-item label="分类" style="width: 30%">
        <el-select v-model="bookEdit.form.category.id" placeholder="">
          <el-option
              v-for="item in categoryOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>


      <el-form-item label="更新时间">
        <el-col :span="5">
          <el-date-picker
              v-model="bookEdit.form.lastime"
              type="date"
              style="width: 100%"
          />
        </el-col>
        <el-col :span="1" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="4">
          <el-time-picker
              v-model="bookEdit.form.lastime"
              style="width: 100%"
          />
        </el-col>
      </el-form-item>


      <el-form-item label="封面" style="width: 60%">

        <el-popover effect="light" trigger="hover" placement="right" width="auto">
          <template #default>
            <el-image :src="this.$data.thumbBaseUrl+'/thumb'+bookEdit.form.thumb"></el-image>
          </template>
          <template #reference>
            <div style="width: 60%">
              <el-input v-model="bookEdit.form.thumb" clearable/>
            </div>
          </template>
        </el-popover>

      </el-form-item>

      <el-form-item label="封面状态">
        <el-switch v-model="bookEdit.form.thumbState" size="small" style="--el-switch-on-color: #ff4949;"/>
      </el-form-item>


      <el-form-item label="连载状态">
        <el-radio-group v-model="bookEdit.form.status">
          <el-radio :label="0">未知</el-radio>
          <el-radio :label="1">连载</el-radio>
          <el-radio :label="2">完结</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="简介" style="width: 80%">
        <el-input
            v-model="bookEdit.form.intro"
            :rows="3"
            type="textarea"
        />
      </el-form-item>


    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit(bookEdit.form)"
                   :loading="state.editDialog.submit.loading">保存</el-button>
      </span>
    </template>

  </el-dialog>

  <!--  章节目录弹出框-->
  <el-dialog v-model="state.chapterDialog.visible"
             v-on:closed="handleChapterDialogClosed"
             v-on:open="handleChapterDialogOpened">

    <el-auto-resizer>
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <template #default="{ _, width }">
        <el-table-v2
            v-loading="chapterPreview.loading"
            :columns="chapterPreview.columns"
            :data="chapterPreview.data"
            :sort-by="state.chapterDialog.sortState"
            @column-sort="onChapterSort"
            :width="width"
            :height="600"
            fixed
        />
      </template>

    </el-auto-resizer>

    <el-col style="text-align: right;margin-top: 24px">
      <el-button type="danger" :loading="state.chapterDialog.clearLoading" @click="deleteAllChapterHandle">清空章节
      </el-button>
    </el-col>

  </el-dialog>

  <!--  筛选数据链接-->
  <el-dialog :width="1100"
             v-model="state.spiderDialog.visible"
             v-on:open="handleSpiderDialogOpened"
             v-on:closed="handleSpiderDialogClosed"
             title="更新章节">
    <!--  搜索到书籍url 选择后提交更新    -->
    <el-auto-resizer>
      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <template #default="{ _, width }">
        <el-table :data="spiderBook.data" stripe border style="width: 100%" v-loading="state.spiderDialog.loading">
          <el-table-column prop="id" label="ID" width="80"/>
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
          <el-table-column prop="url" label="链接" width="90">
            <template #default="scope">
              <el-link :href="scope.row.url" type="primary" target="_blank">查看链接</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="action" fixed="right">
            <template #default="scope">

              <el-button
                  v-if="scope.row['project']!==null"
                  size="small"
                  :type="scope.row['project']['extendMap']['bookServiceState'] ? 'danger' : 'success'"
                  plain
                  :loading="scope.row['project']['extendMap']['bookServiceState']"
                  v-on:click="handleStartupUpdate(scope.$index, scope.row)"> 选择更新
              </el-button>

            </template>
          </el-table-column>
          <el-table-column label="规则" width="110">
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
        <el-alert
            style="margin-top: 16px"
            type="info"
            :closable="false"
            description="内容由当前 [小说名称] 和 [作者] 作为条件，在链接库里面查找结果，如结果为空可检查数据库是否存在数据."
        />
      </template>
    </el-auto-resizer>

  </el-dialog>

</template>

<script>
import {Lock, Search} from '@element-plus/icons-vue'
import Config from '@/config'
import Moment from 'moment'
import {
  books,
  simpleCategorys,
  deleteAllChapter,
  deleteBook,
  deleteChapterById,
  findBookurl,
  getSimpleChapterList,
  updateBook,
  updateCoverLockState,
  bookServiceStartup
} from "@/repository";
import {ElButton, ElMessage, ElMessageBox} from "element-plus";

// 全局 vue 引用
let $refs = null

async function getBookurls(name, author) {
  try {
    let res = await findBookurl(name, author)
    if (res.code === 200) {
      return res.data
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

async function deleteAllChapterByBookId(bookId) {
  try {
    let res = await deleteAllChapter(bookId)
    return res.code === 200 && res.data === true
  } catch (e) {
    return false
  }
}

async function deleteChapter(id) {
  try {
    let res = await deleteChapterById(id)
    return res.code === 200 && res.data === true
  } catch (e) {
    return false
  }
}

async function getChapterByBookId(bookId) {
  try {
    let res = await getSimpleChapterList(bookId)
    if (res.code === 200 && res.data !== undefined && res.data !== null) {
      return res.data
    } else {
      return null
    }
  } catch (e) {
    return false
  }
}

async function getSimpleCategory() {
  try {
    let res = await simpleCategorys()

    if (res.code === 200) {
      return res.data
    } else {
      return null
    }
  } catch (e) {
    console.error(e)
  }
}

async function getBooks(keyword, categoryId, curPage) {
  try {
    let res = await books(keyword, categoryId, curPage)
    if (res.code === 200) {
      return res.data
    } else {
      return null
    }
  } catch (e) {
    ElMessage.error('加载数据失败。')
  }
}

async function updateCoverState(id, state) {
  try {
    let res = await updateCoverLockState(id, state)
    return res.code === 200;
  } catch (e) {
    return false
  }
}

async function updateEditBook(form) {
  try {
    let res = await updateBook(form)
    return res.code === 200 && res.data === true
  } catch (e) {
    return false
  }
}

async function deleteBookById(id) {
  try {
    let res = await deleteBook(id)
    return res.code === 200 && res.data === true
  } catch (e) {
    return false
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

export default {
  name: "DataStoreView",

  beforeMount() {
    this.$store.state.nav = "bookDataStore"
    $refs = this
  },

  async mounted() {
    this.state.isLoading = true
    //await delay(500)
    this.categoryOption = await getSimpleCategory()
    this.books = await getBooks(this.keyword, this.categoryId, this.pager.currentPage)
    // 初始化 分页
    this.pager.total = this.books.total
    this.pager.pageSize = this.books.size
    this.pager.currentPage = this.books.current
    this.state.isLoading = false
    console.log(Config.thumbBaseUrl)
  },

  methods: {
    async handleStartupUpdate(index, data) {
      data.project.extendMap.bookServiceState = true
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
    },
    handleSpiderDialogClosed() {
      this.spiderBook.refBook = {}
      this.spiderBook.data = []
    },
    async handleSpiderDialogOpened() {
      this.state.spiderDialog.loading = true
      await delay(500)
      let refBook = this.spiderBook.refBook
      this.spiderBook.data = await getBookurls(refBook.name, refBook.author)
      this.state.spiderDialog.loading = false
    },

    handleChapterDialogClosed() {
      // reset value
      this.chapterPreview.refBook = {}
      this.chapterPreview.data = []
    },

    handleSpider(index, data) {
      this.state.spiderDialog.visible = true
      this.spiderBook.refBook = data
    },

    async handleChapterDialogOpened() {
      let curBookId = this.chapterPreview.refBook.id
      if (curBookId !== '') {
        this.chapterPreview.loading = true
        await delay(500)
        let data = await getChapterByBookId(curBookId)
        // eslint-disable-next-line no-unused-vars
        data.forEach((item, index) => {
          item['_id'] = index + 1
          item['lastime'] = this.fmtLastTime(item.lastime * 1000)
        })
        this.chapterPreview.data = data
        this.chapterPreview.loading = false
      }
    },

    async handleChapterPreview(index, data) {
      this.state.chapterDialog.visible = true
      this.chapterPreview.refBook = data
    },

    async handlePageChange(curPage) {
      this.pager.currentPage = curPage
      await this.refresh()
    },

    async handleFilter() {
      if (this.$data.categoryId !== '' || this.$data.keyword !== '') {
        this.pager.currentPage = 1
      }
      await this.refresh()
    },

    async refresh() {
      this.state.isLoading = true
      //await delay(500)
      this.books = await getBooks(this.keyword, this.categoryId, this.pager.currentPage)
      this.pager.total = this.books.total
      this.pager.pageSize = this.books.size
      this.pager.currentPage = this.books.current
      this.state.isLoading = false
    },

    handleDelete(index, data) {
      ElMessageBox.confirm(
          '该操作会将章节一起删除，是否确认删除？',
          '警告',
          {
            confirmButtonClass: 'message-botton-error',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        this.state.table.delete.loading = true
        await delay(500)
        let deleteResult = await deleteBookById(data.id)
        this.state.table.delete.loading = false
        if (deleteResult) {
          ElMessage({
            type: 'success',
            message: '删除操作完成',
          })

          let position = -1
          let originBooks = this.books.records
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

    handleEdit(index, data) {
      this.$data.state.editDialog.visible = true
      this.$data.state.editDialog.title = '编辑'
      this.$data.bookEdit.form = {
        id: data.id,
        name: data.name,
        author: data.author,
        status: data.status,
        thumb: data.thumb,
        intro: data.intro,
        lastime: data.lastime * 1000,
        category: {
          id: data.category.id,
          name: data.category.name
        },
        chapterCount: data.chapterCount,
        thumbState: data.thumbState
      }
      this.$data.bookEdit.refBook = data
    },

    async handleEditSubmit(form) {
      if (!this.checkUpdateForm(form)) {
        return 0
      }

      if (!(form.lastime instanceof Number)) {
        form.lastime = new Date(form.lastime).getTime()
      }

      this.$data.state.editDialog.submit.loading = true
      await delay(1000)
      let updateResult = await updateEditBook(form)
      if (updateResult) {
        ElMessage({
          message: '保存操作成功',
          type: 'success',
        })
        await delay(300)
        // 刷新表单数据
        if (this.$data.bookEdit.refBook) {
          this.$data.bookEdit.refBook.name = form.name
          this.$data.bookEdit.refBook.author = form.author
          this.$data.bookEdit.refBook.category.id = form.category.id
          this.$data.bookEdit.refBook.category.name = form.category.name
          this.$data.bookEdit.refBook.thumb = form.thumb
          this.$data.bookEdit.refBook.thumbState = form.thumbState
          this.$data.bookEdit.refBook.intro = form.intro
          this.$data.bookEdit.refBook.status = form.status
          this.$data.bookEdit.refBook.lastime = form.lastime / 1000
        }

        this.$data.state.editDialog.visible = false

      } else {
        ElMessage.error('操作失败')
      }
      this.$data.state.editDialog.submit.loading = false
    },

    checkUpdateForm(form) {
      if (form.name.trim() === '') {
        ElMessage.error('小说名称不能为空')
        return false
      }
      if (form.author.trim() === '') {
        ElMessage.error('作者不能为空')
        return false
      }
      if (form.lastime === 0) {
        ElMessage.error('更新时间不能为空')
        return false
      }
      return true
    },

    fmtLastTime(timestamp) {
      return Moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    },

    fmtChapterCount(chapterCount) {
      let htmlContent = ''
      if (chapterCount === 0) {
        htmlContent = '-'
      } else {
        htmlContent = chapterCount + ' <span style=\'color: #939292\'>章</span>'
      }
      return htmlContent
    },

    async coverLockChange(curValue, id, data) {
      this.$data.state.switch[id] = true

      await delay(1000)
      let updateResult = await updateCoverState(id, curValue)
      if (!updateResult) {
        data.thumbState = !curValue
      } else {
        if (curValue)
          ElMessage({
            message: '锁定封面成功.',
            type: 'success',
          })
      }

      this.$data.state.switch[id] = false
    },

    onChapterSort(sortBy) {
      this.chapterPreview.data = this.chapterPreview.data.reverse()
      this.state.chapterDialog.sortState.value = sortBy
    },

    async deleteChapterHandle(rowIndex, rowData) {
      this.state.chapterDialog.item.loading[rowData['id']] = true
      await delay(500)
      let deleteResult = await deleteChapter(rowData.id)
      if (deleteResult) {
        // 删除源数据
        let resource = this.chapterPreview.data
        let position = -1
        for (let i = 0; i < resource.length; i++) {
          if (resource[i].id === rowData.id) {
            position = i
            break
          }
        }

        if (position !== -1) {
          resource.splice(position, 1)
          ElMessage({
            message: '删除章节成功.',
            type: 'success',
          })
          let bookId = this.chapterPreview.refBook.id
          let originBooks = this.books.records
          for (let i = 0; i < originBooks.length; i++) {
            if (originBooks[i].id === bookId) {
              originBooks[i].chapterCount -= 1
              break
            }
          }
        }

      } else {
        ElMessage.error('Oops, 删除操作失败.')
      }

      this.state.chapterDialog.item.loading[rowData['id']] = false
    },

    async deleteAllChapterHandle() {
      this.state.chapterDialog.clearLoading = true
      await delay(500)
      let bookId = this.chapterPreview.refBook.id
      let deleteResult = await deleteAllChapterByBookId(bookId)
      this.state.chapterDialog.clearLoading = false
      if (deleteResult) {

        ElMessage({
          message: '删除全部章节成功.',
          type: 'success',
        })

        this.state.chapterDialog.visible = false
        let originBooks = this.books.records
        for (let i = 0; i < originBooks.length; i++) {
          if (originBooks[i].id === bookId) {
            originBooks[i].chapterCount = 0
            break
          }
        }

      } else {
        ElMessage.error('Oops, 删除操作失败.')
      }

    }

  },


  data() {
    return {
      pager: {
        currentPage: 1,
        pageSize: 0,
        total: 0
      },
      chapterPreview: {
        refBook: {},
        data: [],
        loading: true,
        columns: [
          {key: "_id", dataKey: "_id", title: "序号", width: 60},
          {key: "id", dataKey: "id", title: "ID", width: 180, sortable: true},
          {key: "name", dataKey: "name", title: "章节标题", width: 320},
          {key: "lastime", dataKey: "lastime", title: "时间", width: 180},
          {
            key: "action",
            dataKey: "action",
            title: "操作",
            width: 70,
            // eslint-disable-next-line no-unused-vars
            cellRenderer: ({rowIndex, rowData, column}) => {
              return <ElButton
                  loading={this.state.chapterDialog.item.loading[rowData['id']] || this.state.chapterDialog.clearLoading}
                  onclick={
                    () => {
                      $refs.deleteChapterHandle(rowIndex, rowData)
                    }
                  } size="small" type="danger">删除</ElButton>
            }
          }
        ]
      },
      bookEdit: {
        refBook: {},
        form: {},
      },
      spiderBook: {
        data: [],
        refBook: {}
      },
      books: {},
      categoryOption: [],
      categoryId: '',
      keyword: '',
      icon: {
        search: Search,
        lock: Lock
      },
      state: {
        table: {
          delete: {
            loading: false
          }
        },
        isLoading: true,
        switch: {},
        chapterDialog: {
          clearLoading: false,
          visible: false,
          sortState: {
            key: 'id',
            order: 'asc',
          },
          item: {
            loading: {}
          }
        },
        editDialog: {
          visible: false,
          title: '',
          submit: {
            loading: false
          }
        },
        spiderDialog: {
          visible: false,
          loading: false
        }
      },
      thumbBaseUrl: Config.thumbBaseUrl
    }
  }

}

</script>

<style scoped>
.el-alert {
  --el-alert-padding: 8px 8px !important;
}
</style>