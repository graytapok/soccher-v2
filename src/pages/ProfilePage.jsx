import React, { useContext } from "react";
import { Context } from "../App";

function ProfilePage() {
  const { user } = useContext(Context);
  return <div>Hello {user.name}!</div>;
}

export default ProfilePage;
