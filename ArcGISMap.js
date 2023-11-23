// @arcgis/core
import WebMap from "https://js.arcgis.com/4.28/@arcgis/core/WebMap.js";
import WebScene from "https://js.arcgis.com/4.28/@arcgis/core/WebScene.js";
import MapView from "https://js.arcgis.com/4.28/@arcgis/core/views/MapView.js";
import SceneView from "https://js.arcgis.com/4.28/@arcgis/core/views/SceneView.js";
import FeatureEffect from "https://js.arcgis.com/4.28/@arcgis/core/layers/support/FeatureEffect.js";
import FeatureFilter from "https://js.arcgis.com/4.28/@arcgis/core/layers/support/FeatureFilter.js";
import Features from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Features.js";
import * as reactiveUtils from "https://js.arcgis.com/4.28/@arcgis/core/core/reactiveUtils.js";
import Expand from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Expand.js";
import Legend from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Legend.js";
import Home from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Home.js";
import ValuePicker from "https://js.arcgis.com/4.28/@arcgis/core/widgets/ValuePicker.js";

/**
 * Initialize map
 */
console.log("Starting map");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let map;
let view;
let layer;
let valuePickerTime;

/*
 * Loading a mapView (2d)
 */
if (Array.from(urlParams.keys()).includes("webmap_id")) {
  const itemId = urlParams.get("webmap_id");
  map = new WebMap({
    portalItem: {
      id: itemId,
    },
  });
  view = new MapView({
    container: "viewDiv",
    highlightOptions: {
      color: [255, 255, 0, 0],
      haloOpacity: 0.9,
      fillOpacity: 0.2,
    },
  });
  /*
   * Loading a sceneView (3d)
   */
} else if (Array.from(urlParams.keys()).includes("webscene_id")) {
  const itemId = urlParams.get("webscene_id");
  map = new WebScene({
    portalItem: {
      id: itemId,
    },
  });
  view = new SceneView({
    container: "viewDiv",
  });
} else {
  map = new WebMap({
    portalItem: {
      id: "f7d59aec8487406bb9996d42ec60e277",
    },
  });
  view = new MapView({
    container: "viewDiv",
    highlightOptions: {
      color: [255, 255, 0, 0],
      haloOpacity: 0.9,
      fillOpacity: 0.2,
    },
  });
}

map
  .load()
  .then(async () => {
    view.map = map;
    view.popupEnabled = false;
    await view?.map?.portalItem?.portal.load();
    /* 3D hacks */
    layer = view.map.findLayerById("18b7125189a-layer-70");
    if (layer) {
      layer.renderer = {
        type: "simple",
        symbol: {
          type: "polygon-3d",
          symbolLayers: [
            {
              type: "fill",
              pattern: {
                type: "style",
                style: "solid",
              },
              material: { color: [255, 255, 255, 1] },
              outline: { color: [70, 70, 70, 0.7], size: 0 },
            },
          ],
        },
        visualVariables: [
          {
            type: "color",
            valueExpression: "$feature.a1 - $feature.a4",
            legendOptions: {
              title: "Net change in population",
            },
            stops: [
              {
                value: -1000,
                color: [123, 50, 148, 1],
              },
              {
                value: -500,
                color: [194, 165, 207, 1],
              },
              { value: 0, color: [247, 247, 247, 1] },
              {
                value: 1767,
                color: [166, 219, 160, 1],
              },
              {
                value: 3534,
                color: [0, 136, 55, 1],
              },
            ],
          },
        ],
      };
      // add a second layer with point symbols
      const barsLayer = layer.clone();
      barsLayer.renderer = {
        type: "simple",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: { primitive: "cube" },
              material: { color: [0, 0, 0, 1] },
              anchor: "bottom",
              depth: 5000,
              height: 10000,
              width: 5000,
            },
          ],
        },
        visualVariables: [
          {
            type: "color",
            valueExpression: "$feature.a1 - $feature.a4",
            legendOptions: {
              title: "Net change in population",
            },
            stops: [
              {
                value: -1000,
                color: [123, 50, 148, 1],
              },
              {
                value: -500,
                color: [194, 165, 207, 1],
              },
              { value: 0, color: [247, 247, 247, 1] },
              {
                value: 1767,
                color: [166, 219, 160, 1],
              },
              {
                value: 3534,
                color: [0, 136, 55, 1],
              },
            ],
          },
          {
            type: "size",
            valueExpression: "$feature.a1 - $feature.a4",
            axis: "height",
            legendOptions: {
              title: "Net change in population",
            },
            stops: [
              {
                value: -1000,
                size: 40000,
              },
              {
                value: -500,
                size: 20000,
              },
              { value: 0, size: 10000 },
              {
                value: 1767,
                size: 20000,
              },
              {
                value: 3534,
                size: 40000,
              },
            ],
          },
          // {
          //   type: "size",
          //   axis: "height",
          //   useSymbolValue: true,
          // },
          {
            type: "size",
            valueExpression: "$feature.a1 - $feature.a4",
            axis: "width-and-depth",
            //useSymbolValue: true,
            stops: [
              {
                value: -1000,
                size: 15000,
              },
              {
                value: -500,
                size: 7500,
              },
              { value: 0, size: 2500 },
              {
                value: 1767,
                size: 7500,
              },
              {
                value: 3534,
                size: 15000,
              },
            ],
          },
        ],
      };
      view.map.add(barsLayer);
    }

    // here you could save the webscene
    // view.map.updateFrom(view).then(function () {
    //   view.map.save();
    // });

    /* Item title */
    document.title = view?.map?.portalItem?.title;
    document.querySelector("calcite-navigation-logo").heading =
      view?.map?.portalItem?.title;
    /* Item thumbnail */
    document.getElementById(
      "container-item-details-img"
    ).src = `https://www.arcgis.com/sharing/rest/content/items/${view?.map?.portalItem?.id}/info/${view?.map?.portalItem?.thumbnail}`;
    /* Item description */
    document.getElementById("container-item-details-description").innerText =
      view?.map?.portalItem?.snippet;
    /* Item owner */
    document.getElementById("container-item-details-owner").innerText =
      view?.map?.portalItem?.owner;

    //view.ui.move("zoom", "bottom-right");
    view.ui.components = ["attribution"];
    const homeWidget = new Home({
      view: view,
    });
    const legendWidget = new Legend({
      view: view,
    });
    const expandLegendWidget = new Expand({
      content: legendWidget,
    });
    view.ui.add(homeWidget, "bottom-right");
    view.ui.add(expandLegendWidget, "bottom-right");
    renderDropdownLayers(view.map.layers);
    // Setting the title of the app
    document.querySelector("calcite-navigation-logo").heading =
      view.map.portalItem.title;
    /* Loading the bookmarks in a 2d map */
    if (Array.from(urlParams.keys()).includes("webmap_id")) {
      renderBookmarksDesktop(view.map.bookmarks, view);
      renderBookmarksMobile(view.map.bookmarks, view);
    }
    /* Loading the slides (3d-version of bookmarks) from the 3d scene */
    if (Array.from(urlParams.keys()).includes("webscene_id")) {
      renderSlidesDesktop(view.map.presentation.slides, view);
      renderSlidesMobile(view.map.presentation.slides, view);
    }

    // renderChipGroupLayers(view.map.layers);

    const featuresWidget = new Features({
      container: "container-features-widget",
      viewModel: {
        // Add a custom action to the widget that will open a
        // website when it's selected.
        actions: [
          {
            type: "button",
            title: "Clear selection",
            id: "clear-selection",
            icon: "clear-selection",
          },
          {
            type: "button",
            title: "More information",
            id: "more-info",
            icon: "information-letter",
          },
        ],
        view: view,
      },
      visibleElements: {
        closeButton: false,
      },
    });

    const currentYear = "2013";

    // Add the widget to the bottom-right corner of the view

    const valuePickerTime = new ValuePicker({
      //container: "container-value-picker-widget",
      component: {
        type: "label",
        items: [
          { value: "2013", label: "2013" },
          { value: "2014", label: "2014" },
          { value: "2015", label: "2015" },
          { value: "2016", label: "2016" },
          { value: "2017", label: "2017" },
          { value: "2018", label: "2018" },
          { value: "2019", label: "2019" },
          { value: "2020", label: "2020" },
          { value: "2021", label: "2021" },
        ],
      },
      caption: "Year",
      playRate: 400,
      visibleElements: {
        nextButton: true,
        playButton: true,
        previousButton: true,
      },
      values: [currentYear], // "current value"
    });

    view.ui.add(valuePickerTime, "top-left");

    const setCurrentTime = (value) => {
      const startDate = new Date(
        Date.UTC(Number.parseInt(value), 11, 30, 0, 0, 0)
      ); // One day before
      const endDate = new Date(
        Date.UTC(Number.parseInt(value) + 1, 0, 1, 0, 0, 0)
      ); // One day later
      view.timeExtent = {
        start: startDate,
        end: endDate,
      };
    };

    // watch the values change on the value picker update the
    // view.timeExtent show to the land cover for the given year
    valuePickerTime.watch("values", (values) => {
      //console.log(values);
      setCurrentTime(values[0]);
    });

    setCurrentTime(currentYear);

    if (window.innerWidth < view.breakpoints.small) {
      view.ui.move(valuePickerTime, "manual");
      valuePickerTime.container = "container-value-picker-widget";
    } else {
      view.ui.move(valuePickerTime, "top-left");
    }

    //
    //  EVENTS
    //
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
        if (event.action.id === "clear-selection") {
          featuresWidget.features = undefined;
          featuresWidget.close();
        }
      }
    );

    //
    // Use reactiveUtils to watch the Features widget features property
    //
    reactiveUtils.watch(
      () => featuresWidget.features,
      (features) => {
        console.log("Features widget features: ", features);
        document.getElementById("calcite-tip-select-features").style.display =
          features.length === 0 ? "" : "none";
      }
    );

    //
    // Resize
    //
    window.addEventListener("resize", () => {
      // Use the View breakpoint to change layout
      if (window.innerWidth < view.breakpoints.small) {
        view.ui.move(valuePickerTime, "manual");
        valuePickerTime.container = "container-value-picker-widget";
      } else {
        view.ui.move(valuePickerTime, "top-left");
      }
    });

    //
    // Apply Feature effect to the selected feature
    //
    reactiveUtils.watch(
      () => featuresWidget.selectedFeature,
      (selectedFeature) => {
        // Typical usage
        if (selectedFeature) {
          const effect = new FeatureEffect({
            filter: new FeatureFilter({
              where: `${selectedFeature.layer.objectIdField} = ${
                selectedFeature.attributes[selectedFeature.layer.objectIdField]
              }`,
            }),
            includedEffect: "drop-shadow(3px, 3px, 3px, black)",
            excludedEffect: "grayscale(40%) opacity(30%)",
          });
          selectedFeature.layer.highlightOptions = undefined;
          selectedFeature.layer.featureEffect = effect;
          //
          // Hide the item details
          //
          document.querySelector(
            "calcite-block#block-item-details"
          ).style.display = "none";
        } else {
          view.map.allLayers.map((layer) => {
            layer.featureEffect = undefined;
          });
          document.querySelector(
            "calcite-block#block-item-details"
          ).style.display = "";
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
  const containerMobile = document.getElementById("container-bookmarks-mobile");
  const bookmarkComponentsMobile = bookmarks.items.map((bookmark) => {
    const cardItem = document.createElement("calcite-card");
    cardItem.thumbnailPosition = "inline-start";
    const img = document.createElement("img");
    img.slot = "thumbnail";
    img.src = bookmark.thumbnail.url;
    cardItem.appendChild(img);
    const spanTitle = document.createElement("span");
    spanTitle.slot = "title";
    spanTitle.innerText = bookmark.name;
    cardItem.appendChild(spanTitle);
    const spanSubtitle = document.createElement("span");
    spanSubtitle.slot = "subtitle";
    spanSubtitle.innerText = "Move the map to the location of the bookmark";
    cardItem.appendChild(spanSubtitle);
    const buttonZoomTo = document.createElement("calcite-button");
    buttonZoomTo.innerText = `Zoom to ${bookmark.name}`;
    buttonZoomTo.scale = "s";
    buttonZoomTo.slot = "footer-end";
    buttonZoomTo.iconStart = "layer-zoom-to";
    buttonZoomTo.onclick = () => {
      mapView.goTo(bookmark.viewpoint.targetGeometry);
      const sheetComponent = document.querySelector("calcite-sheet");
      sheetComponent.open = false;
    };
    cardItem.appendChild(buttonZoomTo);

    return cardItem;
  });
  containerMobile.append(...bookmarkComponentsMobile);
};

const renderSlidesDesktop = (slides, sceneView) => {
  const containerDesktop = document.getElementById(
    "calcite-menu-bookmarks-desktop"
  );
  const slidesComponentsDesktop = slides.items.map((slide) => {
    const slideMenuItem = document.createElement("calcite-menu-item");
    slideMenuItem.iconStart = "bookmark";
    slideMenuItem.textEnabled = true;
    slideMenuItem.text = slide.title.text;

    slideMenuItem.onclick = () => {
      // In 3d we use camera instead of targetGeometry in 2d
      sceneView.goTo(slide.viewpoint.camera);
    };

    return slideMenuItem;
  });
  containerDesktop.append(...slidesComponentsDesktop);
};

const renderSlidesMobile = (slides, sceneView) => {
  const containerMobile = document.getElementById("container-bookmarks-mobile");
  const slideComponentsMobile = slides.items.map((slide) => {
    const cardItem = document.createElement("calcite-card");
    cardItem.thumbnailPosition = "inline-start";
    const img = document.createElement("img");
    img.slot = "thumbnail";
    img.src = slide.thumbnail.url;
    cardItem.appendChild(img);
    const spanTitle = document.createElement("span");
    spanTitle.slot = "title";
    spanTitle.innerText = slide.title.text;
    cardItem.appendChild(spanTitle);
    const spanSubtitle = document.createElement("span");
    spanSubtitle.slot = "subtitle";
    spanSubtitle.innerText = "Move the map to the location of the slide";
    cardItem.appendChild(spanSubtitle);
    const buttonZoomTo = document.createElement("calcite-button");
    buttonZoomTo.innerText = `Zoom to ${slide.title.text}`;
    buttonZoomTo.scale = "s";
    buttonZoomTo.slot = "footer-end";
    buttonZoomTo.iconStart = "layer-zoom-to";
    buttonZoomTo.onclick = () => {
      // In 3d we use camera instead of targetGeometry in 2d

      sceneView.goTo(slide.viewpoint.camera);
      const sheetComponent = document.querySelector("calcite-sheet");
      sheetComponent.open = false;
    };
    cardItem.appendChild(buttonZoomTo);

    return cardItem;
  });
  containerMobile.append(...slideComponentsMobile);
};

//
//  Render the dropdown layers with the visibility toggle
//
const renderDropdownLayers = (layers) => {
  const dropDownItemLayers = layers.items.map((layer) => {
    const dropdownItem = document.createElement("calcite-dropdown-item");
    dropdownItem.id = layer.id;
    dropdownItem.value = layer.id;
    dropdownItem.innerText = layer.title;
    dropdownItem.classList = [layer.id];
    dropdownItem.selected = layer.visible;
    // Watch the state of layers' visibility
    reactiveUtils.watch(
      () => layer.visible,
      () => {
        dropdownItem.selected = layer.visible;
      }
    );
    //
    dropdownItem.onclick = (evt) => {
      layers.forEach((layer) => {
        layer.visible = layer.id === evt.currentTarget.id ? true : false;
      });
      document.querySelector("calcite-button#button-layers").innerHTML =
        layer.title;
    };
    return dropdownItem;
  });

  const dropdownElement = document.querySelector(
    "calcite-dropdown#dropdown-layers"
  );
  dropdownElement.append(...dropDownItemLayers);
};
