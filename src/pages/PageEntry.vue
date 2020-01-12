<template>
  <div class="pb4">
    <el-row class="tac" :gutter="20">
      <el-col :span="16">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb0"><span class="text-capitalize">{{ id }}</span> model</h1>
            <small class="block mb3">To use values from faker.js, simply insert faker.js functions into the inputs. E.g. faker.name.findName <br>docs can be found here: <a href="https://github.com/marak/Faker.js/">https://github.com/marak/Faker.js</a></small>
          </div>
        </div>

        <collapse v-if="entry[id] && entry[id] !== 'models'" :id="id" :data="entry[id]" :title="id" :index="0" :is-sub-child="false" @updateData="updateData" />
      </el-col>
      <el-col :span="8">
        <h1 class=" mt2">Raw JSON model</h1>
        <!-- <el-card class="box-card">
          <pre>{{ entryModel }}</pre>
        </el-card> -->
      </el-col>
    </el-row>

    <el-row class="fixed bottom-0 left-0 z2 entry__save py1">
      <el-col :offset="4" :span="14">
        <div class="flex items-center justify-between">
          <p class="mr3 ml1">You have unsaved changes on this entry. <strong>Rememember to save!</strong></p>
          <div class="mr2">
            <el-button class="mr4" :loading="loading" type="success" @click="saveData">Save</el-button>
          </div>
        </div>
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
      loading: false,
      dataContent: null
    };
  },
  computed: {
    entry () {
      return this.$store.state.models;
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
  },
  methods: {
    updateData (data) {
      this.dataContent = data;
    },
    saveData () {
      this.$store.dispatch('updateEntry', {
        url: this.id,
        payload: this.dataContent
      });
    }
  }
};
</script>

<style lang="scss">
  .entry__save {
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>