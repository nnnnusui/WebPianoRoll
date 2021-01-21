import React, { useEffect, useState, ReactElement } from "react";
import { range0to } from "../range";
import typedFetch from "../typedFetch";
import SelectBox from "./SelectBox";

type RollRest = {
  division: number;
};
type NoteRest = {
  offset: number;
  octave: number;
  pitch: number;
};
const rollUrl = "http://localhost:8080/rest/1/rolls/1";
const notesUrl = `${rollUrl}/notes`;

const Roll = (): ReactElement => {
  const initSelection: Range<Pos> = (()=> {
    const pos = {x: -1, y: -1}
    return {from: pos, to: pos}
  })()
  
  const [division, setState] = useState(24);
  const [notes, setNotes] = useState<Array<NoteRest>>([]);
  useEffect(() => {
    typedFetch<RollRest>(rollUrl).then((result) => setState(result.division));
    typedFetch<{ values: Array<NoteRest> }>(notesUrl).then((result) =>
      setNotes(result.values)
    );
  }, [0]);
  const [debugLog, setDebug] = useState("defaultDebugLog");
  const [selectMode, setSelectMode] = useState(false);
  const [selection, setselection] = useState<Range<Pos>>(initSelection);
  const [touched, setTouched] = useState<Array<Pos>>([]);
  const offset = division
  const minOctave = -1
  const maxOctave = 1
  const octave = (maxOctave + 1) - minOctave
  const pitch = 12
  const height = octave * pitch
  const width = offset
  const cellActions: CellActions = {
    selectStart: (selection)=>{
      setselection(selection)
    },
    selectMove: (to)=> {
      setselection({from: selection.from, to})
    },
    onTouch: (pos, isStart) => {
      if(isStart){
        setTouched(touched.concat(pos))
      } else {
        setDebug(`pos: ${pos.x}, ${pos.y}`)
        setTouched(touched.filter(it=> it.x != pos.x && it.y != pos.y))
      }
      
      switch(touched.length) {
        case 0: setselection({from: pos, to: pos});break;
        case 1: {
          if (selection.from.x == pos.x && selection.from.y == pos.y)
            setselection({from: pos, to: selection.to})
          else
            setselection({from: selection.from, to: pos})
          break;
        }
        default: setselection({from: touched[0], to: touched[1]}); break;
      }
    },
  }
  const cells = range0to(height * width)
    .map(index=> {
      const pos = {
        x: Math.floor(index / height),
        y: index % height,
      }
      return <Cell key={index} {...{pos, ...cellActions}}/>
    })
  const noteElements = notes
    .map((it, index)=> {
      const pos = {
        x: it.offset,
        y: (it.octave * pitch) + it.pitch,
      }
      const style = {
        gridColumnStart: pos.x + 1,
        gridRowStart: pos.y + 1,
      }
      return <div key={index} className="bg-yellow-500" style={style}></div>
    })
  const style = {
    gridTemplateRows: `repeat(${height}, 1fr)`,
    gridTemplateColumns: `repeat(${width}, 1fr)`,
  }
  const max = {
    x: Math.max(selection.from.x, selection.to.x),
    y: Math.max(selection.from.y, selection.to.y),
  }
  const min = {
    x: Math.min(selection.from.x, selection.to.x),
    y: Math.min(selection.from.y, selection.to.y),
  }
  return <div className="relative h-full">
    <h1>{debugLog}</h1>
    <div className="absolute h-full w-full grid grid-flow-col" style={style}>{cells}</div>
    <div className="pointer-events-none absolute h-full w-full grid grid-flow-col" style={style}>{noteElements}</div>
    <div className="pointer-events-none absolute h-full w-full grid grid-flow-col" style={style}>
      <SelectBox {...{min, max}}></SelectBox>
    </div>
  </div>;
};

type Pos = {
  x: number,
  y: number,
}
type Range<T> = {
  from: T,
  to: T,
}

type CellProps = {
  pos: Pos,
}
& CellActions
type CellActions = {
  selectStart: (selection: Range<Pos>) => void;
  selectMove: (to: Pos) => void;
  onTouch: (from: Pos, start: boolean) => void;
}
const Cell: React.FC<CellProps> = ({
  pos, selectStart, selectMove, onTouch
})=> {
  return (
    <div className={`cell relative h-full w-full ${"bg-gray-600 rounded-sm"}`}
    onMouseDown={() => selectStart({from: pos, to: pos})}
    onDragEnter={()=> selectMove(pos)}
    onTouchStart={()=> onTouch(pos, true)}
    onTouchEnd={()=> onTouch(pos, false)}
    draggable="true"
    ></div>
  )
}

export default Roll;
