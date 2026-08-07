"use client";
import Image from "next/image";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { useUser } from "../provider/userContext";
const User = () => {
  return (
    <>
      <h2>Firt Name:Liaqat Paindah</h2>
    </>
  );
};

const about = () => {
  const user = useUser();
  const [userName, setUserName] = useState("");
  const fileInputs = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState("");
  const handlePreview = () => {
    const file = fileInputs.current?.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };
  return (
    <div className="flex flex-col-2 mt-20 justify-center">
      {preview ? (
        <Image src={preview} alt="Profile Preview" width={200} height={200} />
      ) : (
        <p>No Profile Provided of {user.name}</p>
      )}
      <form>
        <label htmlFor="UserName">UserName:</label>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-fuchsia-200 px-2 my-2 py-1.5 rounded-sm"
          type="text"
          id="UserName"
          name="UserName"
        />

        <label htmlFor="UserName">Set Profile:</label>
        <input
          ref={fileInputs}
          className="w-full border border-fuchsia-200 px-2 my-2 py-1.5 rounded-sm"
          type="file"
          onChange={handlePreview}
          id="profile"
          name="profile"
        />

        <button
          type="submit"
          className="bg-fuchsia-400 rounded-sm cursor-pointer hover:bg-gray-100 border hover:border-fuchsia-400 hover:text-fuchsia-400 px-2 py-1.5 text-sm w-full"
        >
          Set Profile
        </button>
      </form>
    </div>
  );
};

export default about;
