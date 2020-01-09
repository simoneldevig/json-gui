<template>
  <div>
    <el-row class="tac" :gutter="20">
      <el-col :span="16">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb0"><span class="text-capitalize">{{ id }}</span> model</h1>
            <small class="block mb3">To use values from faker.js, simply insert faker.js functions into the inputs. E.g. faker.name.findName <br>docs can be found here: <a href="https://github.com/marak/Faker.js/">https://github.com/marak/Faker.js</a></small>
          </div>
          <!-- <div>
            <el-tag class="ml1" type="success">/GET</el-tag>
            <el-tag class="ml1" type="primary">/PUSH</el-tag>
            <el-tag class="ml1" type="warning">/PATCH</el-tag>
            <el-tag class="ml1" type="info">/PUT</el-tag>
            <el-tag class="ml1" type="danger">/DELETE</el-tag>
          </div> -->
        </div>

        <collapse v-if="entry[id] && entry[id] !== 'models'" :id="id" :data="entry[id]" :title="id" :index="0" :is-sub-child="false" />
      </el-col>
      <el-col :span="8">
        <h1 class=" mt2">Raw JSON model</h1>
        <!-- <el-card class="box-card">
          <pre>{{ entryModel }}</pre>
        </el-card> -->
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
  data () {
    return {
      drawer: true
    };
  },
  computed: {
    entry () {
      return this.$store.state.db.models;
    },
    // entryModel () {
    //   let model = {};
    //   Object.values(this.entry[this.id]).forEach(entry => {
    //     Object.values(entry).forEach((entryVal, index, entryProp) => {
    //       if (typeof (entryVal) === 'object') {
    //         let subModel = {};

    //         // Object.values(entryProp[index]).forEach((subEntryVal, subIndex, subEntryProp) => {
    //         //   subModel[subEntryProp[subIndex]] = typeof (subEntryVal);
    //         // });
            
    //         // model[entryProp[index]] = subModel;
    //       } else {
    //         if (entryVal) {
    //           model[Object.keys(entry)[index]] = typeof (entryVal);
    //         }
    //       }
    //     });
    //   });
    //   return model;
    // }
  }
};
</script>
