// get the nav control btn
const navBtn = document.getElementById('nav-burger-btn');
// get all the drop down togglers
const dropdownTogglers = document.querySelectorAll('.dropdown-toggler');



// event listeners
const initEventlisteners = () => {
  // for the nav collapse in small screens
  navBtn.addEventListener('click', toggleCollapseVisibility);
  // for the drop downs to the right of the nav bar
  dropdownTogglers.forEach(dropdownToggler => {
    dropdownToggler.addEventListener('click', toggleDropdownVisibilty);
  })
  // click event on document
  document.addEventListener('click', handleClickOnPage);
  // scroll event on the window
  window.addEventListener('scroll', handlePageScroll)
}

// functions
//toggle collapse visibility
const toggleCollapseVisibility = (e) => {
  // get the collapse section
  const collapse = document.querySelector('.small-screen-collapse');
  collapse.classList.toggle('collapsed');
}

// toggle the dropdown visibility
const  toggleDropdownVisibilty = e => {
  // get the dropdown element
  const dropdown = e.target.closest('.drop-down');
  // get the dropdown items
  const dropdownItem = dropdown.querySelector('.dropdown-items');

  dropdownItem.classList.toggle('hidden');
}

// handle page click
const handleClickOnPage = e => {
  const target = e.target;

  if (target.className.includes('dropdown-items')) {
    target.classList.add('hidden');
  }
}

// handle page scroll
const handlePageScroll = e => {
  const avatar = document.querySelector('.avatar');
  const distanceIntoPage = avatar.getBoundingClientRect().top + avatar.getBoundingClientRect().height

  // sticky tab bar user display
  const userDisplay = document.querySelector('.user-display');

  if (distanceIntoPage <= 0) {
    userDisplay.classList.add('show');
  }else {
    userDisplay.classList.remove('show');
  }
}
// run event listeners
initEventlisteners();