import React, { useState, ReactElement } from "react";
import { range0to } from "../range";
import Roll from "./Roll";
import SelectLayer from "./SelectLayer";
import { GridProvider } from "./GridContext";
import { SelectionProvider, useSelectionContext } from "./SelectionContext";

type Prop = {
  urlRoot: string;
};
const PianoRoll: React.FC<Prop> = ({ urlRoot }): ReactElement => {
  const initSelection: Range<Pos> = (() => {
    const pos = { x: -1, y: -1 };
    return { from: pos, to: pos };
  })();

  const [debugLog, setDebug] = useState("");
  const [selection, setselection] = useState<Range<Pos>>(initSelection);
  const [touched, setTouched] = useState<Array<Pos>>([]);
  const offset = 24;
  const minOctave = -1;
  const maxOctave = 1;
  const octave = maxOctave + 1 - minOctave;
  const pitch = 12;
  const height = octave * pitch;
  const width = offset;
  const cellActions: CellActions = {
    onTouch: (pos, isStart) => {
      if (isStart) {
        setTouched(touched.concat(pos));
      } else {
        setTouched(touched.filter((it) => it.x != pos.x && it.y != pos.y));
      }

      switch (touched.length) {
        case 0:
          setselection({ from: pos, to: pos });
          break;
        case 1: {
          if (selection.from.x == pos.x && selection.from.y == pos.y)
            setselection({ from: pos, to: selection.to });
          else setselection({ from: selection.from, to: pos });
          break;
        }
        default:
          setselection({ from: touched[0], to: touched[1] });
          break;
      }
    },
  };
  const cells = range0to(height * width).map((index) => {
    const pos = {
      x: Math.floor(index / height),
      y: index % height,
    };
    return <Cell key={index} {...{ pos, ...cellActions }} />;
  });
  const style = {
    gridTemplateRows: `repeat(${height}, 1fr)`,
    gridTemplateColumns: `repeat(${width}, 1fr)`,
  };
  return (
    <div className="relative h-full">
      <h1>{debugLog}</h1>
      <GridProvider>
        <SelectionProvider>
          <div
            className="absolute h-full w-full grid grid-flow-col"
            style={style}
          >
            {cells}
          </div>
          <Roll urlRoot={`${urlRoot}/rest/1/rolls/`} rollId={1}></Roll>
          <SelectLayer></SelectLayer>
        </SelectionProvider>
      </GridProvider>
    </div>
  );
};

type Pos = {
  x: number;
  y: number;
};
type Range<T> = {
  from: T;
  to: T;
};

type CellProps = {
  pos: Pos;
} & CellActions;
type CellActions = {
  onTouch: (from: Pos, start: boolean) => void;
};
const Cell: React.FC<CellProps> = ({ pos, onTouch }) => {
  const { selection, setSelection } = useSelectionContext();
  return (
    <div
      className={`cell relative h-full w-full ${"bg-gray-600 rounded-sm"}`}
      onMouseDown={() => setSelection({ from: pos, to: pos })}
      onDragEnter={() => setSelection({ from: selection.from, to: pos })}
      onTouchStart={() => onTouch(pos, true)}
      onTouchEnd={() => onTouch(pos, false)}
      draggable="true"
    ></div>
  );
};

export default PianoRoll;
