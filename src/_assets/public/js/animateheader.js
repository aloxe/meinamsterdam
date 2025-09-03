document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementsByTagName('nav')[0];
  const searchInput = document.getElementById('searchinput');
  const logo = nav.getElementsByTagName('img')[0];
  const link = nav.getElementsByTagName('a')[0];

  let compact = false;

  document.addEventListener("scroll", (event) => {
    const scrollPosition = window.scrollY;
    if (scrollPosition  > 100 && !compact) {
      compact = true;
      nav.classList.remove('border-b-4', 'h-32');
      nav.classList.add('border-b-1', 'h-14');
      searchInput.classList.remove('group-focus-within/search:mt-16'); // tailwind doesn't apply it when this used before the change
      logo.style.height = '48px';
      logo.style.width = '48px';
      link.classList.remove('text-3xl', 'md:text-4xl', 'ml-[-20px]', 'p-4');
      link.classList.add('text-2xl', 'p-1');

    }
    if (scrollPosition  < 10 && compact) {
      compact = false;
      nav.classList.add('border-b-4', 'h-32');
      nav.classList.remove('border-b-1', 'h-14');
      searchInput.classList.add('group-focus-within/search:mt-16'); // tailwind doesn't apply it when this used before the change
      logo.style.height = '72px';
      logo.style.width = '72px';
      link.classList.add('text-3xl', 'md:text-4xl', 'ml-[-20px]', 'p-4');
      link.classList.remove('text-2xl', 'p-1');
    }
  });
});

