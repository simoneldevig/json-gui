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
        <collapse v-if="entry && entry !== 'models'" :id="id" :data="entry" :title="id" :index="0" :is-sub-child="false" @updateData="updateData" />
      </el-col>

      <el-col v-if="quicktypeModel" :span="8">
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
const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  JSONSchemaStore,
  cSharpOptions
} = require("quicktype-core");
import Highlight from 'vue-highlight-component';
export default {
  name: 'Entry',
  components: {
    collapse,
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
      loading: false,
      dataContent: null,
      changesNotSaved: false,
      cleanedModel: null,
      quicktypeModel: null,
      selectedModelType: 'csharp',
      showCopyTooltip: false
    };
  },
  computed: {
    entry () {
      return this.$store.state.models[this.id];
    },
  },
  watch: {
    entry () {
      this.generateQuicktypeModel();
    },
    selectedModelType () {
      this.generateQuicktypeModel();
    }
  },
  methods: {
    cleanModel (obj) {
      if (typeof obj === 'object') {
        // console.log(obj);
        for (const key in obj) {
          if (typeof (obj[key]) !== 'object') {
            delete obj[key];
          } else {
            if (obj[key].type === 'object' || obj[key].type === 'array') {
              const remappedValues = this.cleanModel(obj[key].value);
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
      const clonedObject = this.$lodash.cloneDeep(this.entry);
      const cleanModel = this.cleanModel(clonedObject);
      this.cleanedModel = cleanModel;
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

      // We could add multiple samples for the same desired
      // type, or many sources for other types. Here we're
      // just making one type from one piece of sample JSON.
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
    updateData (data) {
      this.dataContent = data;
      this.changesNotSaved = true;
    },
    save () {
      this.$store.dispatch('saveModel', {
        id: this.id,
        content: this.entry
      });
    },
    saveAndGenerate () {
      this.save();
      this.$store.dispatch('saveAndGenerate', {
        id: this.id,
        content: this.dataContent
      });
      // var myjson = JSON.stringify(this.dataContent, null, 2);
      // var x = window.open();
      // x.document.open();
      // x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
      // x.document.close();
      this.changesNotSaved = false;
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
