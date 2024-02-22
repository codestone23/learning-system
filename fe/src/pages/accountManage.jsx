/* eslint-disable no-undef */
import "../assets/styles/root.css";
import "../assets/styles/accountManagement.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AuthService from "../services/auth.service";
import AccountTableMUI from "../components/AccountTableMUI";
import CreateNewAccountModal from "../components/CreateNewAccountModal";
import SearchIcon from "../components/icons/SearchIcon";
import FilterDropdown from "../components/icons/FilterDropdown";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import { debounce } from "lodash";
import { ToastContainer } from "react-toastify";
import Paper from "@mui/material/Paper";
import {
  GET_ACCOUNTS_BY_ROLE_MONITOR,
  GET_ALL_ACCOUNTS,
  GET_ALL_ACCOUNTS_NUMBER,
} from "../stores/types/account";
const ROLES = () => ["Admin", "Trainer", "Mentor", "Monitor", "Student"];
function AccountManage() {
  const role = "Monitor";
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRoles = searchParams.get("roles") || "all";
  const email = searchParams.get("email") || "";
  const page = searchParams.get("pageNo") || "0";
  const rowsPer = searchParams.get("pageSize") || "5";
  const [roles, setRoles] = useState(
    searchRoles === "all" ? [] : searchRoles.split(",")
  );
  const [searchEmail, setSearchEmail] = useState(email);
  const [pageNo, setPageNo] = useState(Number.parseInt(page));
  const [rowsPerPage, setRowsPerPage] = useState(Number.parseInt(rowsPer));
  const dispatch = useDispatch();
  const query = { email, roles, pageNo, rowsPerPage };
  useEffect(() => {
    // if (roles.length === 0) {
    //   setRoles(["Admin", "Trainer", "Monitor", "Student", "Mentor"]);
    // }
    setPageNo(Number.parseInt(page));
    setRowsPerPage(Number.parseInt(rowsPer));
    const query = { email, roles, pageNo, rowsPerPage };
    console.log(query);
    findAllAccounts(query);
    findAllAccountsNumber(query);
    findAllMonitors(role);
  }, [email, page, pageNo, roles, rowsPer, rowsPerPage, searchParams]);
  const findAllAccounts = (query) => {
    dispatch({ type: GET_ALL_ACCOUNTS, payload: query });
  };
  const findAllAccountsNumber = (query) => {
    dispatch({ type: GET_ALL_ACCOUNTS_NUMBER, payload: query });
  };
  const findAllMonitors = (role) => {
    dispatch({ type: GET_ACCOUNTS_BY_ROLE_MONITOR, payload: role });
  };
  const data = useSelector((state) => state.accounts.accounts);
  const total = useSelector((state) => state.accounts.total);
  const loading = useSelector((state) => state.accounts.loading);
  const error = useSelector((state) => state.accounts.error);
  console.log(error);
  const handleChangeName = debounce((event) => {
    navigate(
      `.?pageNo=0&email=${event.target.value}&roles=${searchRoles}&pageSize=${rowsPerPage}`
    );
  }, 1500);
  const [isOpenModal, setOpenModal] = useState(false);
  const dropdownRef = useRef(null);
  const inputSearchAccount = useRef(null);
  console.log(data);
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
  useEffect(() => {
    const verify = async () => {
      if (!isAllowed) {
        navigate("/login");
      }
    };
    verify();
  }, [localStorage]);

  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  let relRoles;
  if (user) {
    relRoles = user.roles.map((role) => role.name);
  }
  let isAllowed = !!user && relRoles.includes("Admin");

  const handleClickCloseNewAccount = () => {
    setOpenModal(false);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleOptionChange = (optionId) => {
    const isChecked = roles.includes(optionId);
    let updatedOptions;

    if (isChecked) {
      updatedOptions = roles.filter((id) => id !== optionId);
    } else {
      updatedOptions = [...roles, optionId];
    }
    console.log(updatedOptions);
    setRoles(updatedOptions);

    const updatedRolesList = updatedOptions?.join("%2C");
    navigate(
      `.?pageNo=0&email=${inputSearchAccount.current.value}&roles=${updatedRolesList}&pageSize=${rowsPerPage}`
    );
  };
  const handleOnClickClearFilter = () => {
    setSearchParams("");

    setSearchEmail("");
    setRoles([]);
    inputSearchAccount.current.value = "";
    navigate(`./`);
  };
  console.log(searchEmail);
  console.log(loading);
  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">Configuration / Accounts</div>

        <div className="main-content-title">
          <div className="title-account">Account Management</div>
          <button
            className="button-create-new-account"
            onClick={() => setOpenModal(true)}
          >
            New Account
          </button>
        </div>
        <div className="action">
          <div className="form-search-account">
            <div className="icon-search-input">
              <SearchIcon />
            </div>
            <input
              type="text"
              className="form-input-search-account"
              placeholder="Search Account"
              name="email"
              htmlFor="email"
              ref={inputSearchAccount}
              defaultValue={searchEmail}
              onChange={handleChangeName}
            />
            <div ref={dropdownRef}>
              <div className="filter-role-dropdown" onClick={toggleDropdown}>
                <FilterDropdown />
                <span className="button-filter-role-dropdown">Choose Role</span>
              </div>
              {isDropdownVisible && (
                <div className="dropdown-list-role">
                  {ROLES().map((role, index) => (
                    <dl key={index} className="dropdown_item-role">
                      <input
                        type="checkbox"
                        className="dropdown-item-checkbox-role"
                        value={role}
                        checked={roles.includes(role)}
                        onChange={() => {
                          handleOptionChange(role);
                        }}
                      />
                      <span className="dropdown-item-name">{role}</span>
                    </dl>
                  ))}
                </div>
              )}
            </div>
            <input type="hidden" name="roles" htmlFor="roles" value={roles} />
            <input
              type="hidden"
              name="pageNo"
              htmlFor="pageNo"
              value={pageNo}
            />
          </div>
          <button
            className="button-clear-filter"
            onClick={() => handleOnClickClearFilter()}
          >
            Clear Filter
          </button>
        </div>
      </div>
      <div className="account-info-table">
        {loading && (
          <div className="loading-spinner">
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          </div>
        )}
        {!loading && (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {total > 0 && (
              <AccountTableMUI
                page={pageNo}
                totalPages={total}
                data={data}
                rowsPerPage={rowsPerPage}
              />
            )}

            {Number.parseInt(total) === 0 && <h3>No accounts found</h3>}
            {error && (
              <div className="error-boundary">
                <img
                  src="/src/assets/images/notFound.png"
                  alt="not found"
                ></img>
                <h2 className="error-server-message">Something went wrong!</h2>
              </div>
            )}

            {total > 0 && (
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25]}
                count={total}
                page={pageNo}
                onPageChange={(event, page) =>
                  navigate(
                    `.?pageNo=${page}&email=${email}&roles=${searchRoles}&pageSize=${rowsPerPage}`
                  )
                }
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  navigate(
                    `.?pageNo=0&email=${email}&roles=${searchRoles}&pageSize=${event.target.value}`
                  );
                }}
              />
            )}
          </Paper>
        )}
      </div>

      {isOpenModal && (
        <CreateNewAccountModal
          title={"New Account"}
          email={""}
          onDiscard={handleClickCloseNewAccount}
          total={total}
          rowsPerPage={Number.parseInt(rowsPer)}
        />
      )}
      <ToastContainer />
    </>
  );
}

export default AccountManage;
