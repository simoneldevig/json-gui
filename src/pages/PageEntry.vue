<template>
  <div class="pb4">
    <el-row class="tac" :gutter="20">
      <el-col :span="16">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb0"><span>{{ id }}</span> model</h1>
            <small class="block mb3">To use values from faker.js, simply insert faker.js functions into the inputs. E.g. faker.name.findName() <br>docs can be found here: <a href="https://github.com/marak/Faker.js/">https://github.com/marak/Faker.js</a></small>
          </div>
        </div>
        <collapse v-if="currentModel && currentModel !== 'models'" :id="id" :data="currentModel" :title="id" :index="0" :is-sub-child="false" @updateData="updateData" />
      </el-col>

      <el-col :span="8">
        <quicktype-model :id="id" />
      </el-col>
    </el-row>

    <el-row class="fixed bottom-0 left-0 z2 entry__save py1" :class="{'is-active' : changesNotSaved}">
      <el-col :offset="4" :span="14">
        <div class="flex items-center justify-between">
          <p class="mr3 ml1">You have unsaved changes on this entry. <strong>Rememember to save!</strong></p>
          <div class="mr2">
            <el-button class="mr1" :loading="loading" type="default" @click="save">Save</el-button>
            <el-button class="mr3" :loading="loading" type="success" @click="saveAndGenerate">Save and generate</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import collapse from '@/components/RecursiveCollapse';
import quicktypeModel from '@/components/QuicktypeModel';
import { mapMutations } from 'vuex';

export default {
  name: 'Entry',
  components: {
    collapse,
    quicktypeModel
  },
  props: {
    id: {
      requirred: true,
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      dataContent: null,
      changesNotSaved: true
    };
  },
  computed: {
    entry () {
      return this.$store.state.models[this.id];
    },
    currentModel () {
      return this.$store.getters['getCurrentModel'];
    }
  },
  watch: {
    entry () {
      this.setModel();
    }
  },
  methods: {
    ...mapMutations([
      'setCurrentModel'
    ]),
    setModel () {
      this.setCurrentModel(this.entry);
    },
    updateData (data) {
      this.dataContent = data;
      this.changesNotSaved = true;
    },
    async save () {
      this.loading = true;
      try {
        await this.$store.dispatch('saveModel', {
          id: this.id
        }).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Your model changes was saved!',
            type: 'success'
          });
        });
      } catch (ex) {
        console.error(ex);
        this.$notify({
          title: 'Warning',
          message: 'An error happened. Please check the console$',
          type: 'warning'
        });
      } finally {
        this.loading = false;
      }
    },
    saveAndGenerate () {
      this.save();
      this.$store.dispatch('saveAndGenerate', {
        id: this.id,
      });
      // var myjson = JSON.stringify(this.dataContent, null, 2);
      // var x = window.open();
      // x.document.open();
      // x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
      // x.document.close();
      this.changesNotSaved = false;
    },
    
  }
};
</script>

<style lang="scss">
  .entry__save {
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(80px);
    transition: transform 0.3s;

    &.is-active { transform: translateY(0); }
  }

  .hljs {
    padding: 20px !important;
    font-size: 14px;
  }

  .model__copy {
    position: absolute;
    right: 5px;
    top: 5px;
  }
</style>
<style src="highlight.js/styles/monokai-sublime.css"></style>
