import React, { useState} from "react";
import Modal from "react-modal";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import {deepOrange} from '@material-ui/core/colors';
Modal.setAppElement("#app");
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
const Window = ({ show, onClose, item ,edit }) => {
    const classes = useStyles();
    const [windowitem,setWindowItem] = useState(item);
    function onChanges(event){
        windowitem[event.target.name] = event.target.value;
        setWindowItem(windowitem);
    }
    const handleClose = (onClose) => {
        item = windowitem;
        return onClose;
    }
    return (
        <Modal
            isOpen={show}
            onRequestClose={handleClose(onClose)}
            className={"modal"}
            overlayClassName={"overlay"}
        >
            <div className={"close-btn-ctn"}>
                <Avatar variant="square" className={classes.square}>{!edit && item.content[0].toUpperCase()}</Avatar>
                <h1 style={{ flex: "1 90%" }}>{!edit && item.title}</h1>
                <button className="close-btn" onClick={handleClose(onClose)}>X</button>
            </div>
            <div>
                <input type="text" name="content" onKeyUp={onChanges} defaultValue={!edit && windowitem.content} />
                <h2>Status</h2>
                <p>{!edit && item.icon} {`${!edit && item.status.charAt(0).toUpperCase()}${!edit && item.status.slice(1)}`}</p>
            </div>
        </Modal>
    );
};

export default Window;