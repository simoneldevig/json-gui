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
        <collapse v-if="entry[id] && entry[id] !== 'models'" :id="id" :data="entry[id]" :title="id" :index="0" :is-sub-child="false" @updateData="updateData" />
      </el-col>

      <el-col :span="8">
        <h1 class="mt2">Model</h1>
        <el-button-group class="mt2">
          <el-button type="default" size="small" @click="selectedModelType = 'csharp'">C#</el-button>
          <el-button type="default" size="small" @click="selectedModelType = 'typescript'">TypeScript</el-button>
        </el-button-group>

        <el-card class="p0" :body-style="{ padding: '0' }">
          <highlight class="m0" :code="entryModel ":language="selectedModelType" />
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
import hljs from 'highlight.js';
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
      type: String
    }
  },
  data () {
    return {
      loading: false,
      dataContent: null,
      changesNotSaved: false,
      entryModel: null,
      entryModels: null,
      selectedModelType: 'csharp'
    };
  },
  computed: {
    entry () {
      return this.$store.state.models;
    },
  },
  watch: {
    entry () {
      this.setEntryModels();
    },
    entryModels () {
      this.generateModels();
    },
    selectedModelType () {
      this.generateModels();
    }
  },
  methods: {
    remapValues (obj) {
      if (typeof obj === 'object') {
        // console.log(obj);
        for (let key in obj) {
          if (key === 'timesToRepeat') {
            delete obj[key];
          } else {
            if (obj[key].type === 'array') {
              let remappedValues = this.remapValues(obj[key].value);
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
    async generateModels () {
      if (this.entryModels) {
        const jsonString =  JSON.stringify(this.entryModels);
        const modelSettings = {
          csharp: {
            features: 'attributes-only',
            'no-combine-classes': 'true',
          },
          typescript: {
            'just-types': 'true',
          }
        };

        const { lines: csharpModel } = await this.quicktypeJSON(
          this.selectedModelType,
          "Post",
          modelSettings[this.selectedModelType],
          jsonString
        );
    
        this.entryModel = csharpModel.join("\n");
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
    setEntryModels () {
      const clonedObject = this.$lodash.cloneDeep(this.entry[this.id]);
      const remapedValues = this.remapValues(clonedObject);
      this.entryModels = remapedValues;
    },
    save () {
      console.log('saaave');
    },
    saveAndGenerate () {
      var myjson = JSON.stringify(this.dataContent, null, 2);
      var x = window.open();
      x.document.open();
      x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
      x.document.close();
      this.changesNotSaved = false;
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
  }
</style>
<style src="highlight.js/styles/monokai-sublime.css"></style>
