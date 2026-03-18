import AdminLayout from "@/components/AdminLayout";
import { Image, Trash2, Edit3 } from "lucide-react";
import trash from '@/assets/icon/Trash.png';
import edit from '@/assets/icon/Edit.png';
import profile from '@/assets/icon/profile.png';
import { useState, useEffect } from "react";

import { useWeb3Modal,useWeb3ModalTheme } from '@web3modal/wagmi/react'
import { useAccount, useReadContract, useWriteContract } from "wagmi";

const EditProduct = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    reward: "",
    description: "",
    category: "Electronics",
    image: null as File | null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { open, close } = useWeb3Modal()
  const { isConnected,isDisconnected,chain } = useAccount()
  const { address } = useAccount();
  // ---------------------------
  // Fetch products from backend
  // ---------------------------
  const fetchProducts = async () => {
    const res = await fetch("https://api.weblifebiz.com/api/products"
    );
    const data = await res.json();
    setProducts(data);
    console.log(data)
  };

  useEffect(() => {
    fetchProducts();
  },[]);

  // ---------------------------
  // Open edit modal
  // ---------------------------
  const handleEditClick = (product: any) => {
    if (isDisconnected) {
      alert("kindly connect your wallet");
      return
    }

    if(address.toLowerCase() != import.meta.env.VITE_WC_OWNER.toLowerCase()){
      alert("only owner can perform this action ");
      return
    }
    setSelectedProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      reward: product.reward,
      description: product.description,
      category: product.category,
      image: null
    });
    setPreviewImage(product.image ? `https://api.weblifebiz.com${product.image}` : null);
    setShowModal(true);
  };

  // ---------------------------
  // Handle image change
  // ---------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ---------------------------
  // Handle form submit
  // ---------------------------
  const handleUpdate = async () => {
    if (isDisconnected) {
      alert("kindly connect your wallet");
      return
    }

    if(address.toLowerCase() != import.meta.env.VITE_WC_OWNER.toLowerCase()){
      alert("only owner can perform this action ");
      return
    }
    if (!selectedProduct) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", String(form.price));
    formData.append("reward", String(form.reward));
    formData.append("description", form.description);
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch(`https://api.weblifebiz.com/api/products/${selectedProduct._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_WC_APIKEY
        }
      }
    );
      if (res.ok) {
        fetchProducts();
        setShowModal(false);
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (isDisconnected) {
      alert("kindly connect your wallet");
      return
    }

    if(address.toLowerCase() != import.meta.env.VITE_WC_OWNER.toLowerCase()){
      alert("only owner can perform this action ");
      return
    }

    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`https://api.weblifebiz.com/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_WC_APIKEY
        }
      });
      const data = await res.json();
      alert(data.message);
      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Edit Products</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="thead-gradient-b">
              <th className="text-left py-4 px-4 font-semibold">ID</th>
              <th className="text-left py-4 px-4 font-semibold">Name</th>
              <th className="text-left py-4 px-4 font-semibold">Description</th>
              <th className="text-left py-4 px-4 font-semibold">Reward</th>
              <th className="text-left py-4 px-4 font-semibold">Image</th>
              <th className="text-left py-4 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b hover:bg-secondary/20">
                <td className="py-5 px-4">{i + 1}</td>
                <td className="py-5 px-4 font-medium">{p.name}</td>
                <td className="py-5 px-4">{p.description}</td>
                <td className="py-5 px-4">{p.reward}</td>
                <td className="py-5 px-4 w-20 h-16">
                  <img src={p.image ? `http://187.127.99.119:8000${p.image}` : profile} className="w-full h-full object-contain" alt={p.name} />
                </td>
                <td className="py-5 px-4 flex gap-2">
                  <button onClick={() => handleDelete(p._id)} 
           style={{borderRadius:'12px'}}
           className="w-12 border-gradient-90-img h-12 rounded-xl border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                             
                  >
                    <img src={trash} alt="" />
                  </button>
                  <button
                        style={{borderRadius:'12px'}}
                        className="w-12 border-gradient-90-img h-12 rounded-xl border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"
                        onClick={() => handleEditClick(p)}
                     >
                        <img src={edit} alt="Edit" />
                      </button>
                  {/* <button onClick={() => handleEditClick(p)} className="border px-2 py-1 rounded bg-blue-100 hover:bg-blue-200">
                    <img src={edit} alt="" />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-500 rounded-xl p-6 w-full max-w-lg relative shadow-2xl">
      <h3 className="text-lg font-bold mb-4 text-white">Edit Product</h3>
      <div className="space-y-4">
        <input
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Reward"
          value={form.reward}
          onChange={(e) => setForm({ ...form, reward: e.target.value })}
        />
        <textarea
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Gaming">Gaming</option>
        </select>
        <div>
          <input type="file" onChange={handleImageChange} />
          {previewImage && <img src={previewImage} className="mt-2 w-32 h-32 object-contain rounded-lg border-2 border-white" />}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border-2 border-white text-white rounded hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </AdminLayout>
  );
};

export default EditProduct;