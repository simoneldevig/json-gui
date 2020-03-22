<template>
  <div id="app">
    <el-row class="tac" :gutter="20">
      <el-col :lg="4" :xl="3" class="navigation">
        <el-menu :default-active="$route.path" :router="true" class="navigation__menu"> 
          <el-menu-item index="/">
            <h3>JSON Server GUI</h3>
          </el-menu-item>
          <el-menu-item v-for="(value, propertyName) in endpoints" v-if="propertyName !== 'models'" :index="'/entry/' + propertyName">
            <i class="el-icon-setting" />
            <span>{{ '/' + propertyName }}</span>
          </el-menu-item>
          <el-menu-item class="primary" @click="dialogVisible=true">
            <i class="el-icon-plus" />
            <span>Add new route</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :lg="{span: 20, offset: 4}" :xl="{span: 21, offset: 3}">
        <router-view />
      </el-col>
      </el-col:lg="20">
    </el-row>
    <el-dialog
      title="Create new entry"
      :visible.sync="dialogVisible"
    >
      <create-route-content @add-route="setNewRouteName" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="createRoute">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import createRouteContent from '@/components/CreateRouteContent';

export default {
  name: 'App',
  components: {
    createRouteContent
  },
  data () {
    return {
      dialogVisible: false,
      newRouteName:''
    };
  },
  computed: {
    endpoints () {
      return this.$store.state.models;
    }
  },
  created () {
    this.$store.dispatch('getModels');
  },
  methods: {
    setNewRouteName (newRouteName) {
      this.newRouteName = newRouteName;
    },
    createRoute () {
      this.dialogVisible = false;
      this.$store.dispatch('createNewRoute', this.newRouteName);
    }
  }
};
</script>

<style lang="scss"> 
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    overflow-x: hidden;
  }
  .navigation {
    position: fixed;
    height: 100%;

    &__menu {
      height: 100%;
    }
  }
</style>
