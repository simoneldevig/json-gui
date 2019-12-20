<template>
  <div class="mb2">
    <p v-show="!editPropertyName" class="mt0 mb1"><strong>{{ propertyName }}</strong><i class="ml1 el-icon-edit" @click="editPropName" /></p>
    <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="parseToParent" @blur="editPropertyName = false" />
    <el-switch
      v-model="inputValue"
      active-text="true"
      inactive-text="false"
      @change="parseToParent"
    />
  </div>
</template>

<script>
export default {
  name: 'BooleanInput',
  props: {
    value: {
      requirred: true,
      type: Boolean
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
    this.inputValue = this.value;
    this.newPropertyName = this.propertyName;
  },
  methods: {
    parseToParent () {
      this.$emit('value-changed', {propertyName: this.newPropertyName, oldPropertyName: this.propertyName, value: this.inputValue});
    },
    editPropName () {
      this.editPropertyName = !this.editPropertyName;
      this.$nextTick(() => {
        this.$refs.propertyName.focus();
      });
    }
  }
};
</script>
