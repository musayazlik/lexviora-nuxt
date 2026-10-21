<script setup lang="ts">
const { locale } = useContentLanguage();
const copy = usePublicCopy();
const { data: items } = await usePublicContent('glossary');
const query = ref('');
const filtered = computed(() =>
  items.value.filter((i) =>
    `${i.term} ${i.definition}`
      .toLocaleLowerCase(locale.value)
      .includes(query.value.toLocaleLowerCase(locale.value)),
  ),
);
</script>
<template>
  <div>
    <label class="sr-only" for="term-search">{{ copy.searchTerms }}</label
    ><input
      id="term-search"
      v-model="query"
      class="public-search-input"
      type="search"
      :placeholder="copy.searchTerms"
    />
    <p class="search-status" role="status">{{ filtered.length }} {{ copy.terms }}</p>
    <dl class="glossary-list">
      <div v-for="item in filtered" :key="item.id" data-term>
        <dt>
          <h2>{{ item.term }}</h2>
        </dt>
        <dd>{{ item.definition }}</dd>
      </div>
    </dl>
  </div>
</template>
