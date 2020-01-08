<template>
  <div id="app">
    <el-row class="tac" :gutter="20">
      <el-col :span="4">
        <el-menu :router="true">
          <el-menu-item>
            <h3>JSON Server GUI</h3>
          </el-menu-item>
          <el-menu-item v-if="propertyName !== 'models'" v-for="(value, propertyName) in endpoints" :index="'/entry/' + propertyName">
            <i class="el-icon-setting"></i>
            <span>{{ '/' + propertyName }}</span>
          </el-menu-item>
          <el-menu-item class="primary" @click="dialogVisible=true">
            <i class="el-icon-plus"></i>
            <span>Add new route</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view/>
      </el-col>
    </el-row>
      <el-dialog
        title="Create new entry"
        :visible.sync="dialogVisible"
        width="75%">
        <create-route-content />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible=false">Create</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
  import createRouteContent from '@/components/CreateRouteContent';

  export default {
    name: 'app',
    components: {
      createRouteContent
    },
    data() {
      return {
        dialogVisible: false
      };
    },
    computed: {
      endpoints() {
        return this.$store.state.db;
      }
    },
    created() {
      this.$store.dispatch('setDb');
    }
  }
</script>

<style>
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
</style>
