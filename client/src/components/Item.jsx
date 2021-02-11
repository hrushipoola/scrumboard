import React, { Fragment, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Window from "./Window";
import ITEM_TYPE from "../data/types";
import { makeStyles } from '@material-ui/core/styles';
import {deepOrange} from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import axios from "axios";
import { statuses } from "../data";
import TextField from '@material-ui/core/TextField';
import { Card, Icon ,Button } from 'semantic-ui-react'
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    square: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    }
  }));
const Item = ({ item, index, moveItem, status,edit, items, setItems }) => {
    const classes = useStyles();
    const ref = useRef(null);
    const [editItems,setEditItems] = useState({});
    const [, drop] = useDrop({
        accept: ITEM_TYPE,
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return
            }

            const hoveredRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoveredRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: ITEM_TYPE, ...item, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    const [show, setShow] = useState(false);

    const onOpen = () => setShow(true);

    const onClose = () => {setShow(false);axios.post("http://localhost:8080/task/",item).then(res=>console.log(res));}
    const onSubmit = () => {
        editItems["status"] = status["status"];
        console.log(editItems); 
        axios.post("http://localhost:8080/task/",editItems).then(res=>console.log(res));
        editItems["icon"] = statuses.filter(sts=>sts.status === editItems.status)[0].icon;
        setItems(items.concat(editItems));
        window.location.reload(false);
        setEditItems({});
    };
    !edit && drag(drop(ref));
    function onChanges(event){
        editItems[event.target.name] = event.target.value;
        setEditItems(editItems);
    }
    if(edit){
        return (
            <Fragment>
                <div
                    ref={ref}
                    style={{ opacity: isDragging ? 0 : 1 }}
                    className={"item"}
                    onClick={!edit ? onOpen:''}
                >
                    {/* <div>
                        <div className={"color-bar"} style={{ backgroundColor: status.color }}/>
                        <TextField id="outlined-basic" name="title" label="Title" variant="outlined" onKeyUp={onChanges} defaultValue=""/>
                        <TextField id="outlined-basic" name="content" label="Content" variant="outlined" onKeyUp={onChanges} defaultValue=""/>
                        <button onClick={onSubmit}>Save</button>
                    </div> */}
                      <Card>
            <Card.Content header={<TextField id="outlined-basic" name="title" label="Title" variant="outlined" onKeyUp={onChanges} defaultValue=""/>}/>
            <Card.Content description={<TextField id="outlined-basic" name="content" label="Content" variant="outlined" onKeyUp={onChanges} defaultValue=""/>} />
            <Card.Content extra>
            <Button fluid onClick={onSubmit}>Save</Button>
            </Card.Content>
            </Card>
                </div>
            </Fragment>
        );
    }
    else{
        return (
            <Fragment>
                <div
                    ref={ref}
                    style={{ opacity: isDragging ? 0 : 1 }}
                    className={"item"}
                    onClick={!edit ? onOpen:''}
                >
                    {/* <div>
                        <Avatar variant="square" className={classes.square}>{item.content[0].toUpperCase()}</Avatar>
                    </div>
                        <div className={"color-bar"} style={{ backgroundColor: status.color }}/>
                        <p className={"item-title"}>{item.content}</p>
                        <p className={"item-status"}>{item.icon}</p>
                        <Chip avatar={<Avatar>{item.title[0].toUpperCase()}</Avatar>} /> */}
                          <Card
    header={<Avatar variant="square" className={classes.square}>{item.title[0].toUpperCase()}</Avatar>}
    meta={item.title}
    description={item.content}
    extra={<p className={"item-status"}>{item.icon}</p>}
  />
                </div>
                <Window
                    item={item}
                    edit={edit}
                    onClose={onClose}
                    show={show}
                />
            </Fragment>
        );
    }
    
};

export default Item;