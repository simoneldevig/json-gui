<template>
  <div class="mb2">
    <p class="text-capitalize mt0 mb0"><strong>{{propertyName}}</strong></p>
    <el-switch
      v-model="inputValue"
      active-text="true"
      inactive-text="false"
      @change="parseToParent">
    </el-switch>
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
      },
      parentIndex: {
        requirred: true,
        type: Number
      }
    },
    data () {
      return {
        inputValue: ''
      };
    },
    created () {
      this.inputValue = this.value;
    },
    methods: {
      parseToParent () {
        this.$emit('value-changed', {propertyName: this.propertyName, value: this.inputValue, parentIndex: this.parentIndex})
      }
    }
  }
</script>