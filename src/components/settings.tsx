"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import Image from "next/image";

// ✅ Validation Schema
const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  address1: z.string().min(2, "Address is required"),
  logo: z.any(), 
});

export default function SaccoCompanyForm() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      address1: "",
      logo: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.logo || !(data.logo instanceof File)) {
      alert("Please select a valid logo file.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("companyName", data.companyName);
      formData.append("address1", data.address1);
      formData.append("logo", data.logo);

      const response = await fetch("/api/saccosettings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        setSuccessMessage("SACCO company registered successfully!");
        form.reset();
        setLogoPreview(null);
      } else {
        alert(result.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      form.setValue("logo", file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-5 grid grid-cols-2 gap-2"
      >
        {/* Company Name */}
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* File Upload */}
        <div className="col-span-2">
          <FormLabel>Company Logo</FormLabel>
          <div className="flex gap-4 items-center">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {logoPreview && (
              <Image
                src={logoPreview}
                alt="Logo Preview"
                width={80}
                height={80}
                className="rounded border"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          {successMessage && (
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
        </div>
      </form>
    </Form>
  );
}
