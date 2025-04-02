import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  fullName: z.string().min(2, "Full name is required"),
  profile: z.any().optional(),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(10, "Phone number must be at least 10 characters"),
});
interface User {
  id: string;
  profile: string;
  name: string;
  fullName: string;
  email: string;
}

export function Users() {
    const [usersData, setUserData] = useState<User[]>([]);
    const [user, setUser] = useState<z.infer<typeof formSchema> | null>(null);
    const [userPreview, setUserPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/users");
            const data = await response.json();
            setUserData(data);
        };
        fetchData();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || "",
            profile: user?.profile || "",
            email: user?.email || "",
            telephone: user?.telephone || "",
            fullName: user?.fullName || "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                profile: user.profile,
                email: user.email,
                telephone: user.telephone,
                fullName: user.fullName,
            });
            setUserPreview(user.profile || null);
        }
    }, [user, form]);

    const handleRowClick = (selectedUser: User) => {
        setUser(selectedUser);
        setIsDrawerOpen(true); // Open the drawer
    };

    const submitUser = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        setSuccessMessage("");

        try {
            const formData = new FormData();
            formData.append("name", data.name);
           
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("telephone", data.telephone);
            if (data.profile instanceof File) {
                formData.append("profile", data.profile);
            }

            const response = await fetch(`/api/users/${user?.id}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to save user settings.");
            }

            setSuccessMessage("User settings saved successfully!");
            form.reset();
            setUserPreview(null);
            setIsDrawerOpen(false);
        } catch (error) {
            console.error("Error saving user settings:", error);
            alert("Failed to save user settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUserPreview(URL.createObjectURL(file));
            form.setValue("profile", file);
        }
    };

    return (
        <div>
            <Table className="mx-2 w-[70%]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Profile</TableHead>
                        <TableHead>UserName</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usersData.map((item) => (
                        <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer">
                            <TableCell>
                                <img
                                    title="profile"
                                    src={item.profile}
                                    className="w-10 h-10 rounded-full"
                                />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.fullName}</TableCell>
                            <TableCell>{item.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="m-5 rounded-l-xl">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Edit Member</DrawerTitle>
                        </DrawerHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(submitUser)} className="px-5">
                                <h2 className="font-semibold text-neutral-800">
                                    User Settings
                                </h2>
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="telephone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
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
                                /> */}
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
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="destructive">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

