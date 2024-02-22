import "../assets/styles/personalInfo.css";
import ArrowRight from "../components/icons/ArrowRight";
// import AuthService from "../services/auth.service";
import { useEffect, useState } from "react";
import IdentifyInformation from "../components/IdentifyInformation";
// import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function PersonalInfo() {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserService.getUser();
        console.log("User data:", data.data);
        handleGetUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const handleGetUser = (data) => {
      setUser(data);
    };

    fetchData();
  }, []);
  // console.log(user);
  let relRoles;
  if (user) {
    relRoles = user.roles.map((role) => role.name);
  }
  let isAllowed = !!user;
  //   React.useEffect(() => {
  //     const verify = async () => {
  //       if (!user && !isAllowed) {
  //         navigate("/login");
  //       }
  //     };
  //     verify();
  //   }, [localStorage]);
  return isAllowed ? (
    <>
      <div className="personal__info">
        <div className="personal__info--content">
          <header className="personal__info--header">
            <img
              className="personal__info--image"
              src={user.avatar || "src/assets/images/user_null.png"}
              alt="image-profile"
            />
            <div className="personal__info--name">
              <span>Welcome,</span>
              <span> {user.name} </span>
              <span className="personal__info--role">
                {relRoles ? relRoles[0].toUpperCase() : "ADMIN"}
              </span>
            </div>
            <div className="personal__info--discription">
              Manage your info, privacy, and security to make SETA system work
              better for you. Learn more
            </div>
          </header>
          <div className="personal__info--body">
            <section className="personal__info--body__content">
              <div className="personal__info--profile">
                <div className="personal__info--profile__body">
                  <div className="personal__info--structure">
                    <div className="personal__info--profile__title">
                      <h2>Your profile info in BlueOC services</h2>
                    </div>
                    <p className="personal__info--profile__discription">
                      Personal info and options to manage it. You can make some
                      of this info, like your contact details, visible to others
                      so they can reach you easily. You can also see a summary
                      of your profiles.
                    </p>
                  </div>
                  <figure className="personal__info--profile__image">
                    <img
                      src="src/assets/images/personal-info/personal-info.jpg"
                      alt=""
                    />
                  </figure>
                </div>
              </div>
              <div className="personal__info--profile">
                <div className="personal__info--profile__basic">
                  <div className="basic__info">
                    <div>
                      <div className="basic__info--body">
                        <header className="basic__info--header">
                          <div className="basic__info--header__structure">
                            <h2 className="basic__info--title">
                              Basic information
                            </h2>
                            <div>
                              <div className="basic__info--discription">
                                Some info may be visible to other people using
                                SETA services.
                                <a
                                  href="http://"
                                  className="basic__info--learn-more"
                                >
                                  {" "}
                                  Learn more
                                </a>
                              </div>
                            </div>
                          </div>
                        </header>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <button
                        type="button"
                        className="basic__info--body basic__info--body__more"
                      >
                        <div className="basic__info--body__content basic__info--body__content--link">
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Photo</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div>
                                      A picture helps people recognize you and
                                      lets you know when you’re signed in to
                                      your account
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--image">
                                <img
                                  className="basic__info--image__link"
                                  src={
                                    user.avatar ||
                                    "src/assets/images/user_null.png"
                                  }
                                  alt=""
                                />
                              </figure>
                              <div>
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Name</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      {user.name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Birthday</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      {user.dob || "----"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Hired date</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      NULL
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Gender</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      {user.gender === true ? "Male" : "Female"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal__info--profile">
                <div className="personal__info--profile__basic">
                  <div className="basic__info">
                    <div>
                      <div className="basic__info--body">
                        <header className="basic__info--header">
                          <div>
                            <h2>Contact info</h2>
                            <div></div>
                          </div>
                        </header>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Email</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Phone</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      {user.phone_number}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal__info--profile">
                <div className="personal__info--profile__body">
                  <div className="personal__info--structure">
                    <div className="personal__info--profile__title">
                      <h2>Other info and preferences for SETA services</h2>
                    </div>
                    <p className="personal__info--profile__discription">
                      Ways to verify it’s you and settings for the web.
                    </p>
                  </div>
                  <figure className="personal__info--profile__image">
                    <img
                      src="src/assets/images/personal-info/personal-contact.jpg"
                      alt=""
                    />
                  </figure>
                </div>
              </div>
              <div className="personal__info--profile personal__info--profile__half-left">
                <div className="personal__info--profile__basic">
                  <div className="basic__info">
                    <div>
                      <div className="basic__info--body">
                        <header className="basic__info--header">
                          <div>
                            <h2>Contact info</h2>
                            <div></div>
                          </div>
                        </header>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Password</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      ************
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal__info--profile personal__info--profile__half-right">
                <div className="personal__info--profile__basic">
                  <div className="basic__info">
                    <div>
                      <div className="basic__info--body">
                        <header className="basic__info--header">
                          <div>
                            <h2>Biometric info</h2>
                            <div></div>
                          </div>
                        </header>
                      </div>
                    </div>
                    <div>
                      <div className="vertical"></div>
                      <div className="basic__info--body basic__info--body__more">
                        <a
                          href=""
                          className="basic__info--body__content basic__info--body__content--link"
                        >
                          <div className="basic__info--parent">
                            <div className="basic__info--child">
                              <div className="basic__info--body__content--photo">
                                <div className="basic__info--photo">
                                  <div>
                                    <div>Name</div>
                                  </div>
                                </div>
                                <div className="basic__info--discription">
                                  <div>
                                    <div className="basic__info--discription__content">
                                      {user.name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <figure className="basic__info--icon">
                                <ArrowRight />
                              </figure>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal__info--profile">
                <div className="personal__info--profile__body">
                  <div className="personal__info--structure">
                    <div className="personal__info--profile__title">
                      <h2>Additional information</h2>
                    </div>
                    <p className="personal__info--profile__discription">
                      Additional information for employees after entering the
                      company
                    </p>
                  </div>
                  <figure className="personal__info--profile__image">
                    <img
                      src="src/assets/images/personal-info/personal-more-info.jpg"
                      alt=""
                    />
                  </figure>
                </div>
              </div>
              <IdentifyInformation
                title="Identify information"
                info={user.user_detail.identify_information}
                list={[
                  "ID number",
                  "Issue date",
                  "Place of issue",
                  "Permanent residence",
                  "Old ID/ID number",
                  "Current accommodation",
                  "Social Insurance ID",
                  "Vietcombank number",
                ]}
              />
              <IdentifyInformation
                title="Education information"
                info={user.user_detail.education_information}
                list={[
                  "University",
                  "Graduation year",
                  "Degree",
                  "Majors",
                  "Technologies",
                  "Certificates",
                ]}
              />
              <IdentifyInformation
                title="Other information"
                info={user.user_detail.other_information}
                list={[
                  "Marital status",
                  "Phone number of relatives when need to contact",
                  "Hobbies",
                  "Number of children",
                  "First child information",
                  "Second child information",
                  "Motorcycle license plate",
                ]}
              />
            </section>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default PersonalInfo;
