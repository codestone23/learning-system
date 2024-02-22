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
import { DatePicker, Space } from 'antd';


export default function NextSession({onHandleClose,open}){
  const theme = useTheme();
  const [loading,setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { RangePicker } = DatePicker;
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
            <div className="dialog__title">
              Make class as next session
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className="dialog__description">
            This class will be set up as next session. Please confirm the session date time
              </div>
            </DialogContentText>
            <DialogContentText>
              <div className="picker__date--time">
                Class date time

              </div>
            </DialogContentText>
            <div>
            <Space 
              className="date__time--picker" direction="vertical" size={12}>
              <RangePicker
                className="date__time--picker__content"
                showTime={{
                  format: 'HH:mm',
                }}
                format="YYYY-MM-DD HH:mm"
                onChange={onChange}
                onOk={onOk}
              />
            </Space>
            </div>
          </DialogContent>
          <DialogActions>
            <Button 
              autoFocus 
              onClick={onHandleClose}
              style={{color : "black"}}
            >
              Discard
            </Button>
            {
              !loading && <Button 
              onClick={handleSubmit} 
              autoFocus
              style={{ backgroundColor: "blue", color : "white"}}>
                Confirm
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