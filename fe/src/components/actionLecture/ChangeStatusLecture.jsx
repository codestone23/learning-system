import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import { notifySuccess } from "../../components/notify/NotifySuccess";
// import { notifyError } from "../notify/NotifyError";
// import { useDispatch } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState } from "react";


export default function ChangeStatusLecture({status,onHandleClose,open}){
  const theme = useTheme();
  const [loading,setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
            {(() => {
            switch (status) {
                case 1:
                    return "Finish class"
                case 4:
                    return "Cancel class"
                case 5:
                    return "Delete class"
                default:
                return "Submit";
            }
            })()}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            {(() => {
            switch (status) {
                case 1:
                    return "This class will be marked as done. Are you sure about that?"
                case 4:
                    return "This class will be marked as done. Are you sure about that?"
                case 5:
                    return "This class will be deleted. Are you sure about that?"
                default:
                return "Are you sure about that?";
            }
            })()}
            </DialogContentText>
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
              style={{ backgroundColor: status === 1 ? "#0052CC" : "#D04234", color : "white"}}>
                {(() => {
                switch (status) {
                    case 1:
                        return "Finish"
                    case 4:
                        return "Yes. Cancel it"
                    case 5:
                        return "Yes, Delete it"
                    default:
                    return "Submit";
                }
                })()}
            </Button>
            }
            {
            loading && 
            <Button
              onClick={handleSubmit}
              autoFocus
              style={{ backgroundColor: status === 1 ? "#0052CC" : "#D04234", width:'66px' }}
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