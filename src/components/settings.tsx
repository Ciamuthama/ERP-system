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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Users } from "./users";
import Company from "./company";

const saccoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  address: z.string().min(2, "Address is required"),
  logo: z.any().optional(),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  fullName: z.string().min(2, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profile: z.any().optional(),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export default function SaccoCompanyForm() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const saccoForm = useForm({
    resolver: zodResolver(saccoSchema),
    defaultValues: {
      companyName: "",
      address: "",
      logo: null,
      telephone: "",
      email: "",
    },
  });

  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      password: "",
      profile: null,
      email: "",
      telephone: "",
      fullName: "",
    },
  });

  const submitSacco = async (data: z.infer<typeof saccoSchema>) => {
    setLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("companyName", data.companyName);
      formData.append("address", data.address);
      formData.append("telephone", data.telephone);
      formData.append("email", data.email);
      if (data.logo instanceof File) {
        formData.append("logo", data.logo);
      }

      const response = await fetch("/api/saccosettings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save SACCO settings.");
      }

      setSuccessMessage("SACCO settings saved successfully!");
      saccoForm.reset();
      setLogoPreview(null);
    } catch (error) {
      console.error("Error saving SACCO settings:", error);
      alert("Failed to save SACCO settings.");
    } finally {
      setLoading(false);
    }
    window.location.reload()
  };

  const submitUser = async (data: z.infer<typeof userSchema>) => {
    setLoading(true);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("password", data.password);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("telephone", data.telephone);
      if (data.profile instanceof File) {
        formData.append("profile", data.profile);
      }

      const response = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save user settings.");
      }

      setSuccessMessage("User settings saved successfully!");
      userForm.reset();
      setUserPreview(null);
    } catch (error) {
      console.error("Error saving user settings:", error);
      alert("Failed to save user settings.");
    } finally {
      setLoading(false);
    }
    window.location.reload()
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      saccoForm.setValue("logo", file);
    }
  };

  const handleUserImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserPreview(URL.createObjectURL(file));
      userForm.setValue("profile", file);
    }
  };

  return (
    <div className="mt-10 flex justify-around gap-5 w-full">
      <div className="flex flex-col gap-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create New Company Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Company Profile Settings</DialogTitle>
              <DialogDescription className="text-red-500">
                Note any changes here will remove your current settings
              </DialogDescription>
            </DialogHeader>
            <div>
              <Form {...saccoForm}>
                <form
                  onSubmit={saccoForm.handleSubmit(submitSacco)}
                  className=""
                >
                  <FormField
                    control={saccoForm.control}
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
                  <FormField
                    control={saccoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="w-[15rem]" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={saccoForm.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-[15rem]" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={saccoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-[15rem]" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormLabel>Company Logo</FormLabel>
                  <div className="flex gap-4 items-center mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
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

                  <div className="col-span-2 mt-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        <Company />
      </div>

      <div className="flex flex-col gap-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                This will create an new User
              </DialogDescription>
            </DialogHeader>
            <div>
              <Form {...userForm}>
                <form
                  onSubmit={userForm.handleSubmit(submitUser)}
                  className="px-5"
                >
                  <h2 className="font-semibold text-neutral-800">
                    User Settings
                  </h2>
                  <FormField
                    control={userForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 px-3 text-black"
                            >
                              {showPassword ? (
                                <EyeIcon className="size-4" />
                              ) : (
                                <EyeSlashIcon className="size-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="col-span-3">
                    <FormLabel>User Image</FormLabel>
                    <div className="flex gap-4 items-center mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleUserImage}
                      />
                      {userPreview && (
                        <Image
                          src={userPreview}
                          alt="Logo Preview"
                          width={80}
                          height={80}
                          className="rounded border"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save User Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        <Users />
      </div>

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
    </div>
  );
}
