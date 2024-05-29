import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";

import { Helmet } from "react-helmet-async";

import { usePageVisibility } from "react-page-visibility";

import { Context } from "../..";

const HelmetSeo = observer(() => {
  const store = useContext(Context).user;
  const isPageVisible = usePageVisibility();
  const [title, setTitle] = useState(store.totalUnread > 0 ? `(${store.totalUnread}) PigeonMailer` : "PigeonMailer");

  useEffect(() => {
    setTitle(store.totalUnread > 0 ? `(${store.totalUnread}) PigeonMailer` : "PigeonMailer");
  }, [store.totalUnread]);

  useEffect(() => {
    if (!isPageVisible) {
      document.title = store.totalUnread > 0 ? `(${store.totalUnread}) PigeonMailer` : "PigeonMailer";
    }
  }, [isPageVisible, store.totalUnread]);

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
});
export default HelmetSeo;
