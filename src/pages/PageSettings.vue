<template>
  <div>
    <el-row>
      <el-row class="mb3" :gutter="30">
        <el-col :span="12">
          <MazCard class="w-100" max-width="none">
            <h4 class="mb-3">Settings</h4>
            <MazInput
              v-model="settings.quicktypeNameSpace"
              placeholder="Quicktype namespace"
              autocomplete="Enter the namespace to use for generated models with Quicktype"
              class="mb-3"
              clearable
            />
            <div class="d-flex align-items-center">
              <span class="mr-3">Dark mode</span>
              <MazSwitch v-if="settings.darkMode" v-model="settings.darkMode" />
            </div>
            <div class="flex justify-end mt3">
              <MazBtn rounded size="sm" class="text-black" @click="save">
                Save
              </MazBtn>
            </div>
          </MazCard>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
  private settings = {
    quicktypenamespace: '',
    darkMode: true
  };

  @Watch('computedSettings', { deep: true, immediate: true })
  onSettingsChange (): void {
    this.settings = this.computedSettings;
  }

  get computedSettings (): any {
    return this.$store.state.settings;
  }

  save () {
    this.$store.dispatch('saveSettings', this.settings);
  }
}
</script>
