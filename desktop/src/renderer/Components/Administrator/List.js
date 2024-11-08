import React, { useState } from 'react';
const divStyles = {
    height: 400,
    overflowY: 'scroll',
    width: '20%',
    backgroundColor: '#8ecae6',
    padding: 10,
    borderRadius: 20,
};
export default function List({ header, items }) {
    const [filter, setFilter] = useState();
    let arr = [...items];
    if (filter && filter.length) {
        arr = items.filter((el) => el.number === filter);
    }

    return (
        <div style={divStyles}>
            <p>{header}</p>
            <p>{items.length}</p>
            <input onChange={(e) => setFilter(e.target.value)} />
            <div>
                {arr.map((el) => (
                    <p>{el.number}</p>
                ))}
            </div>
        </div>
    );
}
