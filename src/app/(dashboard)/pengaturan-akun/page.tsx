"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { updateUser } from "@/lib/user-actions"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { CircleLoader } from "@/components/ui/circle-loader"


// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().optional(), // Make password optional for updates
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role tidak valid" }),
  }),
  // Add other fields as necessary
});

type UpdateFormValues = z.infer<typeof userFormSchema>;

export default function UpdateUserPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Initialize form
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER", // Default role, can be changed based on your logic
      
    },
  });
  
  // Populate form with user data when session is loaded
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Session user:", session.user); // Debug session data
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        password: "", // Leave password field empty by default
      });
    }
  }, [session, status, form]);

  async function onSubmit(values: UpdateFormValues) {
    console.log("Form submitted with values:", values); // Debug form values

    setIsSubmitting(true);
    
    try {
      // Include the user's ID from the session
      const updatedValues = {
        ...values,
        id: session?.user?.id || "", // Include user ID for the update
      };
      console.log("Sending update request with:", updatedValues); // Debug update payload

      // Only include password if it was provided
      const dataToUpdate = values.password?.trim()
        ? updatedValues 
        : { 
            id: updatedValues.id,
            name: updatedValues.name,
            email: updatedValues.email,
            role: updatedValues.role,
          };
      
      await updateUser(dataToUpdate);
      toast.success("Profil berhasil diperbarui");
      
      // Refresh the session to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(`Gagal memperbarui profil: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-96">
              <CircleLoader className="h-12 w-12" />
      </div>
    );
  }
  
  return (
    <div className="grid w-full grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex w-full flex-col gap-3 row-start-2 items-center sm:items-start">
        <h2 className="text-2xl/7 font-bold sm:truncate sm:text-5xl sm:tracking-tight mb-6 pl-8">
          Pengaturan Profil Akun
        </h2>
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="text-sm text-gray-500 mb-4">
              Perbarui informasi profil dan kata sandi Anda
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Pengguna" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="E-mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru (kosongkan jika tidak ingin mengubah)</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Kosongkan jika tidak ingin mengubah" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()} 
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


