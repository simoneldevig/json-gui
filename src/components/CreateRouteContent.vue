<template>
  <div>
    <p><strong>Route name</strong></p>
    <el-input placeholder="Insert your new route name" v-model="routeName">
      <template slot="prepend">/</template>
    </el-input>

    <p><strong>Add data types</strong></p>
    <el-button icon="el-icon-document-add" type="default">Object</el-button>
    <el-button icon="el-icon-document-add" class="ml1" type="default">Array</el-button>
    <el-button icon="el-icon-document-add" class="ml1" type="default">String</el-button>
    <el-button icon="el-icon-document-add" class="ml1" type="default">Number</el-button>
    <el-button icon="el-icon-document-add" class="ml1" type="default">Boolean</el-button>
  </div>
</template>

<script>
  export default {
    name: 'CreateRouteModal',
    data() {
      return {
        routeName: ''

      };
    }
  }
</script>