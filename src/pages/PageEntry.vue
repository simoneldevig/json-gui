<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="16">
        <div class="flex items-center justify-between">
          <h1>{{ id }}</h1>
          <div>
            <el-tag class="ml1" type="success">/GET</el-tag>
            <el-tag class="ml1" type="primary">/PUSH</el-tag>
            <el-tag class="ml1" type="warning">/PATCH</el-tag>
            <el-tag class="ml1" type="info">/PUT</el-tag>
            <el-tag class="ml1" type="danger">/DELETE</el-tag>
          </div>
        </div>

        <collapse :data="entry[id]" :title="id" :id="id" :index="0" :is-sub-child="false"></collapse>
      </el-col>
      <el-col :span="8">
        <h1 class=" mt2">Raw</h1>
        <el-card class="box-card">
          <pre>{{entryModel}}</pre>
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
      entry () {
        return this.$store.state.db;
      },
      entryModel () {
        let model = {};
        Object.values(this.entry[this.id]).forEach(entry => {
          Object.values(entry).forEach((entryVal, index, entryProp) => {
            if (typeof(entryVal) === 'object') {
              let subModel = {};

              Object.values(entryProp[index]).forEach((subEntryVal, subIndex, subEntryProp) => {
                subModel[subEntryProp[subIndex]] = typeof(subEntryVal);
              });
             model[entryProp[index]] = subModel;
            } else {
              model[entryProp[index]] = typeof(entryVal);
            }
          });
        });
        return model;
      }
    }
  }
</script>