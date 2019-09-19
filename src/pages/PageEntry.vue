<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="16">
        <h1>{{ id }}</h1>
        <collapse :data="entry[id]" :title="id" :id="id" :is-sub-child="false"></collapse>
      </el-col>
      <el-col :span="8">
        <h1>Raw</h1>
        <el-card class="box-card">
          <pre v-for="entry in entry[id]">{{entry}}</pre>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import collapse from '@/components/RecursiveCollapse';

  export default {
    name: 'Entry',
    components: {
      collapse
    },
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