import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";

import { usePageVisibility } from "react-page-visibility";

import { Context } from "../..";

const HelmetSeo = observer(() => {
  const userStore = useContext(Context).user;
  const isPageVisible = usePageVisibility();
  const [title, setTitle] = useState(
    userStore.totalUnread > 0 ? `(${userStore.totalUnread}) PigeonMailer` : "PigeonMailer",
  );

  useEffect(() => {
    setTitle(userStore.totalUnread > 0 ? `(${userStore.totalUnread}) PigeonMailer` : "PigeonMailer");
  }, [userStore.totalUnread]);

  useEffect(() => {
    if (!isPageVisible) {
      document.title = userStore.totalUnread > 0 ? `(${userStore.totalUnread}) PigeonMailer` : "PigeonMailer";
    }
  }, [isPageVisible, userStore.totalUnread]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
});
export default HelmetSeo;
