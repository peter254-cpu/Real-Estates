import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const {currentUser} = useSelector((state) => state.user)
  const params = useParams()
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`https://realestates-apllication.onrender.com/api/listing/get/${listingId}`)
      const data = await res.json()
      setFormData(data)
      if(data.success === false){
        console.log(data.message)
        return
      }

    }
    fetchListing()
  })
  const handleChange = (e) => {
    if(e.target.id == 'sale' || e.target.id === 'rent'){
        setFormData({
            ...formData,
            type: e.target.id
        })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === e.target.id === 'offer'){
        setFormData({
            ...formData,
            [e.target.id]: e.target.checked
        })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === "textarea"){
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
  };
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(stroreImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const stroreImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uplaod is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
        if(+formData.regularPrice < +formData.discountPrice) return setError('Discount Price must be lower than regular price')
        setLoading(true)
        setError(false)
        const res = await fetch(`https://realestatesclient.onrender.com/api/listing/update/${params.listingId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                userRef: currentUser._id
            })
        })
        const data = await res.json()
        setLoading(false);
        if(data.success === false){
            setError(data.message)
        }
        navigate(`/listing/${data._id}`)
    } catch (error) {
        setError(error.message)
        setLoading(false)
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update A Listing
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
            maxLength="62"
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
                type="furnished"
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
            <div className="flex  items-center gap-2">
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
            <div className="flex  items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-grey-300 rounded-lg"
                type="number"
                id="bathooms"
                min="1"
                max="10"
                required
              />
              <p>Bathooms</p>
            </div>
            <div className="flex  items-center gap-2">
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
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer &&(
                <div className="flex items-center gap-2">
                    <input
                        onChange={handleChange}
                        value={formData.discountPrice}
                        className="p-3 border border-grey-300 rounded-lg"
                        type="number"
                        id="discountPrice"
                        min="50"
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
          <p className="font-semibold ">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The First Image Will Be The Cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="images/*"
              multiple
              className="p-3 border-gray-700 rounded w-full "
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
                  className="p-3  text-red-700 rounded-lg uppercase hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || uploading } type="submit" className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Updating Listing...' : 'Update Listing' }
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
