import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DisableAccountIcon from "../icons/DisableAccount";
import { Fragment } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { updateCourseStatus } from "../../services/admin.service";
import { notifySuccess } from "../notify/NotifySuccess";
import { notifyError } from "../notify/NotifyError";
import { useDispatch } from "react-redux";
import { UPDATE_COURSE_STATUS } from "../../stores/types/course";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState } from "react";

export default function CancelCourse({onHandleCourse,open, course_id}){
  const theme = useTheme();
  const [loading,setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleClose = () =>{
    onHandleCourse();
  }
  const dispatch = useDispatch();
  const handleSubmit = () => {
    setLoading(true);
    (async () =>
      await updateCourseStatus(course_id,4).then((response) => {
        if (response.status === 200) {
          dispatch({
            type: UPDATE_COURSE_STATUS,
            course: response.data.course,
          });
          notifySuccess(response.data.message);
        } else {
          notifyError(response.data.message);
        }
        onHandleCourse();
      }))();
  };

    return (
        <Fragment>
        <Dialog
          fullWidth={true}
          maxWidth='sm'
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <span className='icon-disable'><DisableAccountIcon /></span>
            Cancel course
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            This course is in progress. Are you sure to cancel this course?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              autoFocus 
              onClick={handleClose}
              style={{color : "black"}}
            >
              Discard
            </Button>
            {
              !loading &&
              <Button 
                onClick={handleSubmit} 
                autoFocus
                style={{ backgroundColor:  "red", color : "white"}}>
                  Yes. Cancel it
              </Button> 
            }
            
            {
            loading && 
            <Button
              onClick={handleSubmit}
              autoFocus
              style={{ backgroundColor: "red", width:'123px' }}
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