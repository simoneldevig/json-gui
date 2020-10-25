<template>
  <div v-if="quicktypeModel">
    <h1 class="mt2">Model</h1>
    <el-button-group class="my1">
      <el-button :type="selectedModelType === 'csharp' ? 'primary' : 'default'" size="small" @click="selectedModelType = 'csharp'">C#</el-button>
      <el-button :type="selectedModelType === 'typescript' ? 'primary' : 'default'" size="small" @click="selectedModelType = 'typescript'">TypeScript</el-button>
    </el-button-group>

    <el-card class="p0 relative" :body-style="{ padding: '0' }">
      <el-tooltip v-model="showCopyTooltip" class="item" :manual="true" effect="dark" content="Copied!" placement="top-start">
        <el-button class="model__copy" icon="el-icon-document-copy" circle @click.prevent="copyModel" />
      </el-tooltip>

      <highlight class="m0" :code="quicktypeModel" :language="selectedModelType" />
    </el-card>
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
export default class QuickType extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string;

  private cleanedModel: any = null;
  private quicktypeModel: any = null;
  private selectedModelType = 'csharp';
  private showCopyTooltip = false;
  $lodash: any;

  get currentModel (): BaseDTO {
    return this.$store.getters.getCurrentModel ? this.$store.getters.getCurrentModel.value : {};
  };

  get models (): BaseResponseDTO {
    return this.$store.state.models;
  };

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
      for (const key in obj) {
        if (typeof (obj[key]) !== 'object') {
          delete obj[key];
        } else {
          if (obj[key].type === 'model') {
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
      }
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
          this.showCopyTooltip = true;

          setTimeout(() => {
            this.showCopyTooltip = false;
          }, 1000);
        });
      }
    });
  };
}
</script>
