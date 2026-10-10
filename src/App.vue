<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GENUS } from '@/builders/types'
import { categories, generateNames } from '@/generator/categories'
import { flavors, type Flavor, type GenerationOptions } from '@/generator/options'
import { CORPORATION_SIZE } from '@/patterns/cyberpunk/corporations/helpers'
import type { Generated } from '@/patterns/types'

const flavor = ref<Flavor>('cyberpunk')
const categoryId = ref('runners')
const availableCategories = computed(() => categories.filter((item) => !item.requiresFlavor || flavor.value !== 'cyberpunk'))
watch(flavor, () => {
  if (!availableCategories.value.some((item) => item.id === categoryId.value)) categoryId.value = 'corporations'
})
const category = computed(() => categories.find((item) => item.id === categoryId.value))
const groups = [...new Set(categories.map((item) => item.group))]
const count = ref(10)
const genus = ref<GENUS | ''>('')
const corporationSize = ref<CORPORATION_SIZE | ''>('')
const results = ref<Generated[]>([])
const error = ref('')
const busy = ref(false)

async function generate(append = false) {
  busy.value = true
  error.value = ''
  const options: GenerationOptions = {
    flavor: flavor.value,
    genus: genus.value || undefined,
    corporationSize: corporationSize.value || undefined,
  }
  try {
    const generated = await generateNames(categoryId.value, count.value, options)
    results.value = append ? [...results.value, ...generated] : generated
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not generate names.'
  } finally {
    busy.value = false
  }
}

// Keep every displayed batch consistent with the selected category and settings.
watch(
  [flavor, categoryId, genus, corporationSize],
  () => {
    results.value = []
    error.value = ''
  },
  { deep: true },
)
</script>

<template>
  <main>
    <h1>Cyberpunk name generator</h1>
    <form @submit.prevent="generate()">
      <p>
        <label for="flavor">Flavor </label>
        <select id="flavor" v-model="flavor">
          <option v-for="item in flavors" :key="item.id" :value="item.id">{{ item.label }}</option>
        </select>
      </p>
      <p>
        <label for="category">Category </label>
        <select id="category" v-model="categoryId">
          <optgroup v-for="group in groups" :key="group" :label="group">
            <option
              v-for="item in availableCategories.filter((item) => item.group === group)"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }}
            </option>
          </optgroup>
        </select>
      </p>
      <p v-if="category?.gender">
        <label for="gender">Given names </label>
        <select id="gender" v-model="genus">
          <option value="">Any</option>
          <option :value="GENUS.M">Masculine</option>
          <option :value="GENUS.F">Feminine</option>
        </select>
      </p>
      <p v-if="category?.corporationSize">
        <label for="size">Corporation size </label>
        <select id="size" v-model="corporationSize">
          <option value="">Any</option>
          <option :value="CORPORATION_SIZE.A">Minor</option>
          <option :value="CORPORATION_SIZE.AA">Large (AA)</option>
          <option :value="CORPORATION_SIZE.AAA">Mega (AAA)</option>
        </select>
      </p>
      <p>
        <label for="count">Number of names </label>
        <input id="count" v-model.number="count" type="number" min="1" max="100" required />
      </p>
      <button type="submit" :disabled="busy">Generate</button>
      <button v-if="results.length" type="button" :disabled="busy" @click="generate(true)">
        Generate more
      </button>
    </form>
    <p v-if="error" role="alert">{{ error }}</p>
    <section aria-label="Generated names" aria-live="polite" :aria-busy="busy">
      <ol>
        <li v-for="(result, index) in results" :key="index">
          <strong>{{ result.primary }}</strong>
          <div v-if="result.title">{{ result.title }}</div>
          <div v-if="result.age">{{ result.age }}</div>
          <div v-if="result.appearance">{{ result.appearance }}</div>
          <div v-if="result.details">{{ result.details }}</div>
          <div v-if="result.rating !== undefined">Rating: {{ result.rating.toFixed(1) }} / 5</div>
        </li>
      </ol>
    </section>
  </main>
</template>
