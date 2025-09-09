---
layout: liste
eleventyExcludeFromCollections: true
eleventyComputed:
  title: 'Mot clé : {{ revueTags.tag }}'
  permalink: /{{ revueTags.subPagination.pageHref }}
pagination:
  data: collections.tags
  size: 1
  alias: revueTags
---

Les articles étiquetés {{ revueTags.tag }}