import React, { useEffect, useState, createContext } from "react";
import AdminTable from "./components/AdminTable";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";
import EditUser from "./components/EditUser";
import CreateUser from "./components/CreateUser";
import styled from "styled-components";

export const AdminDashboardContext = createContext();

const DashboardPageComponent = styled.div`
  & {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

function DashboardPage() {
  const [data, setData] = useState({});

  const [showEditUser, setShowEditUser] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [editedUser, setEditedUser] = useState();

  const toggleCreateUser = () => {
    setShowCreateUser((prev) => !prev);
    setShowEditUser(false);
  };

  const toggleEditUser = (user = null) => {
    setShowEditUser((prev) => !prev);
    setShowCreateUser(false);
    if (user) {
      setEditedUser(user);
    }
  };

  const updateData = () => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
      });
  };

  useEffect(() => {
    updateData();
  }, [showCreateUser, showEditUser]);

  return (
    <AdminDashboardContext.Provider
      value={{
        toggleEditUser,
        toggleCreateUser,
        editedUser,
      }}
    >
      <Heading title="Admin Dashboard">
        {!showCreateUser && (
          <Button onClick={() => toggleCreateUser()}>Create User</Button>
        )}
      </Heading>
      <DashboardPageComponent>
        {!showEditUser && !showCreateUser ? (
          <AdminTable
            head={{
              2: { name: "Id", atribute: "id", sortable: true },
              3: {
                name: "Username",
                atribute: "username",
                sortable: true,
              },
              4: { name: "Email", atribute: "email", sortable: true },
              6: {
                name: "Followed Leagues",
                /* atribute: ["followedLeagues", "ids"],
                atribute_array: true, */
                sortable: false,
              },
              5: {
                name: "Followed Matches",
                /* atribute: ["followedMatches", "ids"],
                atribute_array: true, */
                sortable: false,
              },
              7: {
                name: "Admin",
                atribute: "admin",
                sortable: true,
              },
              8: {
                name: "Confirmed Email",
                atribute: "emailConfirmed",
                sortable: true,
              },
            }}
            sorting={{ by: "id", order: "desc" }}
            tbody={data}
            settings={{
              delete: "/admin/delete/user",
              update: updateData,
              edit: toggleEditUser,
            }}
          />
        ) : showEditUser ? (
          <EditUser />
        ) : (
          showCreateUser && <CreateUser />
        )}
      </DashboardPageComponent>
    </AdminDashboardContext.Provider>
  );
}

export default DashboardPage;
