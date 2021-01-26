import React, { useState, useEffect } from 'react';
import RollRest, { RollRestType } from './pianoroll/rest/RollRest';

type Prop = {
    urlRoot: string;
  };
const RollList: React.FC<Prop> = ({urlRoot}) => {
    const [rolls, setRolls] = useState<RollRestType[]>();
    const rest = RollRest(urlRoot);
    useEffect(()=> {
        
    rest.getAll()
    .then(result => setRolls(result))
    }, [])
    if (rolls == undefined) return <></>

    return <article>
        <h1>rolls</h1>
    </article>
}

export default RollList