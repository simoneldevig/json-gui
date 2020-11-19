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

    <el-row class="fixed bottom-0 left-0 z2 entry__save py1">
      <el-col :offset="4" :span="14">
        <div class="flex items-center justify-end">
          <div class="mr2">
            <el-button class="mr1" :loading="loading" type="default" round @click="preview">Preview</el-button>
            <el-button class="mr1" :loading="loading" type="primary" round @click="save">Save</el-button>
            <el-button class="mr3" :loading="loading" type="success" round @click="saveAndGenerate">Save and generate</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <previewModal v-if="previewData" :json="previewData" :dialog-visible="showPreviewDialog" @close="closePreview" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import collapse from '@/components/RecursiveCollapse.vue';
import quicktypeModel from '@/components/QuicktypeModel.vue';
import previewModal from '@/components/PreviewModal.vue';
import { BaseResponseDTO, BaseDTO } from '@/types';
import { generateFakerValues } from '@/services/faker';

@Component({
  components: {
    collapse,
    quicktypeModel,
    previewModal
  }
})
export default class Entry extends Vue {
  @Prop({ type: String, required: true }) readonly type!: string;
  @Prop({ type: String, required: true }) readonly id!: string;

  private loading = false;
  private dataContent!: BaseResponseDTO;
  private previewData: any = null;
  private showPreviewDialog = false;
  $lodash: any;

  get entry (): BaseDTO {
    return this.$store.state[this.type] ? this.$store.state[this.type][this.id] : null;
  }

  get currentModel (): BaseDTO {
    return this.$store.getters.getCurrentModel;
  }

  @Watch('entry', { deep: true, immediate: true })
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
      type: 'db',
      id: this.id
    });
  };

  preview () {
    let clonedObject = this.$lodash.cloneDeep(this.currentModel);
    clonedObject = generateFakerValues(clonedObject, clonedObject.timesToRepeat);
    this.previewData = JSON.stringify(clonedObject, null, 2);
    this.showPreviewDialog = true;
  }

  closePreview () {
    this.showPreviewDialog = false;
  }
}
</script>

<style lang="scss">
  .entry__save {
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
