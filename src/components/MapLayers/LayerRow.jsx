import { useContext, useEffect, useState } from "react";

const LayerRow = ({ d, update, activeLayer, setActiveLayer }) => {
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const addHover = () => setHovered(true);
  const removeHover = () => setHovered(false);

  const onClick = () => {
    d.zIndex = d.zIndex - 1;
    update(d, d.id);
  };

  const clickRow = () => {
    setActiveLayer(d.id);
  };

  const moveBack = () => {
    d.zIndex = d.zIndex - 1.001;
    update(d, d.id);
  };

  const moveForward = () => {
    d.zIndex = d.zIndex + 1.001;
    update(d, d.id);
  };

  const remove = () => {
    update("remove", d.id);
  };

  const toggleVisibility = () => {
    if (d.visible == 1) {
      d.visible = 0;
    } else {
      d.visible = 1;
    }
    d.ts = Math.random();
    update(d, d.id);
  };

  let icon;
  if (d.type == "osm") {
    icon = (
      <img
        className="MapLayers_raster"
        src={process.env.PUBLIC_URL + "/icons/raster.svg"}
      />
    );
  } else if (d.type == "mask") {
    icon = (
      <img
        className="MapLayers_point"
        src={process.env.PUBLIC_URL + "/icons/mask.svg"}
      />
    );
  } else if (d.type == "symbol") {
    icon = (
      <img
        className="MapLayers_point"
        src={process.env.PUBLIC_URL + "/icons/point.svg"}
      />
    );
  } else if (d.type == "polygon") {
    icon = (
      <img
        className="MapLayers_polygon"
        src={process.env.PUBLIC_URL + "/icons/polygon.svg"}
      />
    );
  } else {
    icon = (
      <img
        className="MapLayers_raster"
        src={process.env.PUBLIC_URL + "/icons/raster.svg"}
      />
    );
  }
  let showIcon;
  if (d.visible) {
    showIcon = <img src={process.env.PUBLIC_URL + "/icons/show.svg"} />;
  } else {
    showIcon = <img src={process.env.PUBLIC_URL + "/icons/hide.svg"} />;
  }

  let activeClass = "";
  if (activeLayer == d.id) {
    activeClass = "active";
  }

  return (
    <div
      className={hovered ? "MapLayers_row hovered" : "MapLayers_row"}
      onClick={clickRow}
      onMouseEnter={addHover}
      onMouseLeave={removeHover}
    >
      <div className="MapLayers_icon_container">
        <div className="MapLayers_icon">{icon}</div>
      </div>
      <div className={"MapLayers_title " + activeClass}>{d.name}</div>
      <div className="MapLayers_buttons">
        <div className="MapLayers_buttons_forward" onClick={moveForward}>
          <img src={process.env.PUBLIC_URL + "/icons/up.svg"} />
        </div>
        <div className="MapLayers_buttons_back" onClick={moveBack}>
          <img src={process.env.PUBLIC_URL + "/icons/down.svg"} />
        </div>
        <div className="MapLayers_buttons_remove" onClick={remove}>
          <img src={process.env.PUBLIC_URL + "/icons/remove.svg"} />
        </div>
        <div
          className={
            !d.visible
              ? "MapLayers_buttons_show MapLayers_buttons_hidden"
              : "MapLayers_buttons_show"
          }
          onClick={toggleVisibility}
        >
          {showIcon}
        </div>
      </div>
    </div>
  );
};

export default LayerRow;
