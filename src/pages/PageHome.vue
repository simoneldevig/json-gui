<template>
  <div>
    <el-row class="tac">
      <el-col :span="8">
        <h1>Hello!</h1>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {}
</script>
