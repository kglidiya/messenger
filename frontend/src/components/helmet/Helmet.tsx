import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";

import { Context } from "../..";

const HelmetSeo = observer(() => {
  const userStore = useContext(Context).user;

  // console.log("userStore.totalUnread", userStore.totalUnread);
  return (
    <Helmet>
      {/* <a href='example.com' title='My site'>
        {" "}
        Link{" "}
      </a> */}

      {/* <div>My Stuff</div> */}

      {userStore.totalUnread > 0 ? (
        // eslint-disable-next-line no-useless-concat
        <title>{`(${userStore.totalUnread}) PigeonMailer`}</title>
      ) : (
        <title>PigeonMailer</title>
      )}
      {/* <title>{`${(<span>{userStore.totalUnread > 0 && userStore.totalUnread}</span>)} PigeonMailerd`}</title> */}
      {/* <title>{`${(<Counter messages={toJS(userStore.totalUnread)} />)} PigeonMailerd`}</title> */}
    </Helmet>
  );
});
export default HelmetSeo;
