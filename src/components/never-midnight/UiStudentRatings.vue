<script setup lang="ts">
import {
  means,
  disciplines,
  createStudentSheet,
  type StudentSheet,
} from '@/data/characters/never-midnight'
import UiSheetCard from '@/components/ui/UiSheetCard.vue'
import UiSheetField from '@/components/ui/UiSheetField.vue'
import UiShadeRating from '@/components/ui/UiShadeRating.vue'
defineProps<{ locked: boolean }>()
const sheet = defineModel<StudentSheet>({ required: true })
function setSubdomain(discipline: keyof StudentSheet['subdomains'], text: string) {
  sheet.value.subdomains ??= createStudentSheet().subdomains
  sheet.value.subdomains[discipline] = text
}
</script>

<template>
  <UiSheetCard title="Means" heading-id="means-heading">
    <div v-for="name in means" :key="name" class="rating-row">
      <span class="rating-name">{{ name }}</span>
      <UiShadeRating v-model="sheet.means[name]" :label="name" :disabled="locked" />
    </div>
  </UiSheetCard>
  <UiSheetCard title="Disciplines" heading-id="disciplines-heading">
    <div v-for="discipline in disciplines" :key="discipline.name" class="rating-row discipline-row">
      <div class="discipline-title">
        <span class="rating-name">{{ discipline.name }}</span>
        <div class="discipline-subdomains">
          <small>{{ discipline.type }}</small>
          <UiSheetField
            :id="`subdomains-${discipline.name.toLowerCase()}`"
            class="subdomain-field"
            compact
            :disabled="locked"
            :model-value="sheet.subdomains?.[discipline.name] ?? ''"
            :aria-label="`${discipline.name} subdomains`"
            @update:model-value="setSubdomain(discipline.name, $event)"
          />
        </div>
      </div>
      <UiShadeRating
        v-model="sheet.disciplines[discipline.name]"
        :label="discipline.name"
        :disabled="locked"
      />
    </div>
  </UiSheetCard>
</template>

<style scoped>
.rating-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2);
  padding-block: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}
.discipline-row {
  row-gap: var(--space-1);
  border-bottom: 0;
}
.discipline-title {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}
.rating-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.2;
}
.discipline-title small {
  white-space: nowrap;
}
.discipline-subdomains {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  min-width: 0;
}
.subdomain-field {
  flex: 1;
  width: 0;
}
@media (min-width: 36rem) {
  .rating-name {
    font-size: 1.125rem;
  }
}
.rating-row:last-child {
  border-bottom: 0;
}
small {
  display: block;
  color: var(--color-muted);
  font-size: var(--font-small-control-size);
}
</style>
