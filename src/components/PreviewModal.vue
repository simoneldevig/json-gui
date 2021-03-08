<template>
  <MazDialog
    v-model="dialogVisible"
    width="70%"
    title="Preview"
    class="preview-modal"
    @close="$emit('close')"
  >
    <highlight class="m-0 preview-modal__content" :code="json" language="json" />

    <span slot="footer">
      <MazBtn rounded size="sm" color="grey" class="mr-2" @click="$emit('close')">Close</MazBtn>
      <MazBtn rounded size="sm" @click.prevent="copy">Copy</MazBtn>
    </span>
  </MazDialog>
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
            text: '',
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
.preview-modal {
  &__content {
    max-height: 60vh;
    overflow: auto;
  }
}
</style>
