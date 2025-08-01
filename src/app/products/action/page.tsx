"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/lib/features/authApiSlice";
import { ProductType } from "@/types/productType";
import React, { useState } from "react";
import Image from "next/image";

export default function Page() {
  const { data = [], isLoading, refetch } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [form, setForm] = useState<{
    title: string;
    price: number;
    images: string[];
    description?: string;
    categoryId?: number;
  }>({
    title: "",
    price: 0,
    images: [],
    description: "",
  });
  const [editing, setEditing] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing) {
      await updateProduct({ id: editing, ...form });
      refetch();
    } else {
      await createProduct(form);
      refetch();
    }
    setForm({
      title: "",
      price: 0,
      images: [],
    });
    setEditing(null);
  };

  return (
    <div className=" mx-auto py-10 flex w-[90%] gap-10">
      <div className="w-[40%]">
        {" "}
        <h1 className="text-2xl font-bold mb-6">Product Manager</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Images (comma separated URLs)"
            value={form.images.join(",")}
            onChange={(e) =>
              setForm({ ...form, images: e.target.value.split(",") })
            }
            className="w-full border px-3 py-2 rounded"
          />
          {!editing ? (
            <>
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="description"
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                placeholder="Category ID (optional)"
                value={form.categoryId !== undefined ? String(form.categoryId) : ""}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </>
          ) : (
            <></>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editing ? "Update Product" : "Create Product"}
          </button>
          {editing && (
            <button
              type="button"
              className="ml-4 px-4 py-2 rounded bg-gray-300"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className="w-[60%] h-[100vh] overflow-scroll">
        {" "}
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-4">
            {data.map((product: ProductType) => (
              <li
                key={product.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-10">
                  <div>
                    <Image
                      width={100}
                      height={100}
                      src={
                        product.images[0] || "https://via.placeholder.com/150"
                      }
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="font-bold">{product.title}</div>
                    <div className="text-gray-500">${product.price}</div>
                  </div>

                  {/* Only show title, price, and images */}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-400 rounded text-white"
                    onClick={() => {
                      setForm({
                        title: product.title,
                        price: product.price,
                        images: product.images || [],
                      });
                      setEditing(product.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 rounded text-white"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
