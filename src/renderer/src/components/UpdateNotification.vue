<script setup lang="ts">
import { computed } from 'vue'
import IconCheck from '~icons/material-symbols/check-rounded'
import IconChevronRight from '~icons/material-symbols/chevron-right-rounded'
import IconDownload from '~icons/material-symbols/download-rounded'
import IconError from '~icons/material-symbols/error-outline-rounded'
import IconInfo from '~icons/material-symbols/info-rounded'
import IconRefresh from '~icons/material-symbols/refresh-rounded'
import type { AppUpdateState } from '../../../shared/types'
import { formatReleaseNotes } from '../release-notes'

const props = withDefaults(defineProps<{ state: AppUpdateState; mode?: 'pill' | 'panel' }>(), {
  mode: 'pill'
})
const emit = defineEmits<{
  open: []
  check: []
  download: []
  install: []
}>()

const title = computed(() => {
  switch (props.state.status) {
    case 'checking': return 'Checking for updates'
    case 'available': return `Bronom ${props.state.availableVersion ?? ''} is available`
    case 'downloading': return 'Downloading update'
    case 'downloaded': return 'Update ready to install'
    case 'installing': return 'Installing update'
    case 'up-to-date': return 'Bronom is up to date'
    case 'error':
    case 'install-error': return 'Update needs attention'
    case 'disabled': return 'Updates unavailable'
    default: return 'Software updates'
  }
})

const description = computed(() => {
  switch (props.state.status) {
    case 'checking': return 'Looking for a newer Bronom release…'
    case 'available': return `Bronom ${props.state.availableVersion ?? ''} is ready to download.`
    case 'downloading': return `Downloading Bronom ${props.state.availableVersion ?? ''}…`
    case 'downloaded': return `Bronom ${props.state.availableVersion ?? ''} will restart after installation.`
    case 'installing': return props.state.message || 'Bronom will restart automatically when installation finishes.'
    case 'up-to-date': return `You are using the latest version (${props.state.currentVersion}).`
    case 'error':
    case 'install-error': return props.state.message || 'The update could not be completed.'
    case 'disabled': return props.state.message || 'Updates are unavailable for this build.'
    default: return `Current version: ${props.state.currentVersion}`
  }
})

const busy = computed(() => props.state.status === 'checking' || props.state.status === 'downloading' || props.state.status === 'installing')
const formattedReleaseNotes = computed(() => props.state.releaseNotes ? formatReleaseNotes(props.state.releaseNotes) : '')

const pillLabel = computed(() => {
  switch (props.state.status) {
    case 'available': return `Version ${props.state.availableVersion ?? ''} available`
    case 'downloading': return `Downloading ${Math.round(props.state.percent ?? 0)}%`
    case 'downloaded': return 'Restart to update'
    case 'installing': return 'Installing update'
    case 'up-to-date': return 'Bronom is up to date'
    case 'error':
    case 'install-error': return 'Update needs attention'
    case 'disabled': return 'Updates unavailable'
    default: return 'Checking for updates'
  }
})
</script>

<template>
  <button
    v-if="mode === 'pill'"
    class="update-status-pill"
    :class="state.status"
    type="button"
    aria-live="polite"
    :aria-label="`Open software updates: ${pillLabel}`"
    title="Open Software updates"
    @click="emit('open')"
  >
    <span class="update-status-icon" :class="{ busy, error: state.status === 'error' || state.status === 'install-error' }" aria-hidden="true">
      <IconCheck v-if="state.status === 'up-to-date'" />
      <IconDownload v-else-if="state.status === 'available'" />
      <IconRefresh v-else-if="state.status === 'downloaded'" />
      <IconError v-else-if="state.status === 'error' || state.status === 'install-error'" />
      <IconInfo v-else-if="state.status === 'disabled'" />
    </span>
    <span class="update-status-label">{{ pillLabel }}</span>
    <IconChevronRight class="update-status-chevron" aria-hidden="true" />
  </button>

  <section v-else class="update-status-card" :class="state.status" aria-live="polite" aria-label="Software update status">
    <div class="update-status-card-heading">
      <span class="update-status-card-icon" :class="{ busy, error: state.status === 'error' || state.status === 'install-error' }" aria-hidden="true">
        <IconCheck v-if="state.status === 'up-to-date'" />
        <IconDownload v-else-if="state.status === 'available'" />
        <IconRefresh v-else-if="state.status === 'downloaded'" />
        <IconError v-else-if="state.status === 'error' || state.status === 'install-error'" />
        <IconInfo v-else-if="state.status === 'disabled'" />
      </span>
      <div>
        <strong>{{ title }}</strong>
        <p>{{ description }}</p>
      </div>
    </div>
    <div v-if="state.status === 'downloading'" class="update-progress" aria-label="Download progress">
      <span :style="{ width: `${Math.min(100, Math.max(0, state.percent ?? 0))}%` }" />
    </div>
    <div
      v-if="formattedReleaseNotes && (state.status === 'available' || state.status === 'downloaded')"
      class="release-notes"
      aria-label="Release notes"
      v-html="formattedReleaseNotes"
    />
    <div class="update-status-card-actions">
      <button
        v-if="state.status === 'up-to-date' || state.status === 'disabled' || state.status === 'error'"
        class="secondary-button"
        type="button"
        @click="emit('check')"
      >
        {{ state.status === 'error' ? 'Try again' : 'Check again' }}
      </button>
      <button v-if="state.status === 'available'" class="primary-button" type="button" @click="emit('download')">
        Download update
      </button>
      <button v-if="state.status === 'downloaded'" class="primary-button" type="button" @click="emit('install')">
        Install and restart
      </button>
      <button v-if="state.status === 'install-error'" class="primary-button" type="button" @click="emit('install')">
        Try installation again
      </button>
    </div>
  </section>
</template>
