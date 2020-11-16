<template>
  <el-dialog
    width="70%"
    title="Preview"
    :visible="dialogVisible"
    @close="$emit('close')"
  >
    <highlight class="m0" :code="json" language="json" />

    <span slot="footer">
      <el-button @click="$emit('close')">Close</el-button>
      <el-button type="primary" @click.prevent="copy">Copy</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Highlight from 'vue-highlight-component';

@Component({
  components: {
    Highlight
  }
})
export default class PreviewModal extends Vue {
  @Prop({ type: Boolean, required: true }) readonly dialogVisible!: boolean;
  @Prop({ type: String, required: true }) readonly json!: string;

  copy () {
    const newClip = this.json;
    navigator.permissions.query({ name: 'clipboard-write' as PermissionName }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(newClip).then(() => {
          this.$notify({
            title: 'Copied to clipboard ✌️',
            message: '',
            type: 'success'
          });
          this.$emit('close');
        });
      }
    });
  };
};
</script>

<style lang="scss">
.el-dialog__body {
  padding: 0 20px!important;
  max-height: 60vh;
  overflow: auto;
}
</style>
