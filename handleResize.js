function handleResize() {
  const width = window.innerWidth;
  const containerFeaturesWidget = document.getElementById(
    "container-features-widget"
  );

  if (width < 700 && containerFeaturesWidget) {
    const calcitePanelBottom = document.getElementById("panel-bottom");
    calcitePanelBottom.appendChild(containerFeaturesWidget);
  } else {
    const calcitePanelLeft = document.getElementById("panel-start");
    calcitePanelLeft.appendChild(containerFeaturesWidget);
  }

  // Toggle the navigation action in mobile view
  const calciteNavigationComponent =
    document.querySelector("calcite-navigation");
  calciteNavigationComponent.navigationAction = width < 700;
}
handleResize();
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
