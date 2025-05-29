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
      console.log("SHRINK" + scrollPosition);
      nav.classList.remove('border-b-4', 'h-32');
      nav.classList.add('border-b-1', 'h-14');
      searchInput.classList.remove('group-focus-within/search:mt-16');
      logo.style.height = '48px';
      logo.style.width = '48px';
      link.classList.remove('text-3xl', 'md:text-4xl', 'ml-[-20px]', 'p-4');
      link.classList.add('text-2xl', 'p-1');

    }
    if (scrollPosition  < 10 && compact) {
      compact = false;
      console.log("EXPAND");
      nav.classList.add('border-b-4', 'h-32');
      nav.classList.remove('border-b-1', 'h-14');
      searchInput.classList.add('group-focus-within/search:mt-16');
      logo.style.height = '72px';
      logo.style.width = '72px';
      link.classList.add('text-3xl', 'md:text-4xl', 'ml-[-20px]', 'p-4');
      link.classList.remove('text-2xl', 'p-1');
    }
  });
});


/*
$(document).ready(function() {
    $(window).scroll(function() {
	var height = $(window).scrollTop();
	if(height  > 100) {
            $('#top').addClass('shrink');
            $('#topmenu').addClass('shrink');
            $('#search').addClass('shrink');
            $('#navlinks').addClass('shrink');
	}
	if(height  < 10) {
            $('#top').removeClass('shrink');
            $('#topmenu').removeClass('shrink');
            $('#search').removeClass('shrink');
            $('#navlinks').removeClass('shrink');
	}
    });
});
*/
