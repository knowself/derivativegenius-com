<template>
  <div class="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300">
    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <component 
        :is="iconComponent" 
        class="h-6 w-6"
      />
    </div>
    <h3 class="mt-4 text-lg font-semibold leading-7 text-gray-900">{{ resource.title }}</h3>
    <p class="mt-2 text-sm leading-6 text-gray-600">{{ resource.description }}</p>
    <div class="mt-4 flex items-center gap-x-3">
      <button 
        @click="downloadResource"
        class="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <span>Download PDF</span>
        <i class="fas fa-download -mr-0.5 h-5 w-5"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { DocumentIcon, AcademicCapIcon, CogIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'ResourceCard',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const iconComponent = computed(() => {
      switch (props.resource.icon) {
        case 'document':
          return DocumentIcon;
        case 'academic':
          return AcademicCapIcon;
        case 'cog':
          return CogIcon;
        default:
          return DocumentIcon;
      }
    });

    const downloadResource = async () => {
      if (props.resource.downloadUrl) {
        window.open(props.resource.downloadUrl, '_blank');
      }
    };

    return {
      iconComponent,
      downloadResource
    };
  }
};
</script>
