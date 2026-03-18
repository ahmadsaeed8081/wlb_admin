import AdminLayout from "@/components/AdminLayout";
import { CloudCog, Upload } from "lucide-react";
import galleryWide from "@/assets/icon/Gallery Wide.png";
import icon from '@/assets/icon/Add Circle.png';
import { useState, useRef, useEffect } from "react";

import { useWeb3Modal,useWeb3ModalTheme } from '@web3modal/wagmi/react'
import { useAccount, useReadContract, useWriteContract } from "wagmi";
const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    reward: "",
    description: "",
    category: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isConnected,isDisconnected,chain } = useAccount()
  const { address } = useAccount();
  const [categories, setCategories] = useState<{ name: string; image: string }[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [newCategoryPreview, setNewCategoryPreview] = useState<string | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    // setShowCategoryModal(true)
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.weblifebiz.com/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle product image selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle category image selection
  const handleCategoryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCategoryImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setNewCategoryPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle creating new category
  const handleCreateCategory = async () => {
    if (isDisconnected) {
      alert("kindly connect your wallet");
      return
    }

    if(address.toLowerCase() != import.meta.env.VITE_WC_OWNER.toLowerCase()){
      alert("only owner can perform this action ");
      return
    }

    if (!newCategoryName || !newCategoryImage) return alert("Name and image required!");
      alert(newCategoryName)
    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);
      formData.append("image", newCategoryImage);
      console.log(formData)

      const res = await fetch("https://api.weblifebiz.com/api/categories/create", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": import.meta.env.VITE_WC_APIKEY
        }
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.error || "Failed to create category");
      console.log(data.error)

      // Add new category to local state
      setCategories((prev) => [...prev, data.category]);
      setForm({ ...form, category: data.category.name });

      // Reset modal
      setShowCategoryModal(false);
      setNewCategoryName("");
      setNewCategoryImage(null);
      setNewCategoryPreview(null);

      alert("Category created successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Handle product submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisconnected) {
      alert("kindly connect your wallet");
      return
    }

    if(address.toLowerCase() != import.meta.env.VITE_WC_OWNER.toLowerCase()){
      alert("only owner can perform this action ");
      return
    }
    if (!selectedFile) return alert("Please select an image!");
    if (!form.category) return alert("Select a category!"+form.category);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("reward", form.reward);
      formData.append("description", form.description);
      formData.append("image", selectedFile);
      formData.append("category", form.category);

      const res = await fetch("https://api.weblifebiz.com/api/products/create", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": import.meta.env.VITE_WC_APIKEY
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      alert("Product uploaded successfully: " + data.product.name);
      setForm({ name: "", price: "", reward: "", description: "", category: "" });
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 max-w-2xl space-y-5">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Product Name</label>
              <input
                className="w-full bg-transparent border border-[#413A5B] rounded-xl px-4 py-3 text-foreground text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Price</label>
              <input
                type="number"
                className="w-full bg-transparent border border-[#413A5B] rounded-xl px-4 py-3 text-foreground text-sm"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="100 USDT"
                required
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Reward</label>
              <input
                type="number"
                className="w-full bg-transparent border border-[#413A5B] rounded-xl px-4 py-3 text-foreground text-sm"
                value={form.reward}
                onChange={(e) => setForm({ ...form, reward: e.target.value })}
                placeholder="12,550 WIBIZ"
                required
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Description</label>
              <textarea
                className="w-full bg-transparent border border-[#413A5B] rounded-xl px-4 py-3 text-foreground text-sm min-h-[110px] resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description..."
                required
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-2 block">Choose Categories</label>
              <div className="relative">
                <select
                  className="w-full bg-transparent border border-[#413A5B] rounded-xl px-4 py-3 text-foreground text-sm"
                  value={form.category}
                  onChange={(e) => {
                    if (e.target.value === "add_new") setShowCategoryModal(true);
                    else setForm({ ...form, category: e.target.value });
                  }}
                  required
                >
                  {categories.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}</option>
                  ))}
                  <option value="add_new">+ Add New Category</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full my-5 gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 text-sm"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Image Upload */}
        <div className="flex-1 lg:max-w-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <div
            className="relative rounded-xl p-8 flex flex-col items-center justify-center gap-5 min-h-[350px] cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {previewImage ? (
              <div className="relative w-full">
                <img src={previewImage} alt="Preview" className="w-full max-h-[250px] object-contain rounded-lg" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-primary-foreground flex items-center justify-center text-xs font-bold hover:opacity-80 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <img src={galleryWide} alt="Upload" className="w-14 h-14 object-contain" />
                <p className="text-foreground font-semibold text-lg">Drag/upload image</p>
                <button
                  className="gradient-connect px-6 py-2.5 rounded-xl text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <img src={icon} alt="" />
                  Upload image
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl p-6 w-full max-w-md relative">
            <h3 className="text-lg font-bold mb-4 gradient-text">Add New Category</h3>
            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input type="file" onChange={handleCategoryImage} />
            {newCategoryPreview && <img src={newCategoryPreview} className="mt-2 w-32 h-32 object-contain" />}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCategoryModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleCreateCategory} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AddProduct;