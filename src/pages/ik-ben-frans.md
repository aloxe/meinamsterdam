---
layout: liste
eleventyComputed:
    title: '{{ categories[2].title }}'
    categorie: '{{ categories[2].name }}'
pagination:
  data: collections.ik-ben-frans
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