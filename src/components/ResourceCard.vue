&lt;template&gt;
  &lt;div class="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"&gt;
    &lt;div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white"&gt;
      &lt;component 
        :is="iconComponent" 
        class="h-6 w-6"
      /&gt;
    &lt;/div&gt;
    &lt;h3 class="mt-4 text-lg font-semibold leading-7 text-gray-900"&gt;{{ resource.title }}&lt;/h3&gt;
    &lt;p class="mt-2 text-base leading-7 text-gray-600"&gt;{{ resource.description }}&lt;/p&gt;
    &lt;button
      @click="$emit('download', resource)"
      class="mt-6 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    &gt;
      Download PDF
      &lt;svg class="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"&gt;
        &lt;path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /&gt;
      &lt;/svg&gt;
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
import { defineComponent, computed } from 'vue';
import {
  PresentationChartIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline';

export default defineComponent({
  name: 'ResourceCard',
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const iconMap = {
      'presentation-chart': PresentationChartIcon,
      'book-open': BookOpenIcon,
      'academic-cap': AcademicCapIcon
    };

    const iconComponent = computed(() => iconMap[props.resource.icon]);

    return {
      iconComponent
    };
  }
});
&lt;/script&gt;
