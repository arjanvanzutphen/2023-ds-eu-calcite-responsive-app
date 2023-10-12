// @arcgis/core
import WebMap from "https://js.arcgis.com/4.28/@arcgis/core//WebMap.js";
import MapView from "https://js.arcgis.com/4.28/@arcgis/core/views/MapView.js";
import Features from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Features.js";
import * as reactiveUtils from "https://js.arcgis.com/4.28/@arcgis/core/core/reactiveUtils.js";
import Expand from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Expand.js";
import LayerList from "https://js.arcgis.com/4.28/@arcgis/core/widgets/LayerList.js";
import Legend from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Legend.js";
import ValuePicker from "https://js.arcgis.com/4.28/@arcgis/core/widgets/ValuePicker.js";

/**
 * Initialize map
 */
console.log("Starting map");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let map;
let view;

/* Loading a mapView (2d) */
if (Array.from(urlParams.keys()).includes("webmap_id")) {
  const itemId = urlParams.get("webmap_id");
  map = new WebMap({
    portalItem: {
      id: itemId,
    },
  });
  view = new MapView({
    container: "viewDiv",
  });
}
/* Loading a sceneView (3d) */
if (Array.from(urlParams.keys()).includes("webscene_id")) {
  const itemId = urlParams.get("webscene_id");
  map = new WebMap({
    portalItem: {
      id: itemId,
    },
  });
  view = new SceneView({
    container: "viewDiv",
  });
}

map
  .load()
  .then(() => {
    view.map = map;
    view.popupEnabled = false;

    document.querySelector("calcite-navigation-logo").heading =
      view?.map?.portalItem?.title;

    /* LayerList */
    // const layerListWidget = new LayerList({
    //   view: view,
    // });
    // const expandLayerListWidget = new Expand({
    //   content: layerListWidget,
    // });
    // view.ui.add(expandLayerListWidget, "top-right");
    view.ui.move("zoom", "bottom-right");

    const legendWidget = new Legend({
      view: view,
    });
    const expandLegendWidget = new Expand({
      content: legendWidget,
    });
    view.ui.add(expandLegendWidget, "top-right");

    // Setting the title of the app
    document.querySelector("calcite-navigation-logo").heading =
      view.map.portalItem.title;
    renderBookmarksDesktop(view.map.bookmarks, view);
    renderBookmarksMobile(view.map.bookmarks, view);
    renderChipGroupLayers(view.map.layers);

    // Add the widget to the bottom-right corner of the view

    const featuresWidget = new Features({
      container: "container-features-widget",
      viewModel: {
        // Add a custom action to the widget that will open a
        // website when it's selected.
        actions: [
          {
            type: "button",
            title: "More information",
            id: "more-info",
            icon: "information-letter",
          },
        ],
        view: view,
      },
    });

    const valuePickerTime = new ValuePicker({
      container: "container-value-picker-widget",
      component: {
        // autocasts ValuePickerSlider when type is "slider".
        type: "slider",
        min: 2013, // Start value
        max: 2021, // End value
        steps: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021], // Thumb snapping locations
        // minorTicks: [
        //   2013.5, 2014.5, 2015.5, 2016.5, 2017.5, 2018.5, 2019.5, 2020.5,
        // ], // Short tick lines
        majorTicks: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021], // Long tick lines
        labels: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021], // Long ticks with text
        // labelFormatFunction: (value) => `${value}%`, // Label definition
      },
      values: [2013], // "current value"
    });
    view.ui.add(valuePickerTime, "manual");

    // watch the values change on the value picker update the
    // view.timeExtent show to the land cover for the given year
    valuePickerTime.watch("values", (values) => {
      console.log(values[0]);
      const startDate = new Date(Date.UTC(values[0], 11, 30, 0, 0, 0)); // One day before
      const endDate = new Date(Date.UTC(values[0] + 1, 0, 1, 0, 0, 0)); // One day later
      view.timeExtent = {
        start: startDate,
        end: endDate,
      };
    });

    // Open the Features widget with features fetched from
    // the view click event location.
    reactiveUtils.on(
      () => view,
      "click",
      (event) => {
        featuresWidget.open({
          location: event.mapPoint,
          fetchFeatures: true,
        });
      }
    );

    // Use reactiveUtils to watch the Features widget trigger-action
    // and open a website if the specific action is clicked.
    reactiveUtils.on(
      () => featuresWidget,
      "trigger-action",
      (event) => {
        // TODO: use a more appropriate link
        if (event.action.id === "more-info") {
          window.open("https://developers.arcgis.com/javascript");
        }
      }
    );
  })
  .catch((error) => {
    console.error("Unable to load the map. Error: ", error);
  });

const renderBookmarksDesktop = (bookmarks, mapView) => {
  const containerDesktop = document.getElementById(
    "calcite-menu-bookmarks-desktop"
  );
  const bookmarkComponentsDesktop = bookmarks.items.map((bookmark) => {
    const bookmarkMenuItem = document.createElement("calcite-menu-item");
    bookmarkMenuItem.iconStart = "bookmark";
    bookmarkMenuItem.textEnabled = true;
    bookmarkMenuItem.text = bookmark.name;

    bookmarkMenuItem.onclick = () => {
      mapView.goTo(bookmark.viewpoint.targetGeometry);
    };

    return bookmarkMenuItem;
  });
  containerDesktop.append(...bookmarkComponentsDesktop);
};

const renderBookmarksMobile = (bookmarks, mapView) => {
  const containerMobile = document.getElementById(
    "calcite-menu-bookmarks-mobile"
  );
  const bookmarkComponentsMobile = bookmarks.items.map((bookmark) => {
    const bookmarkMenuItem = document.createElement("calcite-menu-item");
    bookmarkMenuItem.iconStart = "bookmark";
    bookmarkMenuItem.textEnabled = true;
    bookmarkMenuItem.text = bookmark.name;

    bookmarkMenuItem.onclick = () => {
      mapView.goTo(bookmark.viewpoint.targetGeometry);
      const sheetComponent = document.querySelector("calcite-sheet");
      sheetComponent.open = false;
    };

    return bookmarkMenuItem;
  });
  containerMobile.append(...bookmarkComponentsMobile);
};

const renderChipGroupLayers = (layers) => {
  const chipsLayers = layers.items.map((layer) => {
    console.log(layer.visible);
    const chip = document.createElement("calcite-chip");
    chip.id = layer.id;
    chip.value = layer.title;
    chip.classList = [layer.id];
    chip.icon = "layers";
    chip.innerText = layer.title;
    chip.selected = layer.visible;
    // Watch the state of layers' visibility
    reactiveUtils.watch(
      () => layer.visible,
      () => {
        chip.selected = layer.visible;
      }
    );
    //
    chip.onclick = (evt) => {
      const layer = layers.find((layer) => {
        return layer.id === evt.currentTarget.id;
      });
      layer.visible = !layer.visible;
    };
    return chip;
  });

  const chipGroupLayers = document.getElementById("chip-group-layers");
  chipGroupLayers.append(...chipsLayers);
};
