import React, { useContext } from "react";
import styled from "styled-components";

import { Context } from "../../../App";
import Matches from "../../../components/Matches";
import Leagues from "../../../components/Leagues";
import Heading from "../../../components/Heading";

const ProfileComponent = styled.div`
  .profile {
    display: flex;
    z-index: 1;
    margin-left: 25px;
  }
`;

function ProfilePage() {
  const { followedMatches, followedLeagues, user } = useContext(Context);

  return (
    <>
      <Heading title={"Profile - " + user.username}>
        <span>Here you can see all of your followed stuff!</span>
      </Heading>
      <ProfileComponent>
        <div className="profile">
          <Leagues
            title="Followed leagues"
            leagues={followedLeagues.map((element) => {
              return element.details;
            })}
            message="Your followed leagues will apear here!"
          />
          <Matches
            title="Followed matches"
            matches={followedMatches.map((element) => {
              return element.details;
            })}
            message="Your followed matches will apear here!"
          />
        </div>
      </ProfileComponent>
    </>
  );
}

export default ProfilePage;
