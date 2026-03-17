import AdminLayout from "@/components/AdminLayout";
import { useState, useEffect } from "react";
import profile from "@/assets/icon/profile.png";

interface KycEntry {
  no: number;
  name: string;
  Lname: string;
  phone: string;
  work: string;
  home: string;
  city: string;
  country: string;
  wallet: string;
  status: "pending" | "accepted" | "declined";
}

const ManageKYC = () => {

  const [kycData, setKycData] = useState<KycEntry[]>([]);

  // fetch KYC users
  const fetchKycUsers = async () => {
    try {

      const res = await fetch("http://187.127.99.119:8000/api/admin/pending-users", {

      });

      const data = await res.json();

      if (!data.users) {
        setKycData([]);
        return;
      }

      const formatted = data.users.map((u:any, index:number) => ({
        no: index + 1,
        name: u.name || "N/A",
        Lname: u.Lname || "N/A",
        phone: u.phone || "N/A",
        home: u.address || "N/A",
        city: u.city || "N/A",
        country: u.country || "N/A",

        // idPid: u.idFrontImage || profile,
        wallet: u.walletAddress,
        status: u.status
      }));

      setKycData(formatted);

    } catch (error) {
      console.error("Fetch KYC Error:", error);
    }
  };

  useEffect(() => {
    fetchKycUsers();
  }, []);

  // update status
  const handleAction = async (wallet:string, action:"approved"|"declined") => {

    try {

      await fetch("http://187.127.99.119:8000/api/admin/update-user-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_WC_APIKEY
        },
        body: JSON.stringify({
          walletAddress: wallet,
          status: action
        })
      });

      fetchKycUsers(); // refresh

    } catch (error) {
      console.error("Update Error:", error);
    }

  };

  return (
    <AdminLayout>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-foreground text-2xl font-bold">KYC Manage</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl">
        <table className="w-full text-sm">

          <thead className="thead-gradient-b">
            <tr>
              <th className="py-4 px-4 text-left">No.</th>
              <th className="py-4 px-4 text-left">Name</th>
              {/* <th className="py-4 px-4 text-left">Last Name</th> */}

              <th className="py-4 px-4 text-left">Phone</th>
              {/* <th className="py-4 px-4 text-left">Work Address</th> */}
              <th className="py-4 px-4 text-left">wallet Address</th>
              <th className="py-4 px-4 text-left"> Address</th>

              <th className="py-4 px-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {kycData.map((k, i) => (

              <tr key={i} className="border-b border-border/40">

                <td className="py-4 px-4">{k.no}</td>
                <td className="py-4 px-4 font-medium">{k.name}{ k.Lname}</td>
                {/* <td className="py-4 px-4 font-medium"></td> */}
                <td className="py-4 px-4">{k.phone}</td>
                <td className="py-4 px-4">{k.wallet}</td>
                <td className="py-4 px-4">{k.home},{k.city},{k.country}</td>

                {/* <td className="py-4 px-4">
                  <span className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={k.idPid}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </span>
                </td> */}

                <td className="py-4 px-4">

                  {k.status === "pending" ? (

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleAction(k.wallet, "approved")}
                        className="px-4 py-2 text-xs bg-green-500 text-white rounded-lg"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleAction(k.wallet, "declined")}
                        className="px-4 py-2 text-xs bg-red-500 text-white rounded-lg"
                      >
                        Decline
                      </button>

                    </div>

                  ) : (

                    <span
                      className={`px-4 py-2 text-xs rounded-lg ${
                        k.status === "accepted"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {k.status === "accepted" ? "Accepted" : "Declined"}
                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </AdminLayout>
  );
};

export default ManageKYC;