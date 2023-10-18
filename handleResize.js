function handleResize() {
  const width = window.innerWidth;
  const containerFeaturesWidget = document.getElementById(
    "container-features-widget"
  );

  /* Move the features widget div from shell panel to bottom panel v.v. */
  if (width < 768 && containerFeaturesWidget) {
    const calcitePanelBottom = document.getElementById("panel-bottom");
    calcitePanelBottom.appendChild(containerFeaturesWidget);
  } else {
    const calcitePanelLeft = document.getElementById("block-features-widget");
    calcitePanelLeft.appendChild(containerFeaturesWidget);
  }
  //
  // Toggle the navigation action in mobile view
  //
  const calciteNavigationComponent =
    document.querySelector("calcite-navigation");
  calciteNavigationComponent.navigationAction = width < 768;

  //
  // Reposition the value picker
  //
  const valuePickerElement = document.getElementById(
    "container-value-picker-widget"
  );

  //
  // Reposition the chip group on resize
  //
  //const chipGroupElement = document.getElementById("chip-group-layers");
  const mapElement = document.getElementById("viewDiv");
  console.log(mapElement.clientWidth);
  valuePickerElement.style.right = `${
    mapElement.clientWidth / 2 - valuePickerElement.clientWidth / 2
  }px`;

  // chipGroupElement.style.right = `${
  //   mapElement.clientWidth / 2 - chipGroupElement.clientWidth / 2
  // }px`;
}
addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    handleResize();
  }, 2000);
});
window.addEventListener("resize", handleResize);

/* Open the Calcite Sheet with the navigation action */
const navigation = document.querySelector(
  "calcite-navigation#primary-navigation"
);
const sheet = document.querySelector("calcite-sheet");
navigation?.addEventListener("calciteNavigationActionSelect", function () {
  sheet.open = true;
});

/* Closing the sheet in the panel button */
const panel = document.getElementById("sheet-panel-bookmarks");
panel?.addEventListener("calcitePanelClose", function () {
  sheet.open = false;
});
