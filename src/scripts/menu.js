document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.sidebar-toggle').classList.toggle('sidebar-open');
  document.querySelector('.hamburger').classList.toggle('sidebar-open');
  localStorage.setItem("sidebarOpen", JSON.stringify(document.querySelector('.sidebar-toggle').classList.contains('sidebar-open')))
});

if(window.matchMedia("(min-width: 800px)").matches === true) {
  const isOpen = JSON.parse(localStorage.getItem("sidebarOpen"))
  if(isOpen) {
    document.querySelector('.hamburger').classList.toggle('sidebar-open');
    document.querySelector('.sidebar-toggle').classList.toggle('sidebar-open');
  }
}
