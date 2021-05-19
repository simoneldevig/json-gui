<template>
  <div>
    <div class="d-flex w-100">
      <div class="py-7 px-4 d-flex flex-grow-1 min-vh-100">
        <RecursiveCollapse v-if="currentModel && id" :id="id" class="w-100" :data="currentModel" :title="id" :is-sub-child="false" />
      </div>
      <PreviewModal v-if="previewData" :json="previewData" :dialog-visible="showPreviewDialog" @close="closePreview" />
      <MazSidebar right :width="500" class="entry__model">
        <QuicktypeModel :id="id" class="py-4 px-3" />
      </MazSidebar>
    </div>
    <div class="p-sticky entry__save py-2">
      <div class="w-100">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <span class="entry__breadcrumb">{{ $route.params.type }}</span>
            <span class="entry__breadcrumb">/</span>
            <span class="entry__breadcrumb">{{ $route.params.id }}</span>
          </div>
          <div class="pr-4">
            <MazBtn rounded size="sm" color="default" :loading="loading === 'preview'" @click="preview('preview')">Preview</MazBtn>
            <MazBtn class="ml-2" rounded size="sm" color="success" :loading="loading === 'save'" @click="save('save')">Save</MazBtn>
            <MazBtn v-if="isEndpoint" class="ml-2" rounded size="sm" color="primary" :loading="loading === 'savegen'" @click="saveAndGenerate('savegen')">Save and generate</MazBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import RecursiveCollapse from '@/components/RecursiveCollapse.vue';
import QuicktypeModel from '@/components/QuicktypeModel.vue';
import PreviewModal from '@/components/PreviewModal.vue';
import { BaseResponseDTO, BaseDTO } from '@/types';
import { generateFakerValues } from '@/services/faker';

@Component({
  components: {
    RecursiveCollapse,
    QuicktypeModel,
    PreviewModal
  }
})
export default class Entry extends Vue {
    @Prop({ type: String, required: true }) readonly type!: string;
    @Prop({ type: String, required: true }) readonly id!: string;

    private loading = '';
    private dataContent!: BaseResponseDTO;
    private previewData: any = null;
    private showPreviewDialog = false;
    $lodash: any;

    get isEndpoint (): boolean {
      return this.$route.params.type === 'endpoints';
    }

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

    async save (loadingState: string) {
      this.loading = loadingState;
      try {
        await this.$store.dispatch('saveData', {
          type: this.type,
          id: this.id
        }).then(() => {
          if (loadingState === 'save') {
            this.$notify({
              title: 'Success',
              text: 'Your model changes was saved!',
              type: 'success'
            });
          }
        });
      } catch (ex) {
        // eslint-disable-next-line no-console
        console.error(ex);
        this.$notify({
          title: 'Warning',
          text: 'An error happened. Please check the console',
          type: 'warning'
        });
      } finally {
        this.loading = '';
      }
    };

    async saveAndGenerate (loadingState: string) {
      this.loading = loadingState;

      try {
        await this.save(loadingState);
        await this.$store.dispatch('saveAndGenerate', {
          type: 'db',
          id: this.id
        }).then(() => {
          this.$notify({
            title: 'Success',
            text: 'Your endpoint has been generated!',
            type: 'success'
          });
        });
      } catch (ex) {
        // eslint-disable-next-line no-console
        console.error(ex);
        this.$notify({
          title: 'Warning',
          text: 'An error happened. Please check the console',
          type: 'warning'
        });
      } finally {
        this.loading = '';
      }
    };

    async preview (loadingState: string) {
      this.loading = loadingState;

      // Fix issue with loading state not being set
      setTimeout(async () => {
        let clonedObject = this.$lodash.cloneDeep(this.currentModel);
        clonedObject = await generateFakerValues(clonedObject, clonedObject.timesToRepeat);
        this.previewData = JSON.stringify(clonedObject, null, 2);
        this.loading = '';
        this.showPreviewDialog = true;
      }, 0);
    }

    closePreview () {
      this.showPreviewDialog = false;
    }
}
</script>

<style lang="scss">
.entry__model {
    z-index: 0;
}
.entry__save {
    width: 100%;
    background: var(--maz-bg-color);
    bottom: 0;
    color: var(--maz-placeholder-color);
}

.entry__breadcrumb {
    font-size: 14px;
    color: var(--maz-muted-color);
    padding: 0 3px;
    &:first-child {
        padding-left: 10px;
        text-transform: capitalize;
    }
}
</style>

<style src="highlight.js/styles/monokai-sublime.css">

</style>
