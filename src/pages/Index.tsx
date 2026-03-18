import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import icon1 from '@/assets/icon/user.png';
import icon2 from '@/assets/icon/invest.png';
import icon3 from '@/assets/icon/popup.png';
import { useAccount, useReadContract, useWriteContract } from "wagmi";

interface Stat {
  title: string;
  value: string;
  icon: any;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: Stat) => (
  <div className="border border-border rounded-2xl p-8 flex flex-col items-center gap-3 bg-[#1A0936] hover:border-primary/40 transition-colors">
    <img src={Icon} alt={title} />
    <p className="text-foreground text-sm">{title}</p>
    <p className="text-foreground font-bold text-xl">{value}</p>
  </div>
);

const Index = () => {
  const { address } = useAccount();

  const [stats, setStats] = useState<Stat[]>([
    { title: "Total Users", value: "0", icon: icon1, color: "bg-stat-purple" },
    { title: "Total Products Sold", value: "0", icon: icon2, color: "bg-stat-green" },
    { title: "Total Invest", value: "0 WIBIZ", icon: icon2, color: "bg-stat-green" },
    { title: "Total Reward Given", value: "0 WIBIZ", icon: icon3, color: "bg-stat-orange" },
    { title: "Total Reward Claimed", value: "0 WIBIZ", icon: icon3, color: "bg-stat-orange" },
    { title: "Total Reward Unclaimed", value: "0 WIBIZ", icon: icon3, color: "bg-stat-orange" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://api.weblifebiz.com/api/admin/summary`);
        const data = await res.json();
        
        if (data.success) {
          setStats([
            { title: "Total Users", value: data.totalUsers.toString(), icon: icon1, color: "bg-stat-purple" },
            { title: "Total Sold Products", value: data.totalProductsSold.toString(), icon: icon2, color: "bg-stat-green" },
            { title: "Total Earning", value: `WIBIZ ${data.totalBusiness}`, icon: icon2, color: "bg-stat-green" },
            { title: "Total Distributed Reward", value: `WIBIZ ${data.totalRewardGiven}`, icon: icon3, color: "bg-stat-orange" },
            { title: "Total Claimed Reward", value: `WIBIZ ${data.totalClaimedReward}`, icon: icon3, color: "bg-stat-orange" },
            { title: "Total Unclaimed Reward", value: `WIBIZ ${data.totalUnclaimedReward}`, icon: icon3, color: "bg-stat-orange" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
    </AdminLayout>
  );
};

export default Index;