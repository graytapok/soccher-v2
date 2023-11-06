import React, { useContext } from "react";
import FollowedMatches from "./components/FollowedMatches";
import { Context } from "../../App";

function ProfilePage() {
  const { user } = useContext(Context);
  return (
    <>
      <FollowedMatches />
    </>
  );
}

export default ProfilePage;
