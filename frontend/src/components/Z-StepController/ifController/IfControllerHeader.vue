<template>
  <el-row @click.stop>
    <el-col :span="6" class="com-padding">
      <el-input v-model="data.if_request.check" placeholder="变量,例如：${var}"/>
    </el-col>
    <el-col :span="6" class="com-padding">
      <el-select size="small"
                 v-model="data.if_request.comparator"
                 placeholder=""
                 filterable
                 class="w100">
        <el-option
            v-for="(value, key) in state.comparatorOptions"
            :key="key"
            :label="value"
            :value="key">
        </el-option>

      </el-select>
    </el-col>
    <el-col :span="6" class="com-padding">
      <el-input v-model="data.if_request.expect" placeholder="值"/>
    </el-col>
    <el-col :span="6" class="com-padding">
      <el-input v-model="data.if_request.remarks" placeholder="备注"/>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup name="IfStep">
import {PropType, reactive} from 'vue';

const props = defineProps({
  data: {
    type: Object as PropType<TStepDataStat>,
    default: () => {
      return {}
    }
  },
})

const state = reactive({
  // data
  showDetail: false,
  comparatorOptions: {
    equals: "等于",
    not_equals: "不等于",
    contains: "包含",
    not_contains: "不包含",
    gt: "大于",
    lt: "小于",
    none: "空",
    not_none: "非空",
  },
});

</script>

<style lang="scss" scoped>
.com-padding {
  padding: 0 3px;
}
</style>