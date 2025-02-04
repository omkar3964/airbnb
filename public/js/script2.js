let taxSwitch = document.getElementById('flexSwitchCheckDefault');
taxSwitch.addEventListener('click', () => {
  let taxInfo = document.getElementsByClassName('tax-info');
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
})

// filter logic
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.querySelectorAll('.filter');
  const listings = document.querySelectorAll('.listing-link');
  const selectedCategories = new Set();

  filters.forEach(filter => {
    filter.addEventListener('click', function () {
      const category = filter.querySelector('p').textContent.trim();

      if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        filter.classList.remove('active');
      } else {
        selectedCategories.add(category);
        filter.classList.add('active');
      }

      filterListings();
    });
  });

  function filterListings() {
    listings.forEach(listing => {
      const listingCategory = listing.getAttribute('data-category');

      if (selectedCategories.size === 0 || selectedCategories.has(listingCategory)) {
        listing.style.display = 'block';
      } else {
        listing.style.display = 'none';
      }
    });
  }
});
