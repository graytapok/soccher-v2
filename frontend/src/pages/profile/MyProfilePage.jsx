import React, { useContext, useEffect } from "react";
import { Context } from "../../App";
import Matches from "../../components/Matches";

function ProfilePage() {
  const { followedMatches } = useContext(Context);

  return (
    <>
      <Matches
        title="Followed matches"
        matches={followedMatches}
        message="Your followed matches will apear here!"
        redirect="/profile"
      />
    </>
  );
}

export default ProfilePage;
