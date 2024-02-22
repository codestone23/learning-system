import { styled, alpha } from "@mui/material/styles";
import "../assets/styles/schedule.css";
import {
  Appointments,
  Scheduler,
  WeekView,
  DayView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Paper from "@mui/material/Paper";
//import { teal } from "@mui/material/colors";
import { yellow } from "@mui/material/colors";
import classNames from "clsx";
import Tooltip from '@mui/material/Tooltip';

import dayjs from "dayjs";
export default function Schedule({ data }) {
  // console.log(data);
  const PREFIX = "Demo";
  const classes = {
    line: `${PREFIX}-line`,
    circle: `${PREFIX}-circle`,
    nowIndicator: `${PREFIX}-nowIndicator`,
    shadedCell: `${PREFIX}-shadedCell`,
    shadedPart: `${PREFIX}-shadedPart`,
    appointment: `${PREFIX}-appointment`,
    shadedAppointment: `${PREFIX}-shadedAppointment`,
  };
  const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(
    ({ theme, currentTimeIndicatorPosition }) => ({
      [`&.${classes.shadedCell}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
        "&:focus": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          outline: 0,
        },
      },
      [`& .${classes.shadedPart}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        position: "absolute",
        height: currentTimeIndicatorPosition,
        width: "100%",
        left: 0,
        top: 0,
        "td:focus &": {
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        },
      },
    })
  );
  const StyledAppointmentsAppointment = styled(Appointments.Appointment)(
    () => {
      const a = Math.floor(Math.random() * 5 );
      return ({
      [`&.${classes.appointment}`]: {
        marginLeft: "4px",
        backgroundColor: getBackgroundColor(a),
        borderRadius: 8,
        borderColor: getColorBorder(a),
        "& .css-gyiown.VerticalAppointment-content": {
          color: "#4D5E80",
          fontFamily: "Roboto",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "20px",
        },
        "&:hover": {
          backgroundColor: getBackgroundColorHover(a),
        },
      },
      [`&.${classes.shadedAppointment}`]: {
        backgroundColor: getBackgroundColor(a),
        borderRadius: 8,
        borderColor: getColorBorder(a),
        "&:hover": {
          backgroundColor: getBackgroundColorHover(a),
        },
      },
    })
    } 
  );
  const TimeTableCell = ({
    currentTimeIndicatorPosition,
    isShaded,
    ...restProps
    // #FOLD_BLOCK
  }) => {
    const isNow = !!currentTimeIndicatorPosition;
    return (
      <StyledWeekViewTimeTableCell
        isShaded={isShaded && !isNow}
        currentTimeIndicatorPosition={currentTimeIndicatorPosition}
        className={classNames({
          [classes.shadedCell]: isShaded && !isNow,
        })}
        {...restProps}
      >
        {isNow && isShaded && <div className={classes.shadedPart} />}
      </StyledWeekViewTimeTableCell>
    );
  };

  // #FOLD_BLOCK
  const Appointment = ({
    isShaded,
    data,
    ...restProps
    // #FOLD_BLOCK
  }) => (
    <StyledAppointmentsAppointment
      className={classNames({
        [classes.appointment]: true,
        [classes.shadedAppointment]: isShaded,
      })}
      {...restProps}
    >
      <div className="schedule__time--lesson">
        {dayjs(data.startDate).format("hh:mm")}
      </div>
      <div
        className="schedule__time--lesson"
        style={{display: ((data.endDate.getHours() - data.startDate.getHours())*60 + data.endDate.getMinutes() - data.startDate.getMinutes()) == 30 ? 'none' : 'inline-block'}}
      >
        {dayjs(data.endDate).format("hh:mm")}
        {console.log(data)}
      </div>
      <Tooltip sx={{fontSize:"16px"}} title={data.title}>
      <div className="schedule__lesson--title">{data.title}</div></Tooltip>
      <div className={((data.endDate.getHours() - data.startDate.getHours())*60 + data.endDate.getMinutes() - data.startDate.getMinutes()) == 30 ? "schedule__lesson--trainer__small" : "schedule__lesson--trainer"}>
        <img className="schedule__lesson--img" src={data.mentor || "src/assets/images/user_null.png"}></img>
        <img className="schedule__lesson--img" src={data.manager || "src/assets/images/user_null.png"}></img>
      </div>
    </StyledAppointmentsAppointment>
  );

  return (
    <Paper>
      <Scheduler data={data} height={800}>
        <WeekView
          startDayHour={9}
          endDayHour={18}
          timeTableCellComponent={TimeTableCell}
          cellDuration={30}
          displayName="EEEEE dd"
        />
        <DayView startDayHour={9} endDayHour={18} />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  );
}

const getColorBorder = (a) => {
  switch (a) {
    case 0: return "#29CC39"
    case 1: return "#FF6633"
    case 2: return "#8833FF"
    case 3: return "#33BFFF"
    case 4: return "#CC7429"
  }
}
const getBackgroundColor = (a) => {
  switch (a) {
    case 0: return "rgba(41, 204, 57, 0.05)"
    case 1: return "rgba(255, 102, 51, 0.05)"
    case 2: return "rgba(136, 51, 255, 0.05)"
    case 3: return "rgba(51, 191, 255, 0.05)"
    case 4: return "rgba(204, 116, 41, 0.05)"
  }
}
const getBackgroundColorHover = (a) => {
  switch (a) {
    case 0: return "#29cc3942"
    case 1: return "#ff66334a"
    case 2: return "#8833ff4a"
    case 3: return "#33bfff40"
    case 4: return "#cc74293d"
  }
}
