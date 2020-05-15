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
    
<script>
import { quicktype, InputData, jsonInputForTargetLanguage } from "quicktype-core";
import Highlight from 'vue-highlight-component';

export default {
  name: 'QuickType',	
  components: {
    Highlight
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
      cleanedModel: null,
      quicktypeModel: null,
      selectedModelType: 'csharp',
      showCopyTooltip: false
    };
  },
  computed: {
    currentModel () {
      return this.$store.getters['getCurrentModel'][0] ? this.$store.getters['getCurrentModel'][0].value : {};
    }
  },
  watch: {
    currentModel: {
      handler: 'generateQuicktypeModel',
      deep: true,
      immediate: true
    },
    selectedModelType () {
      this.generateQuicktypeModel();
    }
  },
  methods: {
    cleanModel (obj) {
      if (typeof obj === 'object') {
        for (const key in obj) {
          if (typeof (obj[key]) !== 'object') {
            delete obj[key];
          } else {
            if (Array.isArray(obj[key]) && obj[key][0].type === 'object' || Array.isArray(obj[key]) && obj[key][0].type === 'array') {
              const remappedValues = this.cleanModel(obj[key][0].value);
              delete obj[key];
              obj[key] = remappedValues;
            }
  
            if (obj[key].type === 'string') {
              delete obj[key];
              obj[key] = "";
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
    },
    async generateQuicktypeModel () {
      const clonedObject = this.$lodash.cloneDeep(this.currentModel);
      this.cleanedModel = this.cleanModel(clonedObject);
      if (this.cleanedModel) {
        const jsonString =  JSON.stringify(this.cleanedModel);
        const modelSettings = {
          csharp: {
            features: 'attributes-only',
            'no-combine-classes': 'true',
          },
          typescript: {
            'just-types': 'true',
          }
        };
  
        const { lines: model } = await this.quicktypeJSON(
          this.selectedModelType,
          this.id,
          modelSettings[this.selectedModelType],
          jsonString
        );
      
        this.quicktypeModel = model.join("\n");
      }
    },
    async quicktypeJSON (targetLanguage, typeName, rendererOptions, jsonString) {
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
    },
    copyModel () {
      const newClip = this.quicktypeModel;
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state == 'granted' || result.state == 'prompt') {
          navigator.clipboard.writeText(newClip).then(() => {
            this.showCopyTooltip = true;

            setTimeout(() => {
              this.showCopyTooltip = false;
            }, 1000);
          });
        }
      });
    }
  }
};
</script>
