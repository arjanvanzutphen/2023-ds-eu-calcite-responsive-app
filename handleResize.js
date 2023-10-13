function handleResize() {
  const width = window.innerWidth;
  const containerFeaturesWidget = document.getElementById(
    "container-features-widget"
  );

  /* Move the features widget div from shell panel to bottom panel v.v. */
  if (width < 700 && containerFeaturesWidget) {
    const calcitePanelBottom = document.getElementById("panel-bottom");
    calcitePanelBottom.appendChild(containerFeaturesWidget);
  } else {
    const calcitePanelLeft = document.getElementById("panel-start");
    calcitePanelLeft.appendChild(containerFeaturesWidget);
  }
  //
  // Toggle the navigation action in mobile view
  //
  const calciteNavigationComponent =
    document.querySelector("calcite-navigation");
  calciteNavigationComponent.navigationAction = width < 700;

  //
  // Reposition the value picker on resize
  //
  const valuePickerElement = document.getElementById(
    "container-value-picker-widget"
  );
  const mapElement = document.getElementById("viewDiv");

  valuePickerElement.style.right = `${
    mapElement.clientWidth / 2 -
    (valuePickerElement.clientWidth === 0
      ? 450 / 2
      : valuePickerElement.clientWidth / 2)
  }px`;
}
addEventListener("DOMContentLoaded", (event) => {
  handleResize();
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
