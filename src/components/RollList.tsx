import React, { useState, useEffect } from 'react';
import RollRest, { RollRestType } from './pianoroll/rest/RollRest';

type Prop = {
    urlRoot: string;
    setRollId: React.Dispatch<React.SetStateAction<number>>;
  };
const RollList: React.FC<Prop> = ({urlRoot, setRollId}) => {
    const [rolls, setRolls] = useState<Array<RollRestType>>();
    const rest = RollRest(urlRoot);
    useEffect(()=> {
        rest.getAll()
            .then((result) => setRolls(result))
    }, [])
    if (rolls == undefined) return <></>

    return <article className="">
        <h1>rolls________</h1>
        <ul>
            {
                rolls.map((it)=> <li key={it.id} onClick={()=> setRollId(it.id)}>{it.id}</li>)
            }
        </ul>
    </article>
}

export default RollList