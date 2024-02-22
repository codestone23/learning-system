import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import { notifySuccess } from "../notify/NotifySuccess";
// import { notifyError } from "../notify/NotifyError";
// import { useDispatch } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker, Space } from 'antd';


export default function EditLecture({onHandleClose,open}){
  const theme = useTheme();
  const [loading,setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };
  const onOk = (value) => {
    console.log('onOk: ', value);
  };
  // const onHandleDisable = () =>{
  //   onHandleClose();
  // }
  // const dispatch = useDispatch();
  const handleSubmit = () => {
    setLoading(true);
  };

    return (
        <Fragment>
        <Dialog
          fullWidth={true}
          maxWidth='sm'
          fullScreen={fullScreen}
          open={open}
          onClose={onHandleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Edit Class
          </DialogTitle>
          <DialogContent>
          <div className="form__new--input">
              <DialogContentText>
                <span className="form__new-course-title">Topic Name</span>
                <span className="require-star">*</span>
              </DialogContentText>
              <TextField
                className="input_course input__lecture"
                fullWidth={true}
                placeholder="Enter Course Name"
                autoFocus
                margin="dense"
                id="name"
                type="text"
                variant="outlined"
                defaultValue={""}
                // onChange={}
              />
            </div>
            <div className="form__new--input">
            <DialogContentText>
                <span className="form__new-course-title">Training Date Time</span>
                <span className="require-star">*</span>
              </DialogContentText>
            <Space className="date__time--picker" direction="vertical" size={12}>
              <DatePicker className="date__time--picker__content" showTime onChange={onChange} onOk={onOk} />
            </Space>
            </div>
            <div className="form__new--input">
              <DialogContentText>
                <span className="form__new-course-title">Summary</span>
                <span className="require-star">*</span>
              </DialogContentText>
              <TextField
                className="input_course input__lecture"
                fullWidth={true}
                rows={5}
                placeholder="Write Discription for Course"
                multiline
                margin="dense"
                id="summary"
                type="text"
                variant="outlined"
                defaultValue={""}
                // onChange={}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button 
              autoFocus 
              onClick={onHandleClose}
              style={{color : "black"}}
            >
              Close
            </Button>
            {
              !loading && <Button 
              onClick={handleSubmit} 
              autoFocus
              style={{ backgroundColor: "blue", color : "white"}}>
                Finish
            </Button>
            }
            {
            loading && 
            <Button
              onClick={handleSubmit}
              autoFocus
              style={{ backgroundColor: "blue", width:'66px' }}
            >
              <Box sx={{ display: 'flex' }}>
                  <CircularProgress 
                  color="inherit" 
                  size={25}
                  thickness={4}
                  />
                </Box>
            </Button>
          }
          </DialogActions>
        </Dialog>
      </Fragment>
    )
}