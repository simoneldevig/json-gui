<template>
  <div v-if="quicktypeModel" class="model">
    <MazBtnGroup
      v-model="selectedModelType"
      :items="items"
      outline
      size="mini"
      color="secondary"
      class="mb-3"
    />

    <div class="p-relative">
      <MazBtn class="model__copy" size="mini" color="light" fab @click.prevent="copyModel">
        <span class="model__copy-icon material-icons">content_copy</span>
      </MazBtn>

      <highlight class="m-0" :code="quicktypeModel" :language="selectedModelType" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { quicktype, InputData, jsonInputForTargetLanguage } from 'quicktype-core';
import Highlight from 'vue-highlight-component';
import { BaseDTO, BaseResponseDTO } from '@/types/';

@Component({
  components: {
    Highlight
  }
})
export default class QuicktypeModel extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string;

  private cleanedModel: any = null;
  private quicktypeModel: any = null;
  private selectedModelType = 'csharp';
  private showCopyTooltip = false;
  private items: any = [{ label: 'C#', value: 'csharp' }, { label: 'TypeScript', value: 'typescript' }];
  $lodash: any;

  get currentModel (): BaseDTO {
    return this.$store.getters.getCurrentModel ? this.$store.getters.getCurrentModel.value : {};
  };

  get models (): BaseResponseDTO {
    return this.$store.state.models;
  };

  get settings (): any {
    return this.$store.state.settings;
  }

  @Watch('currentModel', { deep: true, immediate: true })
  modelChanged (): void {
    this.generateQuicktypeModel();
  }

  @Watch('selectedModelType')
  modelTypeChanged (): void {
    this.generateQuicktypeModel();
  }

  cleanModel (obj: BaseDTO) {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (typeof (obj[key]) !== 'object') {
          delete obj[key];
        } else {
          if (obj[key].type === 'model' && obj[key].value) {
            const referencedModel = Vue.prototype.$lodash.cloneDeep(Object.values(this.models).find(x => x.id === obj[key].value));
            const remappedValues = this.cleanModel(referencedModel.value);
            delete obj[key];
            obj[key] = remappedValues;
          }

          if (obj[key].type === 'object' || obj[key].type === 'array') {
            const remappedValues = this.cleanModel(obj[key].value);
            delete obj[key];
            obj[key] = remappedValues;
          }

          if (obj[key].type === 'string') {
            delete obj[key];
            obj[key] = '';
          }

          if (obj[key].type === 'boolean') {
            delete obj[key];
            obj[key] = false;
          }

          if (obj[key].type === 'number') {
            delete obj[key];
            obj[key] = 0;
          }
        }
      });
    }
    return obj;
  };

  async generateQuicktypeModel () {
    const clonedObject = this.$lodash.cloneDeep(this.currentModel);
    this.cleanedModel = this.cleanModel(clonedObject);
    if (this.cleanedModel) {
      const jsonString = JSON.stringify(this.cleanedModel);
      const modelSettings: { [key: string]: any } = {
        csharp: {
          namespace: this.settings.quicktypeNameSpace,
          features: 'attributes-only',
          'no-combine-classes': 'true'
        },
        typescript: {
          'just-types': 'true'
        }
      };

      const { lines: model } = await this.quicktypeJSON(
        this.selectedModelType,
        this.id,
        modelSettings[this.selectedModelType],
        jsonString
      );

      this.quicktypeModel = model.join('\n');
    }
  };

  async quicktypeJSON (targetLanguage: string, typeName: string, rendererOptions: any, jsonString: string) {
    const jsonInput = jsonInputForTargetLanguage(targetLanguage);

    await jsonInput.addSource({
      name: typeName,
      samples: [jsonString]
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    return await quicktype({
      inputData,
      lang: targetLanguage,
      rendererOptions: rendererOptions
    });
  };

  copyModel () {
    const newClip = this.quicktypeModel;
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(newClip).then(() => {
          this.$notify({
            title: 'Copied to clipboard ✌️',
            text: '',
            type: 'success'
          });
        });
      }
    });
  };
}
</script>

<style lang="scss">
.model {
  .model__copy {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}

.hljs {
    padding: 20px !important;
    font-size: 14px;
}

</style>
