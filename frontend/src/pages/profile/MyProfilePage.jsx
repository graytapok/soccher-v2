import React, { useContext } from "react";
import { Context } from "../../App";
import styled from "styled-components";
import Matches from "../../components/Matches";
import Leagues from "../../components/Leagues";

const ProfileComponent = styled.div`
  .profile {
    display: flex;
    z-index: 1;
    margin-left: 25px;
  }
`;

function ProfilePage() {
  const { followedMatches, followedLeagues } = useContext(Context);

  console.log(followedLeagues);

  return (
    <ProfileComponent>
      <div className="profile">
        <Leagues
          title="Followed leagues"
          leagues={followedLeagues}
          message="Your followed leagues will apear here!"
          redirect="/profile"
        />
        <Matches
          title="Followed matches"
          matches={followedMatches}
          message="Your followed matches will apear here!"
          redirect="/profile"
        />
      </div>
    </ProfileComponent>
  );
}

export default ProfilePage;
