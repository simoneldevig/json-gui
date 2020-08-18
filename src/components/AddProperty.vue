<template>
  <el-popover v-model="isVisible" placement="bottom" width="400" @after-enter="setFocus">
    <p class="mt0 mb1"><strong>Property name?</strong></p>
    <el-input v-if="isVisible" ref="newPropField" v-model="propertyName" class="mb2" size="small" @keyup.enter.native="isVisible = false, addProperty(type)" />

    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="isVisible = false">Cancel</el-button>
      <el-button type="primary" size="mini" @click="isVisible = false, addProperty(type)">Add</el-button>
    </div>
    <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">{{ typeDisplayName }}</el-button>
  </el-popover>
</template>
    
<script>
export default {
  name: 'AddProperty',	
  props: {
    type: {
      default: '',
      requirred: true,
      type: String
    }
  },
  data () {
    return {
      propertyName: '',
      isVisible: false
    };
  },
  computed: {
    typeDisplayName () {
      return this.type.toLowerCase().charAt(0).toUpperCase() + this.type.toLowerCase().slice(1);
    }
  },
  created () {
    
  },
  methods: {
    addProperty () {
      this.$emit('addProperty', this.type, this.propertyName);
      this.propertyName = '';
    },
    setFocus () {
      this.$refs.newPropField.focus();
    }
  }
}
</script>
