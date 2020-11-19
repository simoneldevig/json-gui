<template>
  <div>
    <el-row>
      <h1>Dashboard</h1>
      <el-row class="mb3" :gutter="30">
        <el-col :span="12">
          <el-card>
            <template slot="header"><strong>Settings</strong></template>
            <span class="mb1 block"><strong>Quicktype namespace</strong></span>
            <el-input v-model="settings.quicktypeNameSpace" placeholder="Enter the namespace to use for generated models with Quicktype" />
            <div class="flex justify-end mt3">
              <el-button type="primary" round @click="save">Save</el-button>
            </div>
          </el-card>
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
    quicktypenamespace: ''
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
