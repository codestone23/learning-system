import { useState, useRef, useEffect } from "react";
import CreateNewAccountModal from "../CreateNewAccountModal";
import DotVertical from "../icons/DotVertical";
import StatusAccount from "./StatusAccount";
import ChangePassAccount from "./ChagePassAccount";
import { useSelector, useDispatch } from "react-redux";
import { GET_ACCOUNT_DETAIL } from "../../stores/types/account";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function ActionAccount({
  status,
  email,
  total,
  rowsPerPage,
  handleSubmit,
}) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  const account = useSelector((state) => state.accounts.account);
  // console.log(account);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getData = () => {
    findAccountDetail(email);
  };

  const findAccountDetail = (email) => {
    dispatch({ type: GET_ACCOUNT_DETAIL, payload: email });
  };
  const handleClickCloseNewAccount = () => {
    setOpenModal(false);
  };
  const handleClickOpenChangePass = () => {
    setOpenChangePass(true);
  };

  const handleCloseChangePass = () => {
    setOpenChangePass(false);
  };

  const toggleDropdown = () => {
    if (!isDropdownVisible) {
      setOpenChangePass(false);
      setOpen(false);
    }
    setDropdownVisible(!isDropdownVisible);
  };
  return (
    <div ref={dropdownRef} className="more-info">
      <div onClick={toggleDropdown}>
        <DotVertical />
      </div>
      {isDropdownVisible && (
        <div className="dropdown-list-actions-account-table">
          <dl
            onClick={() => {
              getData();
              setOpenModal(true);
            }}
          >
            <div className="dropdown-list-actions-item">
              <img src="/src/assets/images/edit.png" />
              <span className="action-name">Edit </span>
            </div>
          </dl>
          <dl onClick={handleClickOpenChangePass}>
            <div className="dropdown-list-actions-item">
              <img src="/src/assets/images/change-pass.png" />
              <span className="action-name">Change Password</span>
            </div>
          </dl>
          <dl onClick={handleClickOpen}>
            <div className="dropdown-list-actions-item">
              <img src="/src/assets/images/deactive.png" />
              <span className="action-name">
                {status ? "Deactive" : "Active"}
              </span>
            </div>
          </dl>
        </div>
      )}
      {(isDropdownVisible || open || openChangePass) && (
        <>
          {open && (
            <StatusAccount
              status={status}
              email={email}
              onHandleStatus={handleClose}
              open={open}
            />
          )}
          {openChangePass && (
            <ChangePassAccount
              email={email}
              onHandleStatus={handleCloseChangePass}
              open={openChangePass}
            />
          )}

          {isOpenModal && account?.account?.email === email && (
            <CreateNewAccountModal
              title={"Edit Account"}
              email={email}
              onDiscard={handleClickCloseNewAccount}
              handleSubmitAccount={handleSubmit}
              total={total}
              rowsPerPage={rowsPerPage}
            />
          )}

          {isOpenModal && !(account?.account?.email === email) && (
            <div>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={true}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
          )}
        </>
      )}
    </div>
  );
}
