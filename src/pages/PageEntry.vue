<template>
  <div>
    <h1>{{ id }}</h1>
    <el-collapse>
      <el-collapse-item v-for="entry in entry[id]" :title="id" name="1">
        <template slot="title">
          /{{ id }}
          <el-tag type="success">/GET</el-tag>

          <div>
            <el-tooltip class="item" effect="dark" content="Duplicate" placement="top">
              <el-button type="primary" size="medium" icon="el-icon-document-copy" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Add new entry" placement="top">
              <el-button type="success" size="medium" icon="el-icon-document-add" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <el-button type="danger" size="medium" icon="el-icon-delete-solid" circle></el-button>
            </el-tooltip>
          </div>
        </template>
        <div v-for="property in entry">
          <el-input v-if="typeof(property) === 'string'" :value="property"></el-input>
          <p v-else>{{property}}</p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: 'Entry',
    props: {
      id: {
        requirred: true,
        type: String
      }
    },
    computed: {
      entry() {
        return this.$store.state.db;
      }
    }
  }
</script>