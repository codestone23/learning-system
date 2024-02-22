import { v4 as uuidv4 } from "uuid";

import IdentifyInformationChild from "./IdentifyInformationChild";
import { Fragment } from "react";
function IdentifyInformation({ title, info, list }) {
  return (
    <div className="personal__info--profile">
      <div className="personal__info--profile__basic">
        <div className="basic__info">
          <div>
            <div className="basic__info--body">
              <header className="basic__info--header">
                <div>
                  <h2>{title}</h2>
                  <div></div>
                </div>
              </header>
            </div>
          </div>
          {list.map((item) => {
            return (
              <Fragment key={uuidv4()}>
                <IdentifyInformationChild
                  titleChild={item}
                  content={info[item]}
                  key={uuidv4()}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default IdentifyInformation;
