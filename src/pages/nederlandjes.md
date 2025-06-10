---
layout: liste
eleventyComputed:
    title: '{{ categories[0].title }} - {{ meta.title }}'
    categorie: '{{ categories[0].name }}'
pagination:
  data: collections.nederlandjes
  size: 12
  alias: revue
---
<!--
infortunatly, this is not easy to create a double pagination such as 
pagination:
  data: categories
  pagination:
    data: collections[categorie]
see: https://github.com/11ty/eleventy/issues/332
https://benwhite.com.au/blog/nested-pagination/
-->