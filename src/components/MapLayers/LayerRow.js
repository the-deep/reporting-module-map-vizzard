import { useContext, useEffect, useState } from "react";

const LayerRow = ({d, update, layerIndex}) => {

  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const addHover = () => setHovered(true);
  const removeHover = () => setHovered(false);


  const onClick = () => {
    d.zIndex = d.zIndex - 1.3;
    update(d, layerIndex);
  }

  const moveBack = () => {
    d.zIndex = d.zIndex - 1.3;
    update(d, layerIndex);
  }

  const moveForward = () => {
    d.zIndex = d.zIndex + 1.3;
    update(d, layerIndex);
  }

  const remove = () => {
    update('remove', layerIndex);
  }

  const toggleVisibility = () => {
    d.visible = !d.visible;
    update(d, layerIndex);
  }

  let icon;
  if(d.type=='osm'){
    icon = <img className="MapLayers_raster" src={process.env.PUBLIC_URL + "/icons/raster.svg"}/>
  } else if(d.type=='point'){
      icon = <img className="MapLayers_point" src={process.env.PUBLIC_URL + "/icons/point.svg"}/>
  } else if(d.type=='polygon'){
      icon = <img className="MapLayers_polygon" src={process.env.PUBLIC_URL + "/icons/polygon.svg"}/>
  } else {
    icon = <img className="MapLayers_raster" src={process.env.PUBLIC_URL + "/icons/raster.svg"}/>
  }
  let showIcon;
  if(d.visible){
    showIcon = <img src={process.env.PUBLIC_URL+"/icons/show.svg"}/>
  } else {
    showIcon = <img src={process.env.PUBLIC_URL+"/icons/hide.svg"}/>
  }

  return <div className={hovered ? 'MapLayers_row hovered' : 'MapLayers_row'} onMouseEnter={addHover} onMouseLeave={removeHover} >
    <div className="MapLayers_icon_container">
      <div className="MapLayers_icon">
        {icon}
      </div>
    </div>
    <div className="MapLayers_title">{d.name}</div>
    <div className="MapLayers_buttons">
      <div className="MapLayers_buttons_forward" onClick={moveForward}>
        <img src={process.env.PUBLIC_URL+"/icons/up.svg"}/>
      </div>
      <div className="MapLayers_buttons_back" onClick={moveBack}>
        <img src={process.env.PUBLIC_URL+"/icons/down.svg"}/>
      </div>
      <div className="MapLayers_buttons_remove" onClick={remove}>
        <img src={process.env.PUBLIC_URL+"/icons/remove.svg"} />
      </div>
      <div className={!d.visible ? 'MapLayers_buttons_show MapLayers_buttons_hidden' : 'MapLayers_buttons_show'} onClick={toggleVisibility}>
        {showIcon}
      </div>

    </div>
    </div>;

};

export default LayerRow;