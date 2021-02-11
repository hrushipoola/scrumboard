import React, { useEffect, useState } from "react";
import Item from "../components/Item";
import DropWrapper from "../components/DropWrapper";
import Col from "../components/Col";
import { statuses } from "../data";
import axios from "axios";
const Homepage = () => {
    const [items, setItems] = useState([]);
    useEffect(()=>{
        (async () => {
            let res = await axios.get("http://localhost:8080/task");
            let data = res.data.map(task => {task['icon'] = statuses.filter(sts=>sts.status === task.status)[0].icon;return task});
            setItems(items.concat(data));
          })();
    },[]);

    const onDrop = (item, monitor, status) => {
        const mapping = statuses.find(si => si.status === status);
        item.status = status;
        axios.post("http://localhost:8080/task/",item).then(res=>console.log(res));
        console.log(status);
        setItems(prevState => {
            const newItems = prevState
                .filter(i => i.id !== item.id)
                .concat({ ...item, status, icon: mapping.icon });
            return [ ...newItems ];
        });
    };

    const moveItem = (dragIndex, hoverIndex) => {
        const item = items[dragIndex];
        setItems(prevState => {
            const newItems = prevState.filter((i, idx) => idx !== dragIndex);
            newItems.splice(hoverIndex, 0, item);
            return  [ ...newItems ];
        });
    };

    return (
        <div className={"row"}>
            {statuses.map(s => {
                return (
                    <div key={s.status} className={"col-wrapper"}>
                        <h2 className={"col-header"}>{s.status.toUpperCase()}</h2>
                        <DropWrapper onDrop={onDrop} status={s.status}>
                            <Col>
                            {
                                <Item key={s.status} index={s.status} status={s} edit={true} items={items} setItems={setItems}/>
                            }
                                {items
                                    .filter(i => i.status === s.status)
                                    .map((i, idx) => <Item key={i.id} item={i} index={idx} moveItem={moveItem} status={s} />)
                                }
                            </Col>
                        </DropWrapper>
                    </div>
                );
            })}
        </div>
    );
};

export default Homepage;