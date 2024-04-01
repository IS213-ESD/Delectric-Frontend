const toggleDrawer = (drawerId) => {
  const drawerElement = document.getElementById(drawerId);
  if (drawerElement) {
    drawerElement.click();
  } else {
    console.error(`Element with ID ${drawerId} not found.`);
  }
};

export { toggleDrawer };
