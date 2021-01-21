import React from "react";

type Props = {
  min: {x: number, y: number},
  max: {x: number, y: number},
}
const SelectBox: React.FC<Props> = ({min, max}) => {
  const style = {
    gridColumnStart: min.x + 1,
    gridColumnEnd: max.x + 2,
    gridRowStart: min.y + 1,
    gridRowEnd: max.y + 2,
  }
  return <div className="bg-white opacity-25" style={style}></div>
}

export default SelectBox
