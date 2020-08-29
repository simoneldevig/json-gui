<template>
<div class="mb1 flex justify-between items-center">
  <div>
    <p v-show="!editPropertyName" class="mt0 mb0"><strong>{{ propertyName }}</strong></p>
    <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="updateModel" @blur="editPropertyName = false" />
  </div>
  <div class="property__actions">
    <el-button v-if="hideEdit" class="ml1 property__actions--btn" type="primary" plain size="mini" icon="el-icon-edit" circle @click="editPropName" />
    <el-button class="ml1 property__actions--btn" type="primary" plain size="mini" icon="el-icon-delete" circle @click="deleteProp" />
  </div>
</div>
</template>

<script>
  export default {
    name: 'propertyEditor',
    props: {
      model: {
        default () {
          return {};
        },
        requirred: true,
        type: Object
      },
      propertyName: {
        default: '',
        requirred: true,
        type: String
      },
      hideEdit: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {
        editPropertyName: false,
        newPropertyName: ''
      }
    },
    created () {
      this.newPropertyName = this.propertyName;
    },
    methods: {
      editPropName () {
        this.editPropertyName = !this.editPropertyName;
        this.$nextTick(() => {
          this.$refs.propertyName.focus();
        });
      },
      updateModel () {
        this.$store.dispatch('updateModelProperty', {
          propertyName: this.newPropertyName,
          oldPropertyName: this.propertyName, 
          value: this.model
        });
      },
      deleteProp () {
        this.$store.dispatch('deleteModelProperty', {
          id: this.model.id
        });
      }
    }
  }
</script>
