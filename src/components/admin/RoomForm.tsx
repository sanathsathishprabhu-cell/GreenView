"use client";

import { useState, useRef } from "react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Room, RoomCategory } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES: RoomCategory[] = ["Deluxe", "Suite", "Villa", "Penthouse"];

interface Props {
  initialData?: Partial<Room>;
  roomId?: string;
  mode: "create" | "edit";
}

export default function RoomForm({ initialData, roomId, mode }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<RoomCategory>(initialData?.category || "Deluxe");
  const [price, setPrice] = useState(String(initialData?.price || ""));
  const [capacity, setCapacity] = useState(String(initialData?.capacity || "2"));
  const [size, setSize] = useState(String(initialData?.size || ""));
  const [beds, setBeds] = useState(initialData?.beds || "");
  const [view, setView] = useState(initialData?.view || "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [amenities, setAmenities] = useState(initialData?.amenities?.join(", ") || "");
  const [available, setAvailable] = useState(initialData?.available ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageUrls.length + newImageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setNewImageFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeExistingImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of newImageFiles) {
      const storageRef = ref(storage, `rooms/${Date.now()}-${file.name}`);
      await new Promise<void>((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, file);
        task.on("state_changed",
          (snap) => setUploadProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
          reject,
          async () => {
            const url = await getDownloadURL(storageRef);
            urls.push(url);
            resolve();
          }
        );
      });
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !capacity) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const uploadedUrls = await uploadImages();
      const allImages = [...imageUrls, ...uploadedUrls];

      const roomData = {
        name, category, price: Number(price), capacity: Number(capacity),
        size: Number(size) || 0, beds, view, shortDescription, description,
        amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
        available, featured, images: allImages,
        updatedAt: serverTimestamp(),
      };

      if (mode === "create") {
        await addDoc(collection(db, "rooms"), { ...roomData, createdAt: serverTimestamp() });
        toast.success("Room created successfully");
      } else if (roomId) {
        await updateDoc(doc(db, "rooms", roomId), roomData);
        toast.success("Room updated successfully");
      }
      router.push("/admin/rooms");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="pt-16 lg:pt-0 p-6 lg:p-10 min-h-screen">
      <div className="mb-8 pt-4">
        <Link href="/admin/rooms" className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-charcoal-light/50 hover:text-gold transition-colors mb-4">
          <ChevronLeft className="w-3 h-3" /> Back to Rooms
        </Link>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-charcoal-light/50 mb-1">
          {mode === "create" ? "Add New" : "Edit"} Room
        </p>
        <h1 className="font-serif text-3xl text-charcoal-dark">
          {mode === "create" ? "New Room" : name}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-10">
        {/* Basic Details */}
        <div className="border border-charcoal-light/10 p-6 md:p-8">
          <h2 className="font-serif text-xl text-charcoal-dark mb-6 pb-4 border-b border-charcoal-light/10">Basic Details</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="form-label">Room Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Forest Deluxe Room" className="form-input" />
            </div>
            <div>
              <label className="form-label">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as RoomCategory)} className="form-input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Price Per Night (INR) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" placeholder="18000" className="form-input" />
            </div>
            <div>
              <label className="form-label">Max Capacity *</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" max="20" className="form-input" />
            </div>
            <div>
              <label className="form-label">Room Size (m²)</label>
              <input type="number" value={size} onChange={(e) => setSize(e.target.value)} placeholder="45" className="form-input" />
            </div>
            <div>
              <label className="form-label">Bed Configuration</label>
              <input type="text" value={beds} onChange={(e) => setBeds(e.target.value)} placeholder="1 King Bed" className="form-input" />
            </div>
            <div>
              <label className="form-label">View</label>
              <input type="text" value={view} onChange={(e) => setView(e.target.value)} placeholder="Forest / Mountain / Lake" className="form-input" />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="border border-charcoal-light/10 p-6 md:p-8">
          <h2 className="font-serif text-xl text-charcoal-dark mb-6 pb-4 border-b border-charcoal-light/10">Descriptions</h2>
          <div className="space-y-6">
            <div>
              <label className="form-label">Short Description (Card Preview)</label>
              <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} placeholder="A brief evocative description for room cards" className="form-input resize-none" />
            </div>
            <div>
              <label className="form-label">Full Description (Detail Page)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Full immersive description of the room..." className="form-input resize-none" />
            </div>
            <div>
              <label className="form-label">Amenities (comma-separated)</label>
              <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Wi-Fi, Pool, Fireplace, Butler, Minibar" className="form-input" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border border-charcoal-light/10 p-6 md:p-8">
          <h2 className="font-serif text-xl text-charcoal-dark mb-6 pb-4 border-b border-charcoal-light/10">Images</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {/* Existing */}
            {imageUrls.map((url) => (
              <div key={url} className="relative group aspect-[4/3] overflow-hidden bg-charcoal-light/10">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img src={url} alt="Room" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(url)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {/* New previews */}
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-[4/3] overflow-hidden bg-charcoal-light/10">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-gold px-1.5 py-0.5 font-sans text-[10px] text-white">New</div>
                <button type="button" onClick={() => removeNewImage(i)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {/* Upload button */}
            {imageUrls.length + newImageFiles.length < 5 && (
              <button type="button" onClick={() => fileInput.current?.click()}
                className="aspect-[4/3] border-2 border-dashed border-charcoal-light/20 flex flex-col items-center justify-center gap-2 hover:border-gold/50 transition-colors">
                <ImageIcon className="w-6 h-6 text-charcoal-light/30" />
                <span className="font-sans text-xs text-charcoal-light/40 tracking-wider uppercase">Add Image</span>
              </button>
            )}
          </div>

          <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between font-sans text-xs text-charcoal-light/50 mb-1">
                <span>Uploading…</span><span>{uploadProgress}%</span>
              </div>
              <div className="h-1 bg-charcoal-light/10 rounded">
                <div className="h-1 bg-gold rounded transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="border border-charcoal-light/10 p-6 md:p-8">
          <h2 className="font-serif text-xl text-charcoal-dark mb-6 pb-4 border-b border-charcoal-light/10">Visibility</h2>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 accent-gold" />
              <span className="font-sans text-sm text-charcoal">Available for booking</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-gold" />
              <span className="font-sans text-sm text-charcoal">Featured on homepage</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-solid gap-2 disabled:opacity-60">
            <Upload className="w-4 h-4" />
            {saving ? "Saving..." : mode === "create" ? "Create Room" : "Update Room"}
          </button>
          <Link href="/admin/rooms" className="btn-primary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
