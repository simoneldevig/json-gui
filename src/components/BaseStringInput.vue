<template>
  <div class="mb2">
    <div class="mb1 flex justify-between items-center">
      <div>
        <p v-show="!editPropertyName" class="mt0 mb0"><strong>{{ propertyName }}</strong></p>
        <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="parseToParent" @blur="editPropertyName = false" />
      </div>
      <div>
        <el-button class="ml1" type="warning" size="mini" icon="el-icon-edit" circle @click="editPropName" />
        <el-button class="ml1" type="danger" size="mini" icon="el-icon-delete" circle @click="deleteProp" />
      </div>
    </div>
    <el-input v-model="inputValue" ref="input" type="textarea" :autosize="{ minRows: 1}" @blur="parseToParent" />
  </div>
</template>

<script>
export default {
  name: 'BaseStringInput',
  props: {
    model: {
      requirred: true,
      type: Object
    },
    propertyName: {
      requirred: true,
      type: String
    }
  },
  data () {
    return {
      inputValue: '',
      newPropertyName: '',
      editPropertyName: false
    };
  },
  created () {
    this.inputValue = this.model.value;
    this.newPropertyName = this.propertyName;
  },
  methods: {
    parseToParent () {
      // this.$emit('value-changed', {propertyName: this.newPropertyName, oldPropertyName: this.propertyName, value: this.inputValue});
    },
    editPropName () {
      this.editPropertyName = !this.editPropertyName;
      this.$nextTick(() => {
        this.$refs.propertyName.focus();
      });
    },
    deleteProp () {
      this.$emit('delete-property', this.newPropertyName);
    }
  }
};
</script>
