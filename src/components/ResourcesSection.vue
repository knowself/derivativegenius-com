<template>
  <section id="resources" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Resources & Guides
        </h2>
        <p class="mt-4 text-lg leading-8 text-gray-600">
          Download our comprehensive guides to learn how AI automation can transform your business
        </p>
      </div>
      <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <ResourceCard 
          v-for="resource in resources" 
          :key="resource.id"
          :resource="resource"
          @download="handleDownload"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ResourceCard from './ResourceCard.vue';
import { ref } from 'vue';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

export default {
  name: 'ResourcesSection',
  components: {
    ResourceCard
  },
  setup() {
    const resources = ref([
      {
        id: 'executive-overview',
        title: 'Executive Overview',
        description: 'Learn how AI automation can transform your business operations and drive growth.',
        icon: 'presentation-chart',
        fileName: 'executive-overview.pdf'
      },
      {
        id: 'service-catalog',
        title: 'Service Catalog',
        description: 'Explore our comprehensive range of AI automation services and solutions.',
        icon: 'book-open',
        fileName: 'service-catalog.pdf'
      },
      {
        id: 'implementation-guide',
        title: 'Implementation Guide',
        description: 'Step-by-step guide to implementing AI automation in your business.',
        icon: 'academic-cap',
        fileName: 'implementation-guide.pdf'
      }
    ]);

    const handleDownload = async (resource) => {
      try {
        const storage = getStorage();
        const fileRef = storageRef(storage, `public/resources/pdfs/${resource.fileName}`);
        const downloadURL = await getDownloadURL(fileRef);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = resource.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
        // TODO: Add proper error handling/user notification
      }
    };

    return {
      resources,
      handleDownload
    };
  }
};
</script>
