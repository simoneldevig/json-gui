<template>
  <div class="pb4">
    <el-row class="tac" :gutter="20">
      <el-col :span="16">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb0"><span>{{ id }}</span></h1>
            <small class="block mb3">To use values from faker.js, simply insert faker.js functions into the inputs. E.g. faker.name.findName() <br>docs can be found here: <a href="https://github.com/marak/Faker.js/">https://github.com/marak/Faker.js</a></small>
          </div>
        </div>
        <collapse v-if="currentModel && id" :id="id" :data="currentModel" :title="id" :index="0" :is-sub-child="false" />
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

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import collapse from '@/components/RecursiveCollapse.vue';
import quicktypeModel from '@/components/QuicktypeModel.vue';
import { BaseResponseDTO, BaseDTO } from '@/types';

@Component({
  components: {
    collapse,
    quicktypeModel
  }
})
export default class Entry extends Vue {
  @Prop({ type: String, required: true }) readonly type!: string;
  @Prop({ type: String, required: true }) readonly id!: string;

  private loading = false;
  private dataContent!: BaseResponseDTO;
  private changesNotSaved = true;

  get entry (): BaseDTO {
    return this.$store.state[this.type] ? this.$store.state[this.type][this.id] : null;
  }

  get currentModel (): BaseDTO {
    return this.$store.getters.getCurrentModel;
  }

  @Watch('entry')
  onDataChange (): void {
    this.setModel();
  }

  setModel () {
    this.$store.dispatch('setModel', this.entry);
  };

  async save () {
    this.loading = true;
    try {
      await this.$store.dispatch('saveData', {
        type: this.type,
        id: this.id
      }).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Your model changes was saved!',
          type: 'success'
        });
      });
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(ex);
      this.$notify({
        title: 'Warning',
        message: 'An error happened. Please check the console',
        type: 'warning'
      });
    } finally {
      this.loading = false;
    }
  };

  saveAndGenerate () {
    // this.save();
    this.$store.dispatch('saveAndGenerate', {
      id: this.id
    });
    // var myjson = JSON.stringify(this.dataContent, null, 2);
    // var x = window.open();
    // x.document.open();
    // x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
    // x.document.close();
    this.changesNotSaved = false;
  }
}
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
