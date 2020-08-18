<template>
  <div class="mb2">
    <div class="mb1 flex justify-between items-center">
      <div>
        <p v-show="!editPropertyName" class="mt0 mb0"><strong>{{ propertyName }}</strong></p>
        <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @blur="editPropertyName = false" />
      </div>
      <div>
        <el-button class="ml1 property-action" type="primary" plain size="mini" icon="el-icon-edit" circle @click="editPropName" />
        <el-button class="ml1 property-action" type="primary" plain size="mini" icon="el-icon-delete" circle @click="deleteProp" />
      </div>
    </div>
    <el-radio v-model="objectModel.value" :value="true" :label="true" class="mr1" size="small" border @change="updateModel">true</el-radio>
    <el-radio v-model="objectModel.value" :value="false" :label="false" class="mr1" size="small" border @change="updateModel">false</el-radio>
    <el-radio v-model="objectModel.value" :value="'random'" :label="'random'" class="mr1" size="small" border @change="updateModel">random</el-radio>
  </div>
</template>

<script>
export default {
  name: 'BooleanInput',
  props: {
    model: {
      default: null,
      requirred: true,
      type: Object
    },
    propertyName: {
      default: null,
      requirred: true,
      type: String
    }
  },
  data () {
    return {
      newPropertyName: '',
      editPropertyName: false
    };
  },
  created () {
    this.objectModel = this.model;
    this.newPropertyName = this.propertyName;
  },
  methods: {
    updateModel () {
      this.$store.dispatch('updateModelProperty', {
        propertyName: this.newPropertyName,
        oldPropertyName: this.propertyName, 
        value: this.objectModel
      });
    },
    editPropName () {
      this.editPropertyName = true;
      this.$nextTick(() => {
        this.$refs.propertyName.focus();
      });
    },
    deleteProp () {
      this.$store.dispatch('deleteModelProperty', {
        id: this.model.id
      });
    }
  }
};
</script>
