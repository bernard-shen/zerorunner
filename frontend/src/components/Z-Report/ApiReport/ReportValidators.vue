<template>
  <el-table :data="data.validate_extractor">
    <el-table-column prop="check" label="断言名称" show-overflow-tooltip=""></el-table-column>
    <el-table-column prop="comparator" label="断言方式" show-overflow-tooltip=""></el-table-column>
    <el-table-column prop="expect_value" label="期望值" show-overflow-tooltip="">
      <template #default="{row}">
        {{ getJson2Str(row.expect_value) }}
      </template>
    </el-table-column>
    <el-table-column prop="check_value" label="结果值" show-overflow-tooltip="">
      <template #default="{row}">
        {{ getJson2Str(row.check_value) }}
      </template>
    </el-table-column>
    <el-table-column prop="check_result" label="断言结果" show-overflow-tooltip="">
      <template #default="{ row }">
        <el-tag :type="row.check_result === 'pass'? 'success': 'danger'">{{ row.check_result }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="message" label="错误信息" show-overflow-tooltip=""></el-table-column>
  </el-table>
</template>

<script lang="ts" setup name="ReportValidators">
import {PropType} from 'vue';


const props = defineProps({
  data: {
    type: Object as PropType<ValidateExtractor>,
    default: () => {
      return {}
    }
  },
},)

const getJson2Str = (value: string) => {
  try {
    return JSON.stringify(value)
  } catch (e) {
    return value
  }
}

</script>

<style lang="scss" scoped>

</style>