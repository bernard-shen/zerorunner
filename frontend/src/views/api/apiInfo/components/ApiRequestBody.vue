<template>
  <el-form inline ref="request-form" label-width="50px" size="small" label-position="right">
    <!-- data -->
    <div style="border-bottom: 1px solid #E6E6E6; display: flex; justify-content: space-between">
      <div class="request-mode">
        <el-radio-group
            size="small"
            v-model="state.mode"
            class="radio-group"
            @change="radioChange"
        >
          <el-radio label="none">none</el-radio>
          <el-radio label="form_data">form-data</el-radio>
          <el-radio label="raw">raw</el-radio>

          <el-dropdown @command="handleLanguage"
                       trigger="click"
                       v-if="state.mode === 'raw'"
                       placement="bottom-start">
              <span class="el-button--text">
                {{ state.language }}
                <el-icon class="el-icon--right">
                  <arrowDown/>
                </el-icon>
              </span>
            <template #dropdown>
              <el-dropdown-menu style="width: 150px">
                <el-dropdown-item v-for="language in state.languageList" :key="language" :command="language">
                  {{ language }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </el-radio-group>
      </div>
    </div>
    <div v-if="state.mode === 'none'" style="text-align: center; padding-top: 10px">
      <span style="color: darkgray">当前请求没有请求体</span>
    </div>
    <!---------------------------form_data------------------------------------>
    <div v-if="state.mode === 'form_data'">
      <div>
        <el-row justify="space-between"
                v-for="(data, index) in state.formData"
                :key="index"
                align="middle"
                style="padding: 5px 0;"
        >
          <!--            参数名-->
          <el-col :span="8">
            <div class="mt-4">
              <el-input
                  v-model="data.key"
                  placeholder="Key"
                  class="input-with-select"
              >
                <template #append>
                  <el-select v-model="data.type"
                             placeholder="请选择">
                    <el-option
                        v-for="item in state.formDatatypeOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </template>

              </el-input>
            </div>
          </el-col>

          <!--参数值-->
          <el-col :span="8">
            <div class="file-input-container" v-if="data.type === 'file'">
              <div class="file-input">
                <input type="file"
                       :id="'selectFile' + index"
                       @change="fileChange($event, data, index)"
                       class="file-input__native">
                <el-button v-if="!data.value.name"
                           type="info"
                           size="small"
                           @click="selectFile(index)">选择文件
                </el-button>

                <div v-else class="file-input__name">
                  <div class="file-input__name__title" :title="data.value.name">{{ data.value.name }}</div>
                  <el-button class="file-input__name__delete-icon"
                             size="small"
                             type="primary"
                             link
                             @click="deletedFile(data, index)">
                    <el-icon>
                      <ele-Close/>
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            <el-input size="small"
                      v-else
                      placeholder="Value"
                      v-model="data.value"></el-input>
          </el-col>

          <el-col :span="5">
            <el-input type="primary"
                      size="small"
                      maxlength="200"
                      placeholder="备注"
                      v-model="data.remarks">
            </el-input>
          </el-col>

          <el-col :span="1">
            <el-button type="danger" circle @click="deleteFormData(index)"
                       :disabled="state.formData.length === index  + 1 ">
              <el-icon>
                <ele-Delete/>
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!---------------------------raw------------------------------------>
    <div v-if="state.mode === 'raw'" style="padding-top: 8px;">
      <div style="border: 1px solid #E6E6E6">
        <z-monaco-editor
            style="height: 420px"
            ref="monacoEditRef"
            v-model:value="state.rawData"
            v-model:long="state.long"
        ></z-monaco-editor>
      </div>
    </div>
    <!---------------------------params------------------------------------>
    <div v-if="state.mode === 'params'">
      <div class="block-title">
        <el-button size="small" type="primary" link @click="addParams" title="add params">
          <el-icon>
            <ele-CirclePlusFilled></ele-CirclePlusFilled>
          </el-icon>
          add
        </el-button>
      </div>
      <div>
        <el-table
            ref="paramsDataTableRef"
            :data="state.paramsData"
            tooltip-effect="dark"
            border
            style="width: 100%"
        >
          <el-table-column header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数名</strong>
            </template>
            <template #default="scope">
              <el-input size="small" v-model="scope.row.key"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="type" width="120" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数类型</strong>
            </template>
            <template #default="scope">
              <el-select size="small" v-model="scope.row.type" placeholder="请选择">
                <el-option
                    v-for="item in state.dataTypeOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="value" header-align='center'>
            <template #header>
              <strong style="font-size: 14px;">参数值</strong>
            </template>
            <template #default="scope">
              <el-input size="small" v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button size="small" type="primary" link @click="deleteParams(scope.$index)">
                <el-icon>
                  <ele-Delete/>
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </el-form>
</template>

<script lang="ts" setup name="requestBody">
import {reactive, ref, watch} from "vue";
import {useFileApi} from '/@/api/useSystemApi/file'
import {ElMessage} from "element-plus";
import {handleEmpty} from "/@/utils/other";
import {ArrowDown} from '@element-plus/icons-vue'

const emit = defineEmits(["updateHeader"])

interface StateData {
  mode: string,
  language: string,
  languageList: Array<string>,
  popoverOpen: boolean,
  bodyData: Array<any>,
  rawData: string,
  paramsData: Array<any>,
  dataTypeOptions: Array<string>,
  formData: Array<any>,
  formDatatypeOptions: Array<string>,
  fileData: object,
  long: string,
}

const monacoEditRef = ref()

const state = reactive<StateData>({
  mode: 'raw',
  language: 'JSON',
  languageList: ['JSON', 'Text'],
  popoverOpen: false,
  // body
  bodyData: [],
  rawData: "",
  paramsData: [],
  dataTypeOptions: ['string', 'int', 'float', 'boolean'],
  // formData
  formData: [],
  formDatatypeOptions: ['text', 'file'],
  fileData: {},

  //monaco
  long: 'json',
});

// 初始化数据
const initData = () => {
  state.mode = "raw"
  state.language = "JSON"
  state.rawData = ""
  state.formData = []
  state.fileData = {}
}
// 初始化表单
const setData = (data: any) => {
  initData()
  if (!data) {
    return
  }

  let mode = data.mode
  state.mode = mode
  if (mode === 'form_data') {
    state.formData = data.data ? data.form_data : []
  } else if (mode === 'raw') {
    state.rawData = data.data.replace('/\\n/g', "\n")
    state.language = data.language
  }

}

// 获取是否填写状态
const getStatus = () => {
  let formDataList: Array<any> = handleEmpty(state.formData)
  switch (state.mode) {
    case 'form_data':
      return formDataList.length > 0
    case 'raw':
      return state.rawData !== ''
  }
}

// 获取表单数据
const getData = () => {
  let requestData: any = {}
  requestData.mode = state.mode
  if (state.mode === 'raw') {
    requestData.data = state.rawData
    requestData.language = state.language
  } else if (state.mode === 'form_data') {
    requestData.data = state.formData.filter((e: any) => e.key !== "" || e.value !== "")
  } else if (state.mode === 'none') {
    requestData.data = null
  }
  return requestData
}

// 参数类型变更
const radioChange = (value: any) => {
  state.mode = value
  state.popoverOpen = false
  handleHeader()
}

// 处理raw 语言
const handleLanguage = (language: any) => {
  state.popoverOpen = !state.popoverOpen
  // rawPopoverRef.value.hide()
  state.language = language
  handleHeader()
}

// 处理头信息
const handleHeader = (remove: any = false) => {
  let headerData: any
  if (state.mode === 'raw') {
    if (state.language.toLowerCase() === 'text') {
      headerData = {key: "Content-Type", value: "text/plain"}
    } else if (state.language.toLowerCase() === 'json') {
      headerData = {key: "Content-Type", value: "application/json"}
    }
  } else if (state.mode === "form_data") {
    remove = true
    headerData = {key: "Content-Type"}
    formDataBlur()
  }
  if (headerData) {
    emit('updateHeader', headerData, remove)
  }
}

// 打开语言选择面板
const showPopover = () => {
  state.popoverOpen = !state.popoverOpen
}

// bodyData
const addData = () => {
  state.bodyData.push({key: '', type: 'string', value: ''})
}
const deleteData = (index: number) => {
  state.bodyData.splice(index, 1)
}

// params
const addParams = () => {
  state.paramsData.push({key: '', type: 'string', value: ''})
}
const deleteParams = (index: number) => {
  state.paramsData.splice(index, 1)
}

// formData
const addFormData = () => {
  state.formData.push({key: '', type: 'text', value: ''})
}
// 删除
const deleteFormData = (index: number) => {
  state.formData.splice(index, 1)
}
const formDataBlur = () => {
  if (state.formData.length > 0) {
    let endData = state.formData[state.formData.length - 1]
    if (!endData) {
      addFormData()
    } else if (endData.key !== "" || endData.value !== "") {
      addFormData()
    }
  } else {
    addFormData()
  }
}

// 选择文件时触发，上传文件，回写地址
const fileChange = (e: any, row: any, index: number) => {
  state.fileData = e.target.files[0]
  let file: any = e.target.files[0]
  let formData = new FormData
  // formData.append('name', file.name)
  formData.append('file', file)
  useFileApi().upload(formData)
      .then((res: any) => {
        row.value = res.data
      })
      .catch(() => {
        let fileRef: any = document.getElementById('selectFile' + index)
        if (fileRef) fileRef.value = ''
        row.value = ""
      })

}
// 删除文件处理
const deletedFile = (row: any, index: number) => {
  let fileRef: any = document.getElementById('selectFile' + index)
  useFileApi().deleted({name: row.value.name})
  row.value = {}
  if (fileRef) fileRef.value = ''
}

// 选择文件
const selectFile = (index: number) => {
  let fileRef = document.getElementById('selectFile' + index)
  if (fileRef) fileRef.click()
}

// 监听language 设置 long
watch(
    () => state.language,
    (val) => {
      if (val.toLowerCase() == 'text') {
        state.long = 'plaintext'
      }
      if (val.toLowerCase() == 'json') {
        state.long = 'json'
      }
    }
);

watch(
    () => state.rawData,
    (val) => {
      if (val) {
        handleHeader()
      } else {
        handleHeader(true)
      }
    }, {
      deep: true
    }
);

watch(
    () => state.formData,
    () => {
      formDataBlur()
    }, {
      deep: true
    }
);

const getDataLength = () => {
  let dataLength = 0
  if (state.mode === 'form_data') {
    dataLength = state.formData.length
  } else if (state.mode === 'raw') {
    dataLength = state.rawData.length
  } else if (state.mode === 'none') {
    dataLength = 0
  }
  return dataLength
}

defineExpose({
  setData,
  getData,
  getDataLength,
})

</script>
<style lang="scss" scoped>
.request-mode {
  margin-bottom: 10px;

  :deep(.el-radio__label) {
    font-size: 13px;
  }
}


.file-input-container {
  display: inline-block;
  max-width: 100%;

  .file-input {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs);

    .file-input__native {
      opacity: 0;
      position: absolute;
      width: 0;
      height: 0;
      pointer-events: none;
    }


    //.btn {
    //  box-sizing: border-box;
    //  border-radius: 4px;
    //}

    .file-input__name {
      box-sizing: border-box;
      display: flex;
      min-width: 0;
      height: 24px;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      font-size: 12px;
      font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica, Arial, sans-serif;
      color: #212121;
      background-color: transparent;
      padding: 4px 2px;

      .file-input__name__title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-input__name__delete-icon {
        display: flex;
        align-items: center;
        margin-left: 8px;
        padding-right: 2px;
        cursor: pointer;
        color: #212121;
      }
    }
  }
}

:deep(.input-with-select .el-input-group__append) {
  background-color: var(--el-fill-color-blank) !important;
}

</style>
