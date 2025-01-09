import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const handleChange = (e) => {
    const { id, checked, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log('Selected Files:', selectedFiles); // Debug log
    setFiles(selectedFiles);
  };
  
  const handleImageSubmit = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
  
    if (!user) {
      return setImageUploadError("User is not authenticated.");
    }
  
    const totalImages = files.length + formData.imageUrls.length;
    if (files.length === 0 || totalImages > 6) {
      return setImageUploadError("You can only upload 6 images per listing");
    }
  
    setUploading(true);
    setImageUploadError(null);
  
    try {
      for (let file of files) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          throw new Error("Image upload failed (50 MB max per image)");
        }
      }
  
      const urls = await Promise.all(files.map((file) => storeImage(file)));
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch (error) {
      setImageUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };
  
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };
  
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
    if (+formData.regularPrice < +formData.discountPrice) return setError("Discount Price must be lower than regular price");
  
    setLoading(true);
    setError(null);
  
    try {
      const res = await fetch("https://realestates-apllication.onrender.com/api/listing/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
  
      const data = await res.json();
      setLoading(false);
      console.log("Server response:", data); 
      if (!data.success) {
        return setError(data.message);
      }
      if (!data._id) {
        return setError("Failed to create listing: Missing listing ID");
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  return (
    <main className="p-3 max-w-4xl mx-auto">
    <h1 className="text-3xl font-semibold text-center my-7">
      Create Listing
    </h1>
    <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 flex-1">
        <input
          onChange={handleChange}
          value={formData.name}
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg"
          id="name"
          maxLength="62"
          minLength="10"
          required
        />
        <textarea
          onChange={handleChange}
          value={formData.description}
          type="text"
          placeholder="Description"
          className="border p-3 rounded-lg"
          id="description"
          maxLength="500"
          minLength="10"
          required
        />
        <input
          onChange={handleChange}
          value={formData.address}
          type="text"
          placeholder="Address"
          className="border p-3 rounded-lg"
          id="address"
          required
        />
        <div className="flex gap-6 flex-wrap">
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              type="checkbox"
              id="sale"
              className="w-5"
              checked={formData.type === "sale"}
            />
            <span>Sale</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={formData.type === "rent"}
              type="checkbox"
              id="rent"
              className="w-5"
            />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={formData.parking}
              type="checkbox"
              id="parking"
              className="w-5"
            />
            <span>Parking Space</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={formData.furnished}
              type="checkbox"
              id="furnished"
              className="w-5"
            />
            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={formData.offer}
              type="checkbox"
              id="offer"
              className="w-5"
            />
            <span>Offer</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              onChange={handleChange}
              value={formData.bedrooms}
              className="p-3 border border-grey-300 rounded-lg"
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
            />
            <p>Bedrooms</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              onChange={handleChange}
              value={formData.bathrooms}
              className="p-3 border border-grey-300 rounded-lg"
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
            />
            <p>Bathrooms</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              onChange={handleChange}
              value={formData.regularPrice}
              className="p-3 border border-grey-300 rounded-lg"
              type="number"
              id="regularPrice"
              min="50"
              max="1000000"
              required
            />
            <div className="flex flex-col items-center">
              <p className="text-semibold"> Price</p>
              {formData.type === "rent" && (
                <span className="text-semibold text-xs">($ / month)</span>
              )}
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.discountPrice}
                className="p-3 border border-grey-300 rounded-lg"
                type="number"
                id="discountPrice"
                min="0"
                max="1000000"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <p className="font-semibold">
          Images:
          <span className="font-normal text-gray-700 ml-2">
            The First Image Will Be The Cover (max 6)
          </span>
        </p>
        <div className="flex gap-4">
          <input
            onChange={handleFileChange}
            type="file"
            id="images"
            accept="image/*"
            multiple
            className="p-3 border-gray-700 rounded w-full"
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            disabled={uploading}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <p className="text-red-700 text-sm">
          {imageUploadError && imageUploadError}
        </p>
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between p-3 border items-center"
            >
              <img
                src={url}
                alt="listing image"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-70"
              >
                Delete
              </button>
            </div>
          ))}
        <button
          disabled={loading || uploading}
          type="submit"
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </div>
    </form>
  </main>
  )  
}

export default  CreateListing