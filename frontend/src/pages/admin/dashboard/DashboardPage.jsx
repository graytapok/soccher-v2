import React, { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";
import Heading from "../../../components/Heading";

function DashboardPage() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("admin/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d.users));
  }, []);

  console.log(data);

  return (
    <div className="ranking">
      <Heading title="Admin Dashboard" />
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
            atribute: "followed_leagues",
            sortable: false,
          },
          5: {
            name: "Followed Matches",
            atribute: "followed_matches",
            sortable: false,
          },
          7: {
            name: "Admin",
            atribute: "admin",
            sortable: true,
          },
          8: {
            name: "Confirmed Email",
            atribute: "email_confirmed",
            sortable: true,
          },
        }}
        sorting={{ by: "id", order: "desc" }}
        tbody={data}
        settings={{
          info: "info",
          delete: "admin/delete/user",
          update: "admin/dashboard",
          data: "users",
        }}
      />
    </div>
  );
}

export default DashboardPage;
