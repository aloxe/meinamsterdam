# me in Amsterdam


I first hosted it as a subsection of my personal site moved it on a dotclear blog engine. 
After [migration](https://alix.guillard.fr/notes/dotclear-to-eleventy/), It is now hosted on codeberg and is based on [🌬️ huwindty](https://aloxe.codeberg.page/huwindty/).

Most content is cc-by-sa Alix Guillard. Other works are credited online.

Huwindty is released under GPL 3.0

## deployment

Using github actions:

```
$ git fetch codeberg
$ git merge codeberg/main
$ git push
```
The [prod action](https://github.com/aloxe/meinamsterdam/actions) should start.