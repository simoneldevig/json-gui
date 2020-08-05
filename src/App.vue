<template>
  <div id="app">
    <el-row class="tac" :gutter="20">
      <el-col :lg="4" :xl="3" class="navigation">
        <el-menu :default-active="$route.path" :router="true" class="navigation__menu"> 
          <el-menu-item class="center" index="/">
            <img class="navigation__logo" src="./assets/logo.png" alt="">
          </el-menu-item>
          <el-collapse v-model="activeCollapse">
            <el-collapse-item title="Endpoints" name="endpoints">
              <el-menu-item v-for="(value, propertyName) in endpoints" :index="'/endpoints/' + propertyName">
                <i class="el-icon-guide" />
                <span>{{ '/' + propertyName }}</span>
              </el-menu-item>
              <el-menu-item class="primary" @click="dialogVisible=true">
                <i class="el-icon-plus" />
                <span>Add new endpoint</span>
              </el-menu-item>
            </el-collapse-item>
            <el-collapse-item title="Models" name="models">
              <el-menu-item v-for="(value, propertyName) in models" :index="'/models/' + propertyName">
                <i class="el-icon-setting" />
                <span>{{ '/' + propertyName }}</span>
              </el-menu-item>
              <el-menu-item class="primary" @click="dialogVisible=true">
                <i class="el-icon-plus" />
                <span>Add new model</span>
              </el-menu-item>
            </el-collapse-item>
          </el-collapse>          
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
      newRouteName:'',
      activeCollapse: []
    };
  },
  computed: {
    endpoints () {
      return this.$store.state.data;
    },
    models () {
      return this.$store.state.models;
    }
  },
  created () {
    this.$store.dispatch('getModels');
    this.$store.dispatch('getEndpoints');
    this.activeCollapse.push(this.$route.params.type);
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
    padding-left: 0 !important;

    &__menu {
      height: 100%;
    }

    &__logo {
      width: 120px;
    }
  }

  .el-collapse {
    border: none !important;
  }

  .el-collapse-item__wrap {
    border: none !important;
  }

  .el-collapse-item__header {
    background: none !important;
    border: none !important;
    padding-left: 10px;
    font-size: 16px !important;
  }

  .el-collapse-item__content {
    background: none !important;
    padding: 0 !important;
    border: none !important;
  }
</style>
