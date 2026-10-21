<script setup lang="ts">
const { locale } = useI18n();
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
    <label class="sr-only" for="term-search">{{
      locale === 'tr' ? 'Kavram ara' : 'Search terms'
    }}</label
    ><input
      id="term-search"
      v-model="query"
      class="public-search-input"
      type="search"
      :placeholder="locale === 'tr' ? 'Hukuki kavram ara…' : 'Search legal terms…'"
    />
    <p class="search-status" role="status">
      {{ filtered.length }} {{ locale === 'tr' ? 'kavram' : 'terms' }}
    </p>
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
